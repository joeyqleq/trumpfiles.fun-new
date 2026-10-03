# Account2 Worker 19 — final exact-set QA

PASS: 33 unique latest keys exactly match the assigned 33-key packet. Full append-only history is preserved in `data/neon-workbench/external/account2-coordination-2026-10-03/worker-19/worker-19-results-append-only.jsonl` (37 rows).

All 43 distinct available source URLs are valid HTTPS URLs. Proposal-level source URLs are absent for 13 latest keys, whose recorded disposition is unresolved or exclusion; these are exact evidence gaps rather than supportable drafts. No malformed URLs were found.

Draft length checks pass for every present proposal draft: short ≤180 characters, medium 45–90 words, and long 140–300 words. Latest status counts: `{"reviewed_attributed_conditional_directive_draft": 1, "reviewed_attributed_event_draft": 1, "reviewed_attributed_personal_account_draft": 1, "reviewed_attributed_statement_draft_with_access_limit": 1, "reviewed_candidate_draft_attributed_competing_positions": 1, "reviewed_candidate_draft_attributed_litigation": 1, "reviewed_claim_not_supported_as_written": 1, "reviewed_exclude": 7, "reviewed_narrowed_correction_original_claim_unsubstantiated": 3, "reviewed_narrower_supported_event": 1, "reviewed_split_partial_draft": 1, "reviewed_split_with_complete_event_drafts": 1, "reviewed_unresolved": 9, "reviewed_unresolved_source_inaccessible": 1, "reviewed_unresolved_source_not_accessible": 3}`.

## Keys without source URLs

- `entry-5340` — reviewed_exclude / exclude_pending_new_evidence
- `entry-5749` — reviewed_unresolved / retain_unresolved
- `entry-5826` — reviewed_exclude / exclude_pending_new_evidence
- `entry-6516` — reviewed_exclude / exclude_pending_new_evidence
- `entry-6595` — reviewed_unresolved / retain_unresolved
- `entry-6612` — reviewed_exclude / exclude_pending_new_evidence
- `entry-6662` — reviewed_exclude / exclude_pending_new_evidence
- `entry-6744` — reviewed_unresolved / retain_unresolved_pending_specific_evidence
- `entry-6781` — reviewed_claim_not_supported_as_written / exclude_original_claim_pending_source_for_claim
- `entry-6794` — reviewed_unresolved / retain_unresolved_pending_specific_evidence
- `entry-6818` — reviewed_unresolved / retain_unresolved_pending_specific_evidence
- `entry-6834` — reviewed_unresolved / retain_unresolved_pending_specific_evidence
- `entry-6900` — reviewed_unresolved / retain_unresolved_pending_specific_evidence

See `checkpoint-final.json` for exact assignment key set, latest statuses, all recorded evidence gaps, and packet hash.
