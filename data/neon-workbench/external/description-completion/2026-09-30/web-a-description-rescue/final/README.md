# Final review manifest

All 732 Account A IDs have terminal proposals: 571 repaired, 141 supported partials, and 20 unresolved. The queue is exhausted. Missing assigned IDs: 0. Duplicate IDs in authoritative outputs: 0.

Read each proposal from the file named in `proposal-index.jsonl`. Apply editorial patches in the exact `patch_order` listed in `validation.json`; later fields override earlier fields. Standard patches use `target_record_id` and `patch`. Preserved legacy field-only patches under `editorial-review/` use `record_id` plus changed fields. Neither format creates another assignment. Field-level corrections keep original proposal history reviewable.

The validated proposal snapshot is `e5d10a7934825b9513956ef814aa773921ec115c`. Structural checks pass for exact frozen even-position ownership, 732 terminal IDs, title lengths, repaired medium/long word counts, blocker presence, source URL syntax, and patch targets. Partial/unresolved text has 35 recorded length exceptions rather than invented padding. This validation does not claim a new broad fact-check of every historical event.

Two earlier interrupted worker batches were saved outside the dated folder. Their original files remain because automatic review rejected deleting original proposal records after copying. `../recovered-history/NOTICE.json` names the two path exceptions and 12 repeated historical IDs. They are historical copies, excluded from the authoritative output count. Recovered adequate source-supported wording is incorporated by field-level review patches. No canonical record, score, database, frontend file, or frozen input was changed.
