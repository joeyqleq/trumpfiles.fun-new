# Worker 04 citation cross-QA — final exact-set validation

- Immutable packet: `codex/citation190-crossqa-2026-10-03` at `9ea34e84716e0599d8c63e0bb0714f64f545df25`.
- Input SHA256: `0864d06b4a85b94c73d77ff96dc7dedb3de23583042db34b2a6202917df080b9`.
- Batch: `worker-04-batch-20261003-independent-citation-qa.jsonl` (16 rows, unique keys, exact assigned set).
- Checkpoints: `worker-04-checkpoints-20261003.jsonl` (8-row and final 16-row).
- Results: `narrower_revision_required` 5; `supported_proposal` 9; `intentional_exclusion` 2.
- Exact source text or official documents were checked where accessible; direct access failures are recorded, and headlines or snippets were not used as proof.
- No canonical data, database, packet input, or other worker output was modified. No Neon, DDL, or DML calls were made. No PR is requested or opened.

## Exact-set validation

Expected keys: `entry-178`, `entry-264`, `entry-444`, `entry-769`, `entry-833`, `entry-969`, `entry-1768`, `entry-2342`, `entry-2504`, `entry-2731`, `entry-3488`, `entry-3985`, `entry-4353`, `entry-5471`, `entry-6127`, `entry-6245`.
Observed keys: 16 unique rows in the same order; exact-set comparison passed.
Application checks and UI/flow verification were skipped because this change contains only citation QA data artifacts and does not change executable code or UI.

## Per-key findings

| Key | Result | Specific reason |
|---|---|---|
| entry-178 | `narrower_revision_required` | PEN is marked used but is absent from the proposal source list/map and inaccessible; ACLU supports proposal framing. |
| entry-264 | `narrower_revision_required` | The Federal Register EO supports the directive; the cited Times-Republican opinion column is missing from the proposed source map/list. |
| entry-444 | `supported_proposal` | Official Marine Corps and White House pages support the Nov. 19 visit, locations, participants, and activities. |
| entry-769 | `supported_proposal` | Newsweek and BBC support the reported 1998 company trip/payment and possible license allegation, not an official finding. |
| entry-833 | `supported_proposal` | DOJ warrant and archived White House statement support Renzi’s full pardon and Jan. 19/20 date distinction. |
| entry-969 | `supported_proposal` | DOJ register and archived White House statement support Patton’s Jan. 19 listing, fine/offense summary, and full pardon. |
| entry-1768 | `intentional_exclusion` | AP link is a generic promise tracker; no specific promise or dated event is identified. |
| entry-2342 | `intentional_exclusion` | Fordham Ram supports biography, not a public-policy or harm-event claim. |
| entry-2504 | `narrower_revision_required` | WaPo timed out and AP returned 403; exact chairman-and-CEO title could not be independently verified. |
| entry-2731 | `supported_proposal` | Inquirer supports reported flight timing and the attributed no-contact/circumstance account, not a meeting. |
| entry-3488 | `supported_proposal` | Exact Reuters/AP article text supports an offer and stated terms; no completed deal or U.S.-citizen transfer. |
| entry-3985 | `supported_proposal` | HHS release supports states, programs, amounts, and pending-review freeze; fraud is attributed as HHS’s concern. |
| entry-4353 | `narrower_revision_required` | Judgment excludes Wisconsin from §§2(a), 3(d), 4(a) relief; cited PDFs do not support the later appeal claim. |
| entry-5471 | `supported_proposal` | Complaint and Reuters support sales figures as allegations, not findings of fraud. |
| entry-6127 | `narrower_revision_required` | DOI/BLM support decision, sale, bids, and leases; the long copy’s Reuters permit claim is unmapped. |
| entry-6245 | `supported_proposal` | House Democrats release supports the attributed $7.8m/20-government/four-business report, not a court finding. |
