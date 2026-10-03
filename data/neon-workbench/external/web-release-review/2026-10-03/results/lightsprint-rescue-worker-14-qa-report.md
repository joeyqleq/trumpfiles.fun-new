# Worker 14 final QA report

Branch: `ls/3-trump-final-corrections-account2-worker1--T8S`
Pinned input: `934e12c34d9b2c743114e6d7af4d87646a51e30f`
Input SHA256 verified: `a9a06c94ba66822e06cd9f878e3720764450e3d6ed7802ab4537ab6c0dfd2530`
Output: `data/neon-workbench/external/web-release-review/2026-10-03/results/lightsprint-rescue-worker-14-batch-UNIQUE.jsonl`
Output SHA256: `282b4b856672277bbb623c93793332954966f1f1a3b45f4a5c9dab9c90d06e95`

## Validation

- Exactly 33 JSONL rows, each assigned key appears exactly once and the ordered set matches the worker packet.
- All 33 saved published file/revision references match their frozen PR49 baseline row; the PR47 proposals retain their recorded proposal provenance.
- Latest status and disposition are present on every key. PR47 rows set `original_claim_substantiated` to false.
- Every populated short description is at most 180 characters; every populated medium is 45–90 words; every populated long is 140–300 words. Complete medium/long drafts: 19. Split/partial records with an explicit source gap: entry-4239, entry-4739, entry-5224.
- 51 recorded source URLs are HTTPS. No source URL was present in the saved review for: entry-5732, entry-6484, entry-6577, entry-6602, entry-6631. Their evidence gaps below specify what is missing.
- All four previously pushed batch checkpoint hashes match the output file at their respective commits.

## Status counts

- `qa_supported_narrower_event`: 7
- `reviewed_exclude`: 3
- `reviewed_narrower_supported_event`: 8
- `reviewed_split_partial_draft`: 2
- `reviewed_split_with_event_specific_drafts`: 1
- `reviewed_supported_narrower_event`: 3
- `reviewed_unresolved`: 7
- `reviewed_unresolved_after_source_check`: 2

## Exact remaining evidence gaps

- `entry-4239`: Readable event-specific source text for the interagency transfer child and enough verified detail for full workforce-child medium/long copy; the FY2027 $12B/15% figure needs independent documentation or omission.
- `entry-4739`: The fourth-death update is short-only; an official investigation result is needed before adding any causal finding.
- `entry-5224`: Sourced medium and long text for the Haugh child; direct readable Reuters or official evidence for the separate August clearance-revocation item.
- `entry-5732`: Direct Trump statement, transcript, recording, or contemporaneous reliable report identifying the justices and verifying the alleged demand/quotations.
- `entry-6439`: Dated emergency declaration or appropriation action plus the specific GAO decision or court order alleged to find it unlawful; otherwise exclude the composite.
- `entry-6484`: Identify each Khashoggi-related accountability measure and provide the dated official action or contemporaneous source showing it ended.
- `entry-6577`: Recipient-by-recipient Office of Pardon Attorney or court-docket evidence of petition status, plus direct evidence for any intermediary payment/access arrangement.
- `entry-6602`: Named campaign-finance referral, investigation, or case and evidence of a dated DOJ decision to stop or decline enforcement.
- `entry-6631`: Dated CFPB directives and personnel records or reliable reporting establishing office status and actual workforce change.
- `entry-6729`: A named CDC award/program and dated grant notice or termination record establishing the affected reproductive-health scope.
- `entry-6803`: Dated White House notice, direct personnel record, or reliable reporting specifically establishing whether and when the DOJ inspector general was dismissed.
- `entry-6828`: Dated USDA/FNS directive or rule expressly changing WIC eligibility for the described immigrant population.
- `entry-6929`: Specific FISC docket/order or authenticated government record identifying surveillance authority, target class, and relevant date.
- `entry-6944`: Official dated policy/system record specifying facial recognition, database scope, and coverage of applicants and current visa holders.
- `entry-6964`: Case-specific FBI/DOJ documentation or reliable reporting naming each alleged subject and establishing an opened investigation; otherwise remove the claim.

The remaining seven fresh-event and five PR47 rows have narrow attributed drafts with no event-identification gap in this QA; the original PR47 claims remain unsubstantiated. This final validation did not reopen source research or alter the output JSONL, canonical records, scores, or databases.
