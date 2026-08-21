import { ENRICHMENT_SCHEMA_VERSION, enrichmentGapReasons, isCurrentGoodEnrichment } from './enrichment-contract.mjs';
import { upsertEnrichmentLedgerItems } from './enrichment-ledger.mjs';

/** Pure, resumable planner. It deliberately has no database dependency. */
export function planEnrichmentChunk(records, { cursor = 0, limit = 100 } = {}) {
  const ordered = [...records].filter(record => Number.isInteger(record?.entry_number)).sort((a, b) => a.entry_number - b.entry_number);
  const afterCursor = ordered.filter(record => record.entry_number > cursor);
  const skipped = afterCursor.filter(isCurrentGoodEnrichment);
  const candidates = afterCursor.filter(record => !isCurrentGoodEnrichment(record)).slice(0, Math.max(0, limit));
  const last = candidates.at(-1) ?? afterCursor.at(-1) ?? null;
  return {
    candidates,
    candidate_reasons: candidates.map(record => ({
      entry_number: record.entry_number,
      reasons: enrichmentGapReasons(record),
    })),
    checkpoint: {
      schema_version: ENRICHMENT_SCHEMA_VERSION,
      cursor: last?.entry_number ?? cursor,
      planned: candidates.length,
      skipped_current: skipped.length,
    },
  };
}

/** Test mode never writes corpus data; an optional local ledger may still record resumable checkpoints. */
export async function runEnrichmentChunk({ records, testMode = true, persist, ...options }) {
  const plan = planEnrichmentChunk(records, options);
  if (options.ledger) {
    await upsertEnrichmentLedgerItems(options.ledger, plan.candidates, {
      checkpoint: plan.checkpoint,
      model: options.model ?? null,
    });
  }
  let writes = 0;
  if (!testMode) {
    if (typeof persist !== 'function') throw new Error('persist callback required outside test mode');
    for (const record of plan.candidates) { await persist(record); writes += 1; }
  }
  return { ...plan, test_mode: testMode, writes };
}
