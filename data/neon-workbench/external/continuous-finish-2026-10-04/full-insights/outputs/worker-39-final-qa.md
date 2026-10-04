# Worker 39 final QA

- Job: `full-insights-39`; input commit: `2d7b76b4e48cdb8695a091fcfb6487301155d551`.
- Input rows: 92; exact assigned-ID set matched the packet and terminal output.
- Terminal status counts: 88 complete, 4 insufficient.
- Every non-unknown core value and non-empty array element has an evidence-map entry. Literal quotes and supplied source-URL mappings passed local validation against the packet.
- All 92 rows are `proposal_only: true`; all `quantities` and `relations` arrays are empty. No candidate extensions were retained.
- Append-only correction history: 22 amendments in `worker-39-amendments.jsonl`. They add direct outcome quotes for multi-clause summaries and narrow entry-7042’s outcome to what the supplied text states. Original terminal rows remain unchanged.
- Blockers are preserved per record; 73 terminal rows carry one or more. They include contradictions about threatened versus implemented actions, unsupported causal/title claims, allegation status, and gaps in supplied descriptions.
- Source URLs were carried from the packet; pages were not independently reopened or verified.
- No canonical data, Neon data, or application code was edited. UI verification and project checks do not apply to this data-only artifact task.
- SHA-256 terminal: `02b230abc9c3664718b3716a5660cf29995ee12c8632c321e327c61299828b38`.
- SHA-256 amendments: `36c31d192434c4e590c781b58a19ae44e246bea1ae376be0da452276d62c5ea4`.
