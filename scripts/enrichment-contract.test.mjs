import assert from 'node:assert/strict';
import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { enrichmentGapReasons, isCurrentGoodEnrichment, normalizeEnrichment, toLegacyEntry, validateEnrichment } from './enrichment-contract.mjs';
import { planEnrichmentChunk, runEnrichmentChunk } from './enrichment-chunk.mjs';
import {
  claimEnrichmentLedgerItems,
  completeEnrichmentLedgerItem,
  createEnrichmentLedger,
  failEnrichmentLedgerItem,
  loadEnrichmentLedger,
  summarizeEnrichmentLedger,
} from './enrichment-ledger.mjs';

const validInput = {
  entry_number: 42, title: 'A verified title that is long enough',
  synopsis: 'This verified short summary contains more than fifty characters and only describes the supplied source.',
  medium_summary: 'This medium summary identifies the who, what, and when using only details supported by the supplied report. It adds context for a dossier reader without introducing claims that are absent from the evidence.',
  long_summary: 'This long summary provides the fullest evidence-bounded account of the event. It identifies the people involved, the reported action, the date, and the surrounding context found in the supplied report. It distinguishes what the source documents from what remains an allegation or editorial classification. It does not convert an allegation into a conviction, infer causation from correlation, or invent a quotation, number, relationship, or URL.',
  category: 'Government Corruption', phase: 'White House 2:2', date_start: '2026-08-20',
  people_tags: ['Donald Trump'], sources: [{ url: 'https://example.org/report', title: 'Report', source_type: 'news', status: 'verified', confidence: 1 }],
  danger: 8, authoritarianism: 7, lawlessness: 6, insanity: 5, absurdity: 4,
  evidence_claims: [{ claim: 'The report describes the event.', source_url: 'https://example.org/report' }],
};

test('normalizes a complete event deterministically without inventing optional fields', () => {
  const one = normalizeEnrichment(validInput, { source: 'fixture', model: 'fixture-model', now: '2026-08-20T00:00:00.000Z' });
  const two = normalizeEnrichment(validInput, { source: 'fixture', model: 'fixture-model', now: '2026-08-20T00:00:00.000Z' });
  const result = validateEnrichment(one, validInput);
  assert.equal(result.ok, true);
  assert.equal(one.identity.event_id, two.identity.event_id);
  assert.equal(one.summaries.medium, validInput.medium_summary);
  assert.equal(result.value.quality_status, 'ready');
});

test('quality gate rejects unsupported fields and unsupported evidence', () => {
  const input = { ...validInput, made_up_metric: 99, evidence_claims: [{ claim: 'Unsupported', source_url: 'https://other.example/claim' }] };
  const result = validateEnrichment(normalizeEnrichment(input, { now: '2026-08-20T00:00:00.000Z' }), input);
  assert.equal(result.ok, false);
  assert.match(result.errors.join('\n'), /unsupported field: made_up_metric/);
  assert.match(result.errors.join('\n'), /unsupported evidence claim/);
});

test('quality gate never upgrades an unlabeled source into verified provenance', () => {
  const input = { ...validInput, sources: [{ url: 'https://example.org/report', title: 'Report' }] };
  const result = validateEnrichment(normalizeEnrichment(input, { now: '2026-08-20T00:00:00.000Z' }), input);
  assert.equal(result.ok, false);
  assert.match(result.errors.join('\n'), /source is not verified/);
  assert.match(result.errors.join('\n'), /invalid source confidence/);
});

test('current-good check revalidates ready labels and verified provenance', () => {
  const ready = validateEnrichment(
    normalizeEnrichment(validInput, { now: '2026-08-20T00:00:00.000Z' }),
    validInput,
  ).value;
  assert.equal(isCurrentGoodEnrichment(ready), true);
  const forgedReady = {
    ...ready,
    sources: ready.sources.map(source => ({ ...source, status: null, confidence: null })),
    quality_status: 'ready',
  };
  assert.equal(isCurrentGoodEnrichment(forgedReady), false);
  assert.deepEqual(enrichmentGapReasons(forgedReady), ['verified_source']);
});

test('maps audited legacy phase aliases while retaining the original raw label', () => {
  const aliases = [
    ['Pre-Political Era', 'Pre-Political'], ['Early Business Career', 'Pre-Political'],
    ['Campaign Trail', 'Campaign 2016'], ['Campaign 2020', 'White House 1'],
    ['White House 1', 'White House 1'], ['Between Terms', 'Post-Presidency'],
    ['White House 2', 'White House 2:2'], ['White House 2:2', 'White House 2:2'],
    ['Term 2: Year 2', 'White House 2:2'], ['Presidency 2 (2025–2029)', 'White House 2:2'], ['WH2:2', 'White House 2:2'],
  ];
  for (const [raw, phase] of aliases) {
    const normalized = normalizeEnrichment({ ...validInput, phase: raw }, { now: '2026-08-20T00:00:00.000Z' });
    assert.equal(normalized.era.phase, phase, raw);
    assert.equal(normalized.era.raw_phase, raw, raw);
    assert.equal(validateEnrichment(normalized, { ...validInput, phase: raw }).ok, true, raw);
  }
  const secondTerm = normalizeEnrichment({ ...validInput, phase: 'White House 2' }, { now: '2026-08-20T00:00:00.000Z' });
  assert.equal(toLegacyEntry(secondTerm).phase, 'White House 2:2');
});

test('leaves unknown legacy phases explicitly unmapped and rejects them', () => {
  const normalized = normalizeEnrichment({ ...validInput, phase: 'Unverified future era' }, { now: '2026-08-20T00:00:00.000Z' });
  const result = validateEnrichment(normalized, { ...validInput, phase: 'Unverified future era' });
  assert.equal(normalized.era.phase, null);
  assert.equal(normalized.era.raw_phase, 'Unverified future era');
  assert.equal(normalized.era.status, 'unmapped');
  assert.equal(result.ok, false);
  assert.match(result.errors.join('\n'), /unmapped phase: Unverified future era/);
});

test('chunk planner skips current good records and test mode never persists', async () => {
  const current = validateEnrichment(
    normalizeEnrichment(validInput, { now: '2026-08-20T00:00:00.000Z' }),
    validInput,
  ).value;
  const records = [
    { entry_number: 1, enrichment: current },
    { entry_number: 2, title: 'legacy' }, { entry_number: 3, title: 'legacy' },
  ];
  const plan = planEnrichmentChunk(records, { cursor: 0, limit: 1 });
  assert.deepEqual(plan.candidates.map(row => row.entry_number), [2]);
  assert.equal(plan.checkpoint.skipped_current, 1);
  assert.deepEqual(plan.candidate_reasons[0].reasons.sort(), ['long_summary', 'medium_summary', 'people_tags', 'short_summary', 'verified_source']);
  let writes = 0;
  const result = await runEnrichmentChunk({ records, limit: 2, testMode: true, persist: async () => { writes += 1; } });
  assert.equal(result.writes, 0);
  assert.equal(writes, 0);
});

test('gap audit identifies thin synopsis, missing tags, and missing provenance without inventing replacements', () => {
  const reasons = enrichmentGapReasons({
    entry_number: 99,
    synopsis: 'One sentence only.',
    people_tags: [],
    sources: [],
  });
  assert.deepEqual(reasons.sort(), ['long_summary', 'medium_summary', 'people_tags', 'short_summary', 'verified_source']);
});

test('ledger persists resumable item lifecycle without external writes', async () => {
  const dir = await mkdtemp(path.join(tmpdir(), 'trump-ledger-'));
  const ledger = await createEnrichmentLedger({ dir, jobId: 'fixture-job', mode: 'test', model: 'fixture-model', now: '2026-08-20T00:00:00.000Z' });
  await runEnrichmentChunk({ records: [{ entry_number: 7, title: 'legacy' }], limit: 1, testMode: true, ledger, model: 'fixture-model' });
  assert.equal(ledger.items.length, 1);
  assert.equal(ledger.items[0].status, 'pending');

  const claimed = await claimEnrichmentLedgerItems(ledger, { limit: 1, leaseId: 'lease-a', now: '2026-08-20T00:01:00.000Z' });
  assert.equal(claimed[0].canonical_id, 'entry:7');
  assert.equal(claimed[0].attempt_count, 1);

  await completeEnrichmentLedgerItem(ledger, 'entry:7', {
    quality_gate_result: { status: 'ready', errors: [] },
    source_verification_state: 'event_matched',
    persistence_state: 'test_mode',
    index_state: 'not_started',
    now: '2026-08-20T00:02:00.000Z',
  });
  const reloaded = await loadEnrichmentLedger({ dir, jobId: 'fixture-job' });
  assert.equal(reloaded.items[0].status, 'completed');
  assert.equal(reloaded.items[0].persistence_state, 'test_mode');
  assert.equal(summarizeEnrichmentLedger(reloaded).completed, 1);

  const resumed = await createEnrichmentLedger({ dir, jobId: 'fixture-job', mode: 'test', model: 'ignored-on-resume', now: '2026-08-20T00:03:00.000Z' });
  assert.equal(resumed.items[0].status, 'completed');
  assert.equal(resumed.job.model, 'fixture-model');
});

test('ledger retry checkpoint is not claimed before next retry time', async () => {
  const dir = await mkdtemp(path.join(tmpdir(), 'trump-ledger-'));
  const ledger = await createEnrichmentLedger({ dir, jobId: 'retry-job', mode: 'sample', now: '2026-08-20T00:00:00.000Z' });
  await runEnrichmentChunk({ records: [{ entry_number: 8, title: 'legacy' }], limit: 1, testMode: true, ledger });
  await claimEnrichmentLedgerItems(ledger, { limit: 1, now: '2026-08-20T00:01:00.000Z' });
  await failEnrichmentLedgerItem(ledger, 'entry:8', {
    error: new Error('fixture failure'),
    nextRetryAt: '2026-08-21T00:00:00.000Z',
    now: '2026-08-20T00:02:00.000Z',
  });
  assert.equal((await claimEnrichmentLedgerItems(ledger, { limit: 1, now: '2026-08-20T23:00:00.000Z' })).length, 0);
  assert.equal((await claimEnrichmentLedgerItems(ledger, { limit: 1, now: '2026-08-21T00:00:01.000Z' })).length, 1);
});

test('ledger reclaims expired work and requeues changed inputs', async () => {
  const dir = await mkdtemp(path.join(tmpdir(), 'trump-ledger-'));
  const ledger = await createEnrichmentLedger({ dir, jobId: 'lease-job', mode: 'test', now: '2026-08-20T00:00:00.000Z' });
  await runEnrichmentChunk({ records: [{ entry_number: 9, title: 'legacy one' }], limit: 1, testMode: true, ledger });
  await claimEnrichmentLedgerItems(ledger, {
    limit: 1,
    leaseId: 'interrupted-worker',
    leaseMs: 60_000,
    now: '2026-08-20T00:01:00.000Z',
  });
  assert.equal((await claimEnrichmentLedgerItems(ledger, { limit: 1, leaseId: 'resume-worker', now: '2026-08-20T00:01:30.000Z' })).length, 0);
  const reclaimed = await claimEnrichmentLedgerItems(ledger, { limit: 1, leaseId: 'resume-worker', now: '2026-08-20T00:02:01.000Z' });
  assert.equal(reclaimed[0].canonical_id, 'entry:9');
  assert.equal(reclaimed[0].attempt_count, 2);

  await completeEnrichmentLedgerItem(ledger, 'entry:9', {
    quality_gate_result: { status: 'ready', errors: [] },
    now: '2026-08-20T00:03:00.000Z',
  });
  await runEnrichmentChunk({ records: [{ entry_number: 9, title: 'legacy changed' }], limit: 1, testMode: true, ledger });
  assert.equal(ledger.items[0].status, 'pending');
  assert.equal(ledger.items[0].quality_gate_result.status, 'not_run');
});

test('ledger cannot mark an item complete without an explicit quality-gate result', async () => {
  const dir = await mkdtemp(path.join(tmpdir(), 'trump-ledger-'));
  const ledger = await createEnrichmentLedger({ dir, jobId: 'quality-job', mode: 'test', now: '2026-08-20T00:00:00.000Z' });
  await runEnrichmentChunk({ records: [{ entry_number: 10, title: 'legacy' }], limit: 1, testMode: true, ledger });
  await claimEnrichmentLedgerItems(ledger, { limit: 1, now: '2026-08-20T00:01:00.000Z' });
  await assert.rejects(() => completeEnrichmentLedgerItem(ledger, 'entry:10'), /explicit ready or rejected quality gate result required/);
  assert.equal(ledger.items[0].status, 'running');
});
