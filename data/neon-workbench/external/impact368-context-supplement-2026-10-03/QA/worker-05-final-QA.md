# Worker 05 context-supplement final QA

## Packet and validation

- Supplement packet: `codex/impact368-context-supplement-2026-10-03` at `520015274c29cbcc24a4e54d747e896198756415`.
- Input SHA-256: `b9e387a41c64c49677953971d66c956e610aa77d92f0db0b150f0c0cca0ce497` — pass.
- Exact-set validation: pass — all 31 expected keys appear once and in assigned order across four append-only batches; no other keys.
- Context/source basis: each row was reassessed using its frozen original claim, staged description, supplied source URLs/correction notes, and first-pass row. No external search or new evidence was added.
- Supersession: every row cites `data/neon-workbench/external/five-account-round-2026-10-03/impact368/outputs/worker-05-batch-20261003T103117Z-c186ff3e.jsonl` at commit `7274ef48` as prior provenance; the first-pass output remains unchanged.
- Scoring schema: pass — scored rows have six dimensions in the 0–10 range at one-decimal precision; deferred rows have null dimensions and a record-specific missing fact.
- Formula: `harm×0.30 + reach×0.20 + institutions×0.15 + procedural_abuse×0.15 + self_dealing×0.10 + persistence×0.10`, rounded to two decimals. The weights sum to 1.0, and every emitted total was recomputed and matched.
- Checkpoints: pass — cumulative snapshots at 8, 16, 24, and 31 IDs; prefix sets and status counts match the output rows.

## Scored rows

- `entry-1300` — 1.80; harm 2.0, reach 2.0, institutions 2.0, procedural_abuse 2.0, self_dealing 0.0, persistence 2.0.
- `entry-214` — 1.80; harm 2.0, reach 2.0, institutions 2.0, procedural_abuse 0.0, self_dealing 0.0, persistence 5.0.
- `entry-1491` — 1.50; harm 2.0, reach 2.0, institutions 2.0, procedural_abuse 0.0, self_dealing 0.0, persistence 2.0.
- `entry-6029` — 0.60; harm 0.0, reach 2.0, institutions 0.0, procedural_abuse 0.0, self_dealing 2.0, persistence 0.0.
- `entry-1640` — 1.50; harm 2.0, reach 2.0, institutions 2.0, procedural_abuse 0.0, self_dealing 0.0, persistence 2.0.
- `entry-298` — 1.90; harm 5.0, reach 2.0, institutions 0.0, procedural_abuse 0.0, self_dealing 0.0, persistence 0.0.
- `entry-7070` — 2.10; harm 0.0, reach 8.0, institutions 2.0, procedural_abuse 0.0, self_dealing 0.0, persistence 2.0.

The duplicate missing-files entries `entry-1491` and `entry-1640` receive identical dimensions because the supplied evidence describes the same bounded event; no tie-breaking jitter was added.

## Deferred rows

All 24 rows remain deferred with exact gaps in their `confidence_reason`: `entry-1502`, `entry-170`, `entry-1649`, `entry-224`, `entry-1708`, `entry-1766`, `entry-1213`, `entry-3212`, `entry-2325`, `entry-5509`, `entry-1667`, `entry-6795`, `entry-7151`, `entry-6318`, `entry-3225`, `entry-1370`, `entry-2331`, `entry-5455`, `entry-6156`, `entry-984`, `entry-1717`, `entry-259`, `entry-2238`, and `entry-1925`.

No canonical corpus, Neon data, packet inputs, or other-worker files changed. No PR was opened, as instructed. Application tests and UI capture do not apply to this data-only review; dedicated artifact validation passed.
