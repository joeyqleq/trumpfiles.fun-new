# Worker 05 final QA

- Packet commit: `86d71a0bcd9d82301e72bc9f36a4271143c87ddb`
- Input: `data/neon-workbench/external/five-account-round-2026-10-03/impact368/worker-05-input.jsonl`
- Input SHA-256: `c186ff3e172f6da73441c3c03c0ce6955f807af42882de3bcea3d7ad7a94ad21` (matches the assigned checksum)
- Output: `data/neon-workbench/external/five-account-round-2026-10-03/impact368/outputs/worker-05-batch-20261003T103117Z-c186ff3e.jsonl`
- Exact-set validation: PASS — 31 unique records, in the requested order; no missing or extra IDs.
- Schema/source validation: PASS — exact impact-v2 fields; every row has a supplied basis, provenance note, and a record-specific missing fact.
- Scoring decision: all 31 remain deferred with `dimensions: null`; the reviewed packet and existing evidence do not support defensible six-dimension values for any row without adding factual impact claims. Prior scores remain unchanged.
- Formula checked: weighted total convention is `harm×0.30 + reach×0.20 + institutions×0.15 + procedural_abuse×0.15 + self_dealing×0.10 + persistence×0.10` (round the total to two decimals); rubric requires one-decimal dimensions and does not put a composite in worker output. There are no scored rows, so no composite totals are emitted.
- Checkpoints: four append-progress snapshots at 8, 16, 24, and 31 records.
- Scope: no packet input, canonical corpus, database, or application code changed. UI verification and project test scripts do not apply to this data-only review artifact.

- Scoring rubric provenance: `RUBRIC.md` from score-followup commit `539c34d9572db4a234ee9e73a4fe8c1d4b3e373e`; the weighted formula and no-composite worker schema follow that rubric.
- Existing claim/source metadata: historical repository exports `neon_export/trump_entries.json` and `neon_export/trump_sources.json` at commit `244313c14321dbbc0fd4be3f9aef1186277088c0`, and `logs/entries_snapshot.json` blob `c428a724ba57ab14a7a514067e1ad1d4212d7e66` where matching rows exist. Rows without matching export records rely on the supplied packet basis and cited provenance; no external research was added.
