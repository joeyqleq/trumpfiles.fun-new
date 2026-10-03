# Worker 14 — account2 release-gate audit

- Rechecked the sample100 packet at `86d71a0bcd9d82301e72bc9f36a4271143c87ddb` and the latest tips of all twelve assigned review branches. The latest tips contain changed sample100 artifact blobs; however, every current per-key batch JSON record is identical to the previously fetched row record. The effective dispositions therefore remain 64 PASS and 36 HOLD, and candidate payloads are selected from the current branch rows.
- Exact coverage: 100 assigned keys, 100 effective results, no missing or duplicate keys. Current effective dispositions remain 64 PASS and 36 HOLD; only the 64 PASS rows appear in the proposal candidate set. No HOLD was promoted.
- All 100 descriptions pass the specified short/medium/long length limits, all 100 identities match, and all 100 impact scores independently recalculate under 0.30/0.20/0.15/0.15/0.10/0.10 with half-up rounding. The proposal set is not SQL and grants no import authorization.
- The latest branch commits also add account5 normalized QA for citation190 packets with 190 distinct keys and no overlap with this sample100 assignment. Those files were excluded from this audit rather than substituted for sample100 QA.

## Open blockers

- Workers 07, 10, and 11 still have no sample100 final exact-set QA artifact on their latest branches; row-level reviews are available.
- Worker 12 sample100 final QA still documents .16/.09 for procedural abuse/self-dealing (weights total .99). All eight score values independently match the expected .15/.10 formula after rounding, but the written formula attestation remains incorrect.
- All 36 record-level holds remain excluded from candidates. Their key-specific reasons are in `exact-blockers.jsonl` and unchanged from the previous integration.
- QA confirms source/provenance fields structurally; source pages were not re-fetched as part of this re-evaluation. No live Neon/database checks or writes, canonical edits, or PR were performed.

Exact source input commits, input hashes, branch tip commits, batch files, and sample100 QA artifact status are recorded in `checkpoint.json` and `independent-qa.json`.
