# Worker 19 final QA

## Scope and result

- Input: frozen `worker-19-input.jsonl` from source commit `2d7b76b4e48cdb8695a091fcfb6487301155d551` on `codex/full-insights-packets-2026-10-04`.
- The explicit assigned ID list and packet contain 93 unique records, including the two expanded records. The task title says “13 IDs,” but the explicit list and frozen packet each contain 93; all 93 explicit IDs were processed.
- Terminal output has 93 unique rows in packet order: 84 `complete` and 9 `insufficient`.
- Insufficient records: `entry-1184`, `entry-1330`, `entry-1475`, `entry-1547`, `entry-1620`, `entry-2014`, `entry-3530`, `entry-4036`, and `entry-4182`. Their blockers describe the missing attribution, event detail, or unresolved proposal.
- Each row is proposal-only and contains the approved core fields. `quantities` and `relations` are empty on every row; no candidate extensions were emitted.

## Evidence and validation

- Every non-unknown core value has a matching evidence-map entry. All 605 `basis_quote` strings were checked as literal substrings of that record's supplied frozen/staged input text.
- Evidence is marked `supplied_text` with `source_url: null`. No source page was checked during this extraction; supplied URLs and descriptions are not treated as independent verification.
- Contradictions, contested claims, attribution limits, and differences between a proposed action and a completed outcome are recorded in row-level `blockers`.
- The terminal set exactly matches the input ID set, has no duplicates, and preserves packet order. The append-only checkpoint has 31 three-record progress entries and ends at 93 complete / 0 remaining.
- No canonical, Neon, or application-code files were changed. No UI capture applies. Project tests/builds were skipped because this change is limited to structured data and QA artifacts; the local schema, ID, evidence-coverage, and quote-substring validator passed.

## Process note

An early inspection command accidentally printed concise medium summaries for all packet rows in one pass. I corrected the workflow afterward: each subsequent packet read and each saved extraction batch contained three records, and every saved quote was validated before append.
