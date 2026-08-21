import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { ENRICHMENT_SCHEMA_VERSION } from './enrichment-contract.mjs';

const ITEM_STATUSES = new Set(['pending', 'running', 'completed', 'rejected', 'retry_wait', 'failed']);

function nowIso() {
  return new Date().toISOString();
}

function stableJson(value) {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${stableJson(value[key])}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

function hash(value) {
  let out = 2166136261;
  for (const char of stableJson(value)) {
    out ^= char.charCodeAt(0);
    out = Math.imul(out, 16777619);
  }
  return (out >>> 0).toString(36);
}

function paths(dir, jobId) {
  const jobDir = path.resolve(dir, jobId);
  return {
    jobDir,
    job: path.join(jobDir, 'job.json'),
    items: path.join(jobDir, 'items.json'),
  };
}

async function atomicWriteJson(file, value) {
  await mkdir(path.dirname(file), { recursive: true });
  const tmp = `${file}.${process.pid}.${Date.now()}.tmp`;
  await writeFile(tmp, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
  await rename(tmp, file);
}

async function readJson(file, fallback) {
  try {
    return JSON.parse(await readFile(file, 'utf8'));
  } catch (error) {
    if (error?.code === 'ENOENT') return fallback;
    throw error;
  }
}

export async function createEnrichmentLedger({ dir, jobId, mode = 'test', model = null, now = nowIso() }) {
  if (!dir) throw new Error('ledger dir required');
  if (!/^[a-z0-9][a-z0-9._:-]{2,96}$/i.test(jobId ?? '')) throw new Error('stable jobId required');
  if (!['test', 'sample', 'live'].includes(mode)) throw new Error('invalid ledger mode');

  const p = paths(dir, jobId);
  const existingJob = await readJson(p.job, null);
  const existingItems = await readJson(p.items, null);
  if (existingJob) {
    if (existingJob.schema_version !== ENRICHMENT_SCHEMA_VERSION) throw new Error('ledger schema version mismatch');
    if (existingJob.mode !== mode) throw new Error(`ledger mode mismatch: expected ${existingJob.mode}`);
    if (!Array.isArray(existingItems)) throw new Error('ledger items are missing or invalid');
    return { dir: p.jobDir, job: existingJob, items: existingItems };
  }
  if (existingItems !== null) throw new Error('ledger job metadata is missing');
  const job = {
    job_id: jobId,
    schema_version: ENRICHMENT_SCHEMA_VERSION,
    mode,
    status: 'created',
    attempt_count: 0,
    model,
    created_at: now,
    updated_at: now,
    checkpoint: { cursor: 0, planned: 0, completed: 0, failed: 0 },
  };
  await atomicWriteJson(p.job, job);
  await atomicWriteJson(p.items, []);
  return { dir: p.jobDir, job, items: [] };
}

export async function loadEnrichmentLedger({ dir, jobId }) {
  const p = paths(dir, jobId);
  return {
    dir: p.jobDir,
    job: await readJson(p.job, null),
    items: await readJson(p.items, []),
  };
}

async function persistLedger(ledger, now = nowIso()) {
  ledger.job.updated_at = now;
  ledger.job.checkpoint = summarizeEnrichmentLedger(ledger);
  await atomicWriteJson(path.join(ledger.dir, 'job.json'), ledger.job);
  await atomicWriteJson(path.join(ledger.dir, 'items.json'), ledger.items);
  return ledger;
}

function canonicalId(record) {
  if (record?.event_id) return String(record.event_id);
  if (Number.isInteger(record?.entry_number)) return `entry:${record.entry_number}`;
  return `record:${hash(record)}`;
}

function makeItem(record, { now = nowIso(), model = null, checkpoint = {} } = {}) {
  const id = canonicalId(record);
  return {
    canonical_id: id,
    entry_number: Number.isInteger(record?.entry_number) ? record.entry_number : null,
    status: 'pending',
    phase: 'queued',
    attempt_count: 0,
    last_attempt_at: null,
    last_error: null,
    next_retry_at: null,
    model,
    source_verification_state: 'unknown',
    enrichment_state: 'not_started',
    quality_gate_result: { status: 'not_run', errors: [] },
    persistence_state: 'not_started',
    index_state: 'not_started',
    input_fingerprint: hash(record),
    checkpoint,
    created_at: now,
    updated_at: now,
  };
}

export async function upsertEnrichmentLedgerItems(ledger, records, options = {}) {
  const existing = new Map(ledger.items.map(item => [item.canonical_id, item]));
  for (const record of records) {
    const id = canonicalId(record);
    const item = existing.get(id);
    const nextFingerprint = hash(record);
    if (item) {
      item.entry_number = Number.isInteger(record?.entry_number) ? record.entry_number : item.entry_number;
      if (item.input_fingerprint !== nextFingerprint) {
        item.status = 'pending';
        item.phase = 'queued';
        item.last_error = null;
        item.next_retry_at = null;
        item.source_verification_state = 'unknown';
        item.enrichment_state = 'not_started';
        item.quality_gate_result = { status: 'not_run', errors: [] };
        item.persistence_state = 'not_started';
        item.index_state = 'not_started';
        item.lease_id = null;
        item.lease_expires_at = null;
      }
      item.input_fingerprint = nextFingerprint;
      item.updated_at = options.now ?? nowIso();
      continue;
    }
    ledger.items.push(makeItem(record, options));
  }
  ledger.job.status = ledger.items.length ? 'planned' : ledger.job.status;
  return persistLedger(ledger, options.now);
}

export async function claimEnrichmentLedgerItems(ledger, { limit = 1, leaseId = null, leaseMs = 15 * 60 * 1000, now = nowIso() } = {}) {
  const claimTime = new Date(now).getTime();
  if (!Number.isFinite(claimTime)) throw new Error('valid claim time required');
  const safeLeaseMs = Number.isFinite(leaseMs) && leaseMs > 0 ? Math.floor(leaseMs) : 15 * 60 * 1000;
  const claimed = [];
  for (const item of ledger.items) {
    const leaseExpired = item.status === 'running'
      && item.lease_expires_at
      && new Date(item.lease_expires_at).getTime() <= claimTime;
    if (leaseExpired) {
      item.status = 'pending';
      item.phase = 'queued';
      item.last_error = 'lease expired before completion';
      item.lease_id = null;
      item.lease_expires_at = null;
      item.updated_at = now;
    }
    if (claimed.length >= Math.max(0, limit)) break;
    const retryReady = item.status === 'retry_wait' && item.next_retry_at && new Date(item.next_retry_at).getTime() <= claimTime;
    if (item.status !== 'pending' && !retryReady) continue;
    item.status = 'running';
    item.phase = 'enriching';
    item.attempt_count += 1;
    item.last_attempt_at = now;
    item.last_error = null;
    item.lease_id = leaseId;
    item.lease_expires_at = new Date(claimTime + safeLeaseMs).toISOString();
    item.updated_at = now;
    claimed.push(item);
  }
  ledger.job.attempt_count = (ledger.job.attempt_count ?? 0) + claimed.length;
  ledger.job.status = claimed.length ? 'running' : ledger.job.status;
  await persistLedger(ledger, now);
  return claimed;
}

export async function completeEnrichmentLedgerItem(ledger, canonical_id, result = {}) {
  const now = result.now ?? nowIso();
  const item = ledger.items.find(entry => entry.canonical_id === canonical_id);
  if (!item) throw new Error(`unknown ledger item: ${canonical_id}`);
  const qualityStatus = result.quality_gate_result?.status;
  if (!['ready', 'rejected'].includes(qualityStatus)) throw new Error('explicit ready or rejected quality gate result required');
  item.status = qualityStatus === 'ready' ? 'completed' : 'rejected';
  item.phase = item.status;
  item.model = result.model ?? item.model;
  item.source_verification_state = result.source_verification_state ?? item.source_verification_state;
  item.enrichment_state = result.enrichment_state ?? 'normalized';
  item.quality_gate_result = result.quality_gate_result ?? { status: qualityStatus, errors: [] };
  item.persistence_state = result.persistence_state ?? 'not_started';
  item.index_state = result.index_state ?? 'not_started';
  item.checkpoint = { ...item.checkpoint, ...(result.checkpoint ?? {}) };
  item.updated_at = now;
  item.lease_id = null;
  item.lease_expires_at = null;
  return persistLedger(ledger, now);
}

export async function failEnrichmentLedgerItem(ledger, canonical_id, { error, nextRetryAt = null, terminal = false, now = nowIso() } = {}) {
  const item = ledger.items.find(entry => entry.canonical_id === canonical_id);
  if (!item) throw new Error(`unknown ledger item: ${canonical_id}`);
  item.status = terminal ? 'failed' : 'retry_wait';
  item.phase = item.status;
  item.last_error = String(error?.message ?? error ?? 'unknown error').slice(0, 1000);
  item.next_retry_at = terminal ? null : nextRetryAt;
  item.updated_at = now;
  item.lease_id = null;
  item.lease_expires_at = null;
  return persistLedger(ledger, now);
}

export function summarizeEnrichmentLedger(ledger) {
  const counts = Object.fromEntries([...ITEM_STATUSES].map(status => [status, 0]));
  for (const item of ledger.items) counts[item.status] = (counts[item.status] ?? 0) + 1;
  const cursor = ledger.items.reduce((max, item) => Number.isInteger(item.entry_number) ? Math.max(max, item.entry_number) : max, 0);
  return {
    cursor,
    planned: ledger.items.length,
    completed: counts.completed,
    rejected: counts.rejected,
    retry_wait: counts.retry_wait,
    failed: counts.failed,
    running: counts.running,
    pending: counts.pending,
  };
}
