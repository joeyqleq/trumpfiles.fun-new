# Worker 32 final QA

- Job: `full-insights-32`; input pinned to commit `2d7b76b4e48cdb8695a091fcfb6487301155d551` at `data/neon-workbench/external/continuous-finish-2026-10-04/full-insights/worker-32-input.jsonl`.
- Terminal output: 92 unique rows for the exact 92 input/assigned IDs; no missing or extra IDs. Statuses: 91 `complete`, 1 `insufficient` (`entry-4801`).
- Immutable corrections: 30 full-row amendments in `worker-32-amendments.jsonl`. They repair 39 affected-group/institution mapping issues by narrowing values to text-explicit wording, replacing quotes with literal supporting text, or removing unsupported institution labels. The original terminal file is preserved unchanged.
- Combined terminal-plus-amendment validation passed: required field names and enum values, `proposal_only: true`, evidence-map coverage for every non-unknown core value, direct quote support for every affected-group and institution value, and literal substring validation of every evidence quote against the supplied staged/frozen packet text.
- Approved extraction scope is limited to `event_state`, `action_type`, `affected_groups`, `institutions`, `scope`, `legal_stage`, and `outcome`. `quantities` and `relations` are empty in every row. Existing blockers were retained.
- No source pages were opened or independently verified; evidence is limited to supplied staged/frozen text and mappings. No web search, scoring, code, canonical, or Neon edits were made. The coordinator's `output_missing` issue is resolved by the terminal output plus this QA/checkpoint and the amendment file.
