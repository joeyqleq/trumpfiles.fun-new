import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { run } from './neon-safe-import.mjs';

async function fixture(t, plan = { version: 1, plan_id: 'fixture', target: 'public.trump_entries', columns: ['description_medium'], rows: [{ entry_number: 11, values: ['reviewed text'] }] }) {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'neon-safe-import-'));
  t.after(() => rm(dir, { recursive: true, force: true }));
  const file = path.join(dir, 'plan.json');
  await writeFile(file, JSON.stringify(plan));
  return { dir, file };
}

test('defaults to content-free dry-run with no database URL', async t => {
  const { dir, file } = await fixture(t);
  const original = console.log;
  const lines = [];
  console.log = value => lines.push(value);
  try { await run({ argv: [file], env: { IMPORT_CHECKPOINT: path.join(dir, 'state.json') } }); }
  finally { console.log = original; }
  assert.equal(JSON.parse(lines[0]).mode, 'dry-run');
  await assert.rejects(readFile(path.join(dir, 'state.json')));
});

test('rejects duplicate IDs, NULL values and oversized plans', async t => {
  for (const rows of [
    [{ entry_number: 1, values: ['x'] }, { entry_number: 1, values: ['y'] }],
    [{ entry_number: 1, values: [null] }],
  ]) {
    const { file } = await fixture(t, { version: 1, plan_id: 'fixture', target: 'public.trump_entries', columns: ['description_medium'], rows });
    await assert.rejects(run({ argv: [file], env: {} }));
  }
  const { file } = await fixture(t, { version: 1, plan_id: 'fixture', target: 'public.trump_entries', columns: ['x'], rows: Array.from({ length: 501 }, (_, i) => ({ entry_number: i + 1, values: ['x'] })) });
  await assert.rejects(run({ argv: [file], env: {} }), /1\.\.500/);
});

test('local exclusive lock rejects a duplicate invocation', async t => {
  const { dir, file } = await fixture(t);
  const checkpoint = path.join(dir, 'state.json');
  const lock = await import('node:fs/promises').then(({ open }) => open(`${checkpoint}.lock`, 'wx'));
  try {
    await assert.rejects(run({ argv: [file], env: { IMPORT_CHECKPOINT: checkpoint } }), /another run holds the local lock/);
  } finally { await lock.close(); }
});

test('a resume checkpoint must match the plan digest', async t => {
  const { dir, file } = await fixture(t);
  const checkpoint = path.join(dir, 'state.json');
  await writeFile(checkpoint, JSON.stringify({ version: 1, plan_id: 'fixture', plan_sha256: 'wrong', next_index: 0 }));
  await assert.rejects(run({ argv: [file, '--apply', '--resume'], env: { IMPORT_CHECKPOINT: checkpoint } }), /IMPORT_CONFIRM=APPLY:fixture/);
});

test('write mode requires explicit plan confirmation before database access', async t => {
  const { file } = await fixture(t);
  await assert.rejects(run({ argv: [file, '--apply'], env: { DATABASE_URL: 'postgres://redacted.invalid/db' } }), /IMPORT_CONFIRM=APPLY:fixture/);
});
