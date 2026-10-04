# Worker 42 final QA

Job: `full-insights-42`  
Frozen input: `data/neon-workbench/external/continuous-finish-2026-10-04/full-insights/worker-42-input.jsonl` at commit `2d7b76b4e48cdb8695a091fcfb6487301155d551`.

All 92 assigned IDs have one terminal row, with no missing, extra, or duplicate IDs. The checkpoint reports 92 completed and zero pending. Terminal statuses use the requested `complete` or `insufficient` values; every row is proposal-only and has the requested core schema. Quantities and relations are empty throughout.

A local validation checked every non-unknown core scalar and array element against its evidence-map entry, and verified that every evidence quote is a literal substring of supplied staged entry text. All 18 immutable amendments were applied as overlays for effective-output validation; their quotes also passed. The terminal history was preserved without in-place edits.

Contradictions and limits remain in each row’s `blockers`, including allegation-versus-finding distinctions, plans versus completed actions, differing descriptions of outcomes, and limits on personal or nationwide attribution. The supplied descriptions and source mappings were treated as input; no web research, source-page verification, new scoring, canonical/Neon changes, or application-code changes were performed. The coordinator’s `output_missing` issue is resolved by the completed terminal file and checkpoint.
