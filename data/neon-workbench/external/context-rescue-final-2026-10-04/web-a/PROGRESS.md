# Web A context rescue — complete

Input frozen at `f30b5cee35140a60c3b7c8fa1715fb55967e4929`. All 20 exclusive Web A IDs received one focused rescue across five fixed, non-overlapping workers.

- 20 terminal IDs; 8 passes; 12 holds; 0 exclusions; 0 remaining.
- Pass IDs: entry-4207, entry-425, entry-4308, entry-5309, entry-5698, entry-5707, entry-5936, entry-6206.
- All passes contain title, short/medium/long descriptions, insight facts with quoted evidence, and separate impact proposals. All eight impact scores are deferred; no dimensions or weighted totals invented.
- Exact-ID, duplicate, schema, word-count, URL syntax/mapping, insight and impact checks passed. 57 unique consulted URLs; inaccessible and wrong-topic URLs are explicitly marked, not treated as supporting evidence.
- The original worker hold for entry-5309 remains in worker-history.jsonl; its documented judgment-date correction is an immutable amendment. Subsequent NARA and hurricane evidence-map corrections are immutable amendments. No second rescue was performed.

`terminal-results.jsonl` contains exactly one initial published terminal result per ID. Apply `amendments.jsonl` in file order for effective proposals, or read `effective-results.jsonl`, the deterministic 20-ID materialized view. `worker-history.jsonl` preserves the initial worker results, including the superseded Foundation hold. `research-log.jsonl` retains research and provenance; its 21 rows include a same-evidence correction log, not 21 rescue attempts. `insight-proposals.jsonl` and `impact-proposals.jsonl` extract the eight separate effective review proposals.

All output is proposal-only. Canonical data, Neon, cloud-worker files, other Web lane, and input history were untouched. Nothing here is editorial release approval.

Reproduce checks: `python data/neon-workbench/external/context-rescue-final-2026-10-04/web-a/validate.py`.
