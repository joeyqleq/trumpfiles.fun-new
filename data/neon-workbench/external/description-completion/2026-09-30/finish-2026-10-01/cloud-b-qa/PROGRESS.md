# Cloud B independent impact consistency check

Offline assessment of only the last 10 nonempty records in each worker-01 through worker-12-score-input.jsonl, based on commit d9b92b1f09d85ac4ec0164ad92a8025f5b401340 and supplied RUBRIC.md. Four GPT-6 Luna workers at low reasoning assessed files 01–03, 04–06, 07–09 and 10–12, 30 records each. This is a separate noncanonical check, not score replacement or external claim verification.

## Coverage and arithmetic

- Assigned / completed / unique IDs: **120 / 120 / 120**.
- Scored **120**, deferred **0**, missing **0**, duplicate final IDs **0**.
- Confidence: **101 medium, 19 low, 0 high**.
- Required fields, six dimensions, ID preservation and tenths/range validation pass. 84 entry_numbers are null in the supplied inputs.
- All 12 source-file SHA-256 hashes still match. Existing tracked files remain unchanged.
- Root computes each total using exact Decimal arithmetic: `0.30*harm + 0.20*reach + 0.15*institutions + 0.15*procedural_abuse + 0.10*self_dealing + 0.10*persistence`, rounded HALF_UP to two decimals on the 0–10 scale.
- Ties are retained. Order: descending total, harm, reach, institutions, persistence, then stable record_id.

## Final files and append-only history

Exactly four worker-*/reviewed-results.jsonl files form the final assessed set (paths in verification.json), 30 records each. weighted-totals.jsonl contains their 120 totals. scope.json records exact selection, hashes and preserved IDs. Checkpoints are append-only JSONL.

Root results.jsonl and all worker results.jsonl files preserve superseded passes; these are excluded from final coverage and totals. The initial worker 01–03 stream was written at the root; subsequent passes have dedicated worker paths. Never concatenate historical and final files for ingestion. New files preserve earlier assessments without overwrites.

No existing writing, scores, assignments, scripts or live database changed. No web searches occurred.

## Remaining editorial findings

Review removed unsupported initial floors for ordinary commerce, recipient offenses, audience size and oversight activity. Structural/formula QA pass; semantic consistency is not fully reconciled. Five record-specific finding groups are in consistency-findings.jsonl:

1. Reach anchor conflict: six named clemency recipients in worker 10–12 still have reach=0 while other groups use the individual/small-group anchor of 2. This is a remaining consistency issue, not an approved convention.
2. Clemency persistence: comparable grants span 0–2; clarify whether legal relief counts as persistence when no damaging effect is stated.
3. Court-event scope: clarify whether judicial-event packets score the protective ruling alone or the underlying packet-described conduct. The court ruling itself is not misconduct; avoid discarding attributed findings or duplicating harm across related entries.
4. Misinformation: clarify false messaging as harm versus an identified downstream effect or credible threat. Attention cannot substitute for affected population.
5. Prospective policies: clarify immediate filing/announcement versus exposure under a requested policy, retaining realized/proposed/threatened distinctions.

All observations remain provisional for coordinator review. No canonical scoring or live database action was performed.
