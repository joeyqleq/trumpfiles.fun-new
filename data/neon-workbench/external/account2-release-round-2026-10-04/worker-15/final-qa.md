# Worker 15 account3 release-gate audit

Audited 368 exact, unique assigned keys from 12 fetched account3 branches. The independent gate identifies **21 eligible proposed score-only assessments and 347 blocked keys**.

Release-ready is a proposal for the impact-v2 assessment row only. It does not approve or release any public headline/description. Every hold and deferred disposition stays blocked. No source URLs were fetched or revalidated in this release-only pass.

Weighted formula: `round_half_up(0.30*harm + 0.20*reach + 0.15*institutions + 0.15*procedural_abuse + 0.10*self_dealing + 0.10*persistence, 2)`.
Independent formula results: 79 scored rows matched; 0 failed; 289 rows were deferred or otherwise had no scored dimensions.

## Eligible proposed score-only keys

entry-1200, entry-1589, entry-1660, entry-2226, entry-5726, entry-7056, entry-5366, entry-1000, entry-3205, entry-6278, entry-1304, entry-1496, entry-5388, entry-6992, entry-6985, entry-1789, entry-1428, entry-5449, entry-5507, entry-2231, entry-4057

## Explicit blockers

347 keys remain blocked. Normalized disposition counts: `{"defer": 70, "hold": 246, "hold_deferred": 25, "hold_scored_copy_unapproved": 6, "pass": 19, "score_ready": 2}`.

Every ledger row preserves its normalized reasons and exact missing facts/gaps. Worker 12 rows use terminal `decision` values rather than `status`; these are normalized as deferred and remain blocked.

Exact assignment checks: 12/12 worker sets and orderings match the 368-key manifest. Worker-ready count claims match normalized row flags: 12/12 (claims provided by 12 workers).

Exact worker branch heads, packet commits, source commit references and source file hashes are recorded in `final-qa.json`; ledger and QA hashes are in `checkpoint-final.json`.
