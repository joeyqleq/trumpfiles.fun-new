# Remote writing assignments

Repository: `joeyqleq/trumpfiles.fun-new`
Input branch: `codex/description-inputs-2026-09-30`

Read `INSTRUCTIONS.md` in this directory, then only your lane's `input.jsonl` or numbered `batches/` files. These are self-contained: original text, reused descriptions, sources, correction notes, dates, categories and tags are included. Neither the frozen database export nor a local shell is required.

- ChatGPT Web owns `chatgpt-web/`: 1,736 records. Output branch: `codex/descriptions-chatgpt-web-2026-09-30`.
- LightSprint owns `lightsprint/`: 1,737 records. Output branch: `codex/descriptions-lightsprint-2026-09-30`.
- Local native/OpenCodex workers own separate assignments. Remote workers must not touch their records.

Execute in the service's cloud environment. Do not use loopback or any laptop process. Save new output JSONL files under your lane's `outputs/`. Keep original input files intact. Update only your lane's checkpoint and progress. Each lane is divided into small numbered batches; process one at a time and save frequently. If parallel cloud agents are available, split explicit batch numbers into up to four disjoint workers; each writes a uniquely named output file and a separate worker checkpoint. One coordinator updates the shared lane checkpoint.

Validate with `python3 data/neon-workbench/scripts/validate_description_lane.py data/neon-workbench/external/description-completion/2026-09-30/<lane>`.

Keep existing titles and descriptions; write only missing pieces. The existing title may supply the short card layer. The card summary is 45–90 words, and the detail explanation is 140–300 words. Existing linked sources are the baseline; read them only when needed to obtain missing context. Do not reopen the completed exhaustive research assignment. No unsupported padding or new scoring.

Commit small completed groups and open a pull request targeting the input branch. Leave merging to the coordinator. Do not deploy or change application code/database credentials.

The standard ChatGPT GitHub app is documented as read-only. If the current ChatGPT session lacks GitHub write tools, use its cloud sandbox to save downloadable JSONL/checkpoint files, report the exact completed IDs, and provide the files for import. Do not claim a commit or PR exists without actually creating it. A GitHub read-only connection alone does not supply native Codex subagents; delegate only if real cloud task tools exist in that session.
