# Account B description-rescue proposal format

`assignment.json` fixes the 731 odd-position records selected from `merged/descriptions.jsonl` at commit `0089ae722b39edb5180b2496b1f35e2f8fe1ca92`. Sorting is lexicographic and positions are zero-based. Reference packets are context only; see `reference-provenance.json` for the supplemental repair-input commit.

Worker batches are append-only proposals. `repaired` means the reader-facing medium and long descriptions meet 45–90 and 140–300 whitespace-separated words. `supported_partial` preserves useful supported event text with an exact blocker; it may be shorter. `unresolved` identifies the missing evidence or event identity and retains any supported partial text. Corrected wording is labelled separately from the original claim.

Published amendments preserve the earlier batch. A `supersedes_batch` pointer or an explicit worker amendment manifest identifies replacement proposals. Metadata sidecars normalize keys without replacing prose. The final effective index will identify one current proposal location per assigned record and recompute word counts from the published text. Amendment rows are history, not duplicate assignments.

One preserved historical file, `worker-04/batch-002.jsonl`, contains four accidental non-JSON debug lines before its proposal rows. Its clean, explicit replacement is `worker-04/batch-002-superseding.jsonl`. Use the replacement and effective index when reading proposals; do not indiscriminately concatenate all history files.

Checkpoints are immutable snapshots with exact remaining IDs. Root checkpoints and final validation count effective record outcomes, not all historical amendment rows. All files here are review proposals; canonical descriptions, prior histories, scores, assignments elsewhere, app code, and databases are outside this branch's changes.
