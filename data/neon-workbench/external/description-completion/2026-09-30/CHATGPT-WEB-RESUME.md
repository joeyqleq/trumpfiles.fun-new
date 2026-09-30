# Resume ChatGPT Web's existing assignment only

Work in GitHub/cloud only on `p5n-n3t/trumpfiles.fun-new`.
Resume existing PR #6 and branch `codex/descriptions-chatgpt-web-2026-09-30`; do not create another assignment or discard earlier outputs.
Fetch `codex/description-inputs-2026-09-30`, then read `data/neon-workbench/external/description-completion/2026-09-30/INSTRUCTIONS.md` and your `chatgpt-web/input.jsonl`.

Your assignment is exactly 1,736 IDs. Other workers own the other lanes; do not touch their records.
The local coordinator verified 456 committed output rows at commit `3f568f9c18e8d68a44c8ef91d7c305d1a98229e0`. The previous session reported 872 saved in its cloud workspace, but 416 of those were not pushed at that checkpoint. First recover any surviving uncommitted files and push them. Do not assume the checkpoint proves output files exist. Calculate actual coverage from JSONL output records intersecting the input IDs, taking the latest explicit revision per ID.

Split ONLY missing IDs into seven disjoint workers if six real cloud subagent slots are available. Use cheap Luna low reasoning when selectable. Each worker owns explicit IDs and uniquely named files; one coordinator manages the shared checkpoint. No local loopback, dependency installations, app code edits, scoring, live database changes, or deployment.

Keep existing adequate writing exactly. Write only missing fields: title/short card layer at most 180 characters, medium summary 45–90 words, detailed explanation 140–300 words, missing meaningful categories/tags. Incorporate supplied corrections naturally. Read an existing linked source for genuinely missing context; do not redo broad fact-checking. No sentence truncation, templates, repetitive padding, or internal source-audit commentary. Preserve exact URLs and distinguish uncertainty. If core facts cannot be supported, retain useful partial writing and a precise `needs_context` reason.

Append new JSONL batches and revisions without overwriting history. Validate unique current IDs, preservation, schema, lengths, source URLs, and reader-facing prose. Historical revisions are allowed; calculate current counts using effective latest rows rather than counting every historical line. Save, commit, and PUSH every 10–20 rows so an interrupted session does not strand work. Keep PR #6 updated, targeting the input branch. Do not merge; the local coordinator handles integration.

Continue until every assigned ID has a terminal result and every fixable weak draft has been repaired. Final report: actual pushed commit, unique assigned IDs covered, complete/needs_context/missing counts, specific remaining blockers. Do not call missing-context rows finished descriptions.
