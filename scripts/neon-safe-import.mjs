#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { open, readFile, rename, unlink } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { neon } from '@neondatabase/serverless';

const MAX_BATCH = 10;
const MAX_ROWS = 500;
const MAX_WALL_MS = 15 * 60_000;
const DEFAULT_STMT_MS = 5_000;
const DEFAULT_LOCK_MS = 1_000;
const TABLE = 'public.trump_entries';

function positiveInt(value, name, max) {
  if (!/^\d+$/.test(String(value ?? ''))) throw new Error(`${name} must be a positive integer`);
  const n = Number(value);
  if (!Number.isSafeInteger(n) || n < 1 || n > max) throw new Error(`${name} must be in 1..${max}`);
  return n;
}

function validatePlan(plan) {
  if (plan?.version !== 1 || typeof plan.plan_id !== 'string' || !/^[a-zA-Z0-9._-]{1,80}$/.test(plan.plan_id)) {
    throw new Error('plan requires version=1 and a simple plan_id');
  }
  if (plan.target !== TABLE || !Array.isArray(plan.columns) || !plan.columns.length) {
    throw new Error(`plan target must be ${TABLE} with explicit columns`);
  }
  const cols = new Set(plan.columns);
  if (cols.size !== plan.columns.length || [...cols].some(c => !/^[a-z][a-z0-9_]{0,62}$/.test(c))) {
    throw new Error('plan columns must be unique lowercase SQL identifiers');
  }
  if (cols.has('entry_number')) throw new Error('entry_number is reserved as the row identity');
  if (!Array.isArray(plan.rows) || plan.rows.length < 1 || plan.rows.length > MAX_ROWS) {
    throw new Error(`plan rows must contain 1..${MAX_ROWS} entries`);
  }
  const seen = new Set();
  for (const [i, row] of plan.rows.entries()) {
    if (!Number.isSafeInteger(row?.entry_number) || row.entry_number < 1 || seen.has(row.entry_number)) {
      throw new Error(`row ${i + 1} has invalid or duplicate entry_number`);
    }
    seen.add(row.entry_number);
    if (!Array.isArray(row.values) || row.values.length !== plan.columns.length ||
        row.values.some(v => v !== null && typeof v !== 'string' && typeof v !== 'number' && typeof v !== 'boolean' && typeof v !== 'object')) {
      throw new Error(`row ${i + 1} values must match columns`);
    }
    if (row.values.some(v => v === null)) throw new Error(`row ${i + 1} contains NULL; no-op values are not allowed`);
  }
  return plan;
}

const quoteIdent = value => `"${value.replaceAll('"', '""')}"`;
function updateSql(plan) {
  const assignments = plan.columns.map((c, i) => `${quoteIdent(c)} = $${i + 1}`).join(', ');
  const idParam = plan.columns.length + 1;
  const guards = plan.columns.map(c => `${quoteIdent(c)} IS NULL`).join(' AND ');
  // Fail closed: this runner only fills rows whose target columns are all NULL.
  return `UPDATE ${TABLE} SET ${assignments} WHERE entry_number = $${idParam} AND ${guards} RETURNING entry_number`;
}

async function loadCheckpoint(file, hash, planId) {
  try {
    const state = JSON.parse(await readFile(file, 'utf8'));
    if (state.version !== 1 || state.plan_id !== planId || state.plan_sha256 !== hash ||
        !Number.isSafeInteger(state.next_index) || state.next_index < 0) {
      throw new Error('checkpoint does not match this plan or has invalid progress');
    }
    return state;
  } catch (e) {
    if (e.code === 'ENOENT') return { version: 1, plan_id: planId, plan_sha256: hash, next_index: 0 };
    throw e;
  }
}

async function saveCheckpoint(file, state) {
  const tmp = `${file}.${process.pid}.tmp`;
  const handle = await open(tmp, 'wx', 0o600);
  try { await handle.writeFile(`${JSON.stringify(state, null, 2)}\n`); await handle.sync(); }
  finally { await handle.close(); }
  await rename(tmp, file);
}

export async function run({ env = process.env, argv = process.argv.slice(2), now = () => performance.now() } = {}) {
  const args = new Set(argv.filter(a => a.startsWith('--')));
  const planArg = argv.find(a => !a.startsWith('--'));
  if (!planArg || argv.filter(a => !a.startsWith('--')).length !== 1 || [...args].some(a => !['--apply', '--resume'].includes(a))) {
    throw new Error('usage: node scripts/neon-safe-import.mjs PLAN.json [--apply] [--resume]');
  }
  const planPath = path.resolve(planArg);
  const raw = await readFile(planPath);
  const plan = validatePlan(JSON.parse(raw.toString('utf8')));
  const hash = createHash('sha256').update(raw).digest('hex');
  const batchSize = positiveInt(env.IMPORT_BATCH_SIZE ?? 5, 'IMPORT_BATCH_SIZE', MAX_BATCH);
  const wallMs = positiveInt(env.IMPORT_WALLTIME_MS ?? 600_000, 'IMPORT_WALLTIME_MS', MAX_WALL_MS);
  const statementMs = positiveInt(env.IMPORT_STATEMENT_TIMEOUT_MS ?? DEFAULT_STMT_MS, 'IMPORT_STATEMENT_TIMEOUT_MS', DEFAULT_STMT_MS);
  const lockMs = positiveInt(env.IMPORT_LOCK_TIMEOUT_MS ?? DEFAULT_LOCK_MS, 'IMPORT_LOCK_TIMEOUT_MS', DEFAULT_LOCK_MS);
  const statePath = path.resolve(env.IMPORT_CHECKPOINT ?? `${planPath}.checkpoint.json`);
  const lockPath = `${statePath}.lock`;
  const lock = await open(lockPath, 'wx', 0o600).catch(e => {
    if (e.code === 'EEXIST') throw new Error(`another run holds the local lock: ${lockPath}`);
    throw e;
  });
  const started = now();
  let keepLock = true;
  try {
    if (!args.has('--apply')) {
      console.log(JSON.stringify({ mode: 'dry-run', plan_id: plan.plan_id, plan_sha256: hash,
        rows: plan.rows.length, batch_size: batchSize, walltime_ms: wallMs, state_path: statePath }));
      return;
    }
    if (env.IMPORT_CONFIRM !== `APPLY:${plan.plan_id}`) throw new Error(`set IMPORT_CONFIRM=APPLY:${plan.plan_id} to enable writes`);
    if (!env.DATABASE_URL) throw new Error('DATABASE_URL is required for --apply');
    const url = new URL(env.DATABASE_URL);
    if (url.protocol !== 'postgres:' && url.protocol !== 'postgresql:') throw new Error('DATABASE_URL must use postgres/postgresql');
    let state = await loadCheckpoint(statePath, hash, plan.plan_id);
    if (state.next_index > plan.rows.length) throw new Error('checkpoint progress exceeds plan length');
    if (state.next_index && !args.has('--resume')) throw new Error('checkpoint exists; use --resume after reconciling the last committed batch');
    if (!state.next_index && args.has('--resume')) console.warn('resume requested; checkpoint is at row zero');

    const sql = neon(env.DATABASE_URL);
    const body = updateSql(plan);
    while (state.next_index < plan.rows.length) {
      if (now() - started >= wallMs) throw new Error('hard walltime reached before next batch');
      const begin = state.next_index;
      const batch = plan.rows.slice(begin, begin + batchSize);
      const statements = [
        sql`SELECT set_config('statement_timeout', ${`${statementMs}ms`}, true), set_config('lock_timeout', ${`${lockMs}ms`}, true)`,
        ...batch.map(row => sql.query(body, [...row.values, row.entry_number])),
      ];
      let results;
      let wallTimer;
      try {
        results = await Promise.race([
          sql.transaction(statements, { isolationLevel: 'ReadCommitted' }),
          new Promise((_, reject) => {
            wallTimer = setTimeout(() => reject(new Error('hard walltime reached during database batch; reconcile commit status before resume')), Math.max(1, wallMs - (now() - started)));
          }),
        ]);
      } catch (e) {
        throw new Error(`batch at row ${begin + 1} stopped on first error; checkpoint unchanged; reconcile uncertain transaction status before resuming (${e.code ?? e.name ?? 'database error'})`);
      } finally {
        clearTimeout(wallTimer);
      }
      const writes = results.slice(1);
      for (let i = 0; i < writes.length; i++) {
        if (writes[i].length !== 1 || writes[i][0].entry_number !== batch[i].entry_number) {
          throw new Error(`row ${batch[i].entry_number} failed its NULL-only/idempotency guard; checkpoint unchanged; stop and reconcile`);
        }
      }
      state = { ...state, next_index: begin + batch.length, committed_batches: (state.committed_batches ?? 0) + 1 };
      await saveCheckpoint(statePath, state);
      console.log(`checkpoint advanced through ${state.next_index}/${plan.rows.length}`);
    }
    console.log(`complete: ${state.next_index} rows across ${state.committed_batches ?? 0} committed batches`);
  } finally {
    if (keepLock) { await lock.close(); await unlink(lockPath).catch(() => {}); keepLock = false; }
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  run().catch(error => { console.error(`safe import stopped: ${error.message}`); process.exitCode = 1; });
}
