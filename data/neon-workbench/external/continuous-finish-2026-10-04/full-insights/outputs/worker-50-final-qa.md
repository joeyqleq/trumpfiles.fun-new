# Worker 50 final QA

Job: `full-insights-50`
Frozen input: `data/neon-workbench/external/continuous-finish-2026-10-04/full-insights/worker-50-input.jsonl` at commit `2d7b76b4e48cdb8695a091fcfb6487301155d551`.

The current terminal has exactly 92 physical rows, one per assigned packet ID. The prior 94-row snapshot at commit `7bfbcdff` contained byte-identical duplicates for `entry-152` (line 3 copied line 1) and `entry-232` (line 4 copied line 2); its SHA-256 and the correction are recorded in immutable amendment `worker-50-duplicate-id-terminal-normalization-003` and the original remains recoverable from Git history. The checkpoint file has 31 physical lines; its duplicate second snapshot is explicitly ignored, leaving 30 effective snapshots whose cumulative record count reaches 92.

Validation applied the amendments and checked the effective rows against the frozen packets. It found zero errors for assigned-ID coverage, status and enum values, evidence-map coverage for every non-unknown core field and array item, literal substring equality for supplied-text quotes, source URLs against supplied source mappings, and empty `quantities` and `relations`. Effective statuses are 86 `complete` and 6 `insufficient`.

Immutable amendments preserve the output history: the duplicate terminal rows are corrected in the current snapshot with the prior version retained in Git; the duplicate checkpoint snapshot is marked for exclusion; `entry-534` scope is corrected from `state` to `regional`; `entry-1506` and `entry-1750` receive supported core facts and corrected status/event state; and four `entry-5906` evidence-map URLs are corrected to the URL supplied with its packet text. No quantity or relation extensions were added. Contradictions and limits in the supplied descriptions remain documented in row blockers.

Evidence uses only the supplied frozen/staged text and source mappings. No source page was independently checked, and no claim is made that a supplied URL verifies the text. No canonical data, Neon data, application code, or configuration was changed. No pull request is part of this worker's scope.

## Duplicate-ID follow-up

The coordinator `duplicate_ids` finding is closed in immutable amendment `worker-50-duplicate-id-terminal-normalization-003`. The current terminal itself now has 92 rows with 92 unique IDs, exactly matching the frozen packet set. The prior 94-row snapshot is preserved in Git history and its digest and removed duplicate occurrences are recorded in the amendment.
