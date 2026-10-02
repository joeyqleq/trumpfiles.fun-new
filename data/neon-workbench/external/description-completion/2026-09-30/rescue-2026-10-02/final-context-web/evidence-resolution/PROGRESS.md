# Evidence-resolution pass — 58 assigned records

Frozen input: `cbc3be01565c80980bea7039fde6a33f37e5003f` (PR #46). The effective 58 needs_context IDs were derived by applying its saved review patches. The 22 complete IDs were excluded. Six fixed non-overlapping assignments were saved before research.

## Result and scope

58/58 researched and saved. 58 source-grounded corrected description proposals meet both word ranges. All 58 are `narrowed_correction`; 0 are `gap_resolved` for the original claims as written. No corrected proposal is left without sufficient description context. Original unsupported motive, causal, trend and public-impact assertions remain unsupported and have been removed from the proposed framing. Do not interpret “complete” as validating the original title, date, category or causal claim. Acceptance requires reviewing the proposed narrower title and any date correction together with the descriptions.

This is an evidence-resolution writing deliverable, not 58 verified accusations or 58 distinct new events. Several proposals describe the same source event or AP project; review consolidation before canonical ingestion.

## Evidence recovered

* AP tracker frontend asset led to the actual `promises.json` payload: 25 named promises, 5 Kept, 9 In progress, 11 It’s complicated. The payload declares a December 3, 2025 lastModified timestamp; retrieval occurred October 2, 2026 UTC. It is not an archived February/March 2026 view. The snapshot and SHA-256 metadata are preserved under `sources/`.
* Named January 6 clemency recipients and their separate criminal cases clarify which sentence ended and which custody continued; generalized “child predators freed” wording is removed.
* Direct or syndicated sources supply attack damage, evacuation arrangements, named officials, timestamps, court proceedings, document-release/restoration sequences and source-specific statements. Search attempts and residual uncertainties are recorded per ID.
* The Atlantic’s Unthinkable hub points to a January 2019 editorial project, not a verified March 2026 feature. The proposed dates and source framing are corrected.
* Official TIME text confirms the June 22, 2026 essay’s authors, date and argument. Its claims are attributed as opinion.
* AP’s raw clemency fulfillment field incorrectly lists Jan. 6, 2025. The linked presidential instrument is dated Jan. 20, 2025; appended source-date patches correct derived descriptions and preserve the raw data.

## Reading and validation

The six `worker-*-batch-001.jsonl` files contain exactly one original terminal outcome per assigned ID. Apply field patches from `worker-*-patches.json` in lexicographic order, followed by `root-*-patches.json` in lexicographic order. Patch entries amend an outcome; they are not additional terminal outcomes. Array/list fields replace earlier fields when supplied. The validation script records explicit precedence and validates effective descriptions, status/resolved consistency, evidence fields and exact coverage.

Run `python validate_resolution.py` from this directory or use its full path. `validation.json` stores its successful report and input/output hashes. `checkpoint-final.json` stores completion counts.

Word counts: each non-null medium 45–90; each non-null long 140–300; complete requires both. Missing IDs: 0; duplicate terminal outcomes: 0; outside-assignment IDs: 0; previously complete IDs processed: 0. Source URL checks are syntactic; evidence/source review was performed separately and access failures are logged.

All additions are confined to this evidence-resolution directory. Previous proposals, canonical records, histories, scores and the live database were preserved. Separate draft PR: https://github.com/p5n-n3t/trumpfiles.fun-new/pull/47
