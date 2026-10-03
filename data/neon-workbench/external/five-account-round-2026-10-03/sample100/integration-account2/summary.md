# Sample100 account2 integration — proposed only

- Source packet: `codex/five-account-review-packets-2026-10-03` at `86d71a0bcd9d82301e72bc9f36a4271143c87ddb`; manifest declares 100 records and `PROPOSAL_ONLY`.
- Exact assignment verification: 100 expected keys, 100 unique input keys, 100 unique worker output keys; no missing, extra, or duplicate keys. The twelve input hashes and their manifest assignments were verified before reconciliation. The manifest does not itself list output branch refs; worker-numbered refs were resolved by naming convention and each worker packet SHA matched the manifest.
- Normalized record outcomes: PASS 64, HOLD 36.
- Checks applied: frozen `record_id`/entry-number identity, worker preservation evidence, short <=180 Unicode characters, medium 45–90 whitespace-delimited words, long 140–300 whitespace-delimited words, independent six-dimension score recomputation with decimal half-up to 2 places, HTTPS source and provenance fields, plus worker disposition.
- This ledger is an offline proposal and QA integration only. Source URL presence was inspected structurally, not fetched for factual validation. No Neon calls, database changes, DDL/DML, canonical edits, or production approval occurred. NULL-only readiness remains a simulation from worker artifacts.

## Outcomes by worker

- Worker 01: 6 PASS / 3 HOLD; branch `ls/1-trump-files-sample100-review-01-of-12-iPnX` at `a8cb999ea311148ba81c1f26383dfb8661acb6bc`; final QA artifact present.
- Worker 02: 5 PASS / 4 HOLD; branch `ls/2-trump-files-sample100-review-02-of-12-6WFh` at `7ae505587d9fe503b4f88add40f5a3f96b00d409`; final QA artifact present.
- Worker 03: 9 PASS / 0 HOLD; branch `ls/3-trump-files-sample100-review-03-of-12-gPrZ` at `d4305f452e4e5f84c10456b6f831565b975023d4`; final QA artifact present.
- Worker 04: 8 PASS / 1 HOLD; branch `ls/4-trump-files-sample100-review-04-of-12-aICV` at `b797359f0fd44776c0e2c7cac69a55a420b59054`; final QA artifact present.
- Worker 05: 5 PASS / 3 HOLD; branch `ls/5-trump-files-sample100-review-05-of-12-uITi` at `d447882e967569c08cc62cc3b81503ece4cb7415`; final QA artifact present.
- Worker 06: 8 PASS / 0 HOLD; branch `ls/6-trump-files-sample100-review-06-of-12-pfm2` at `f0b13b35eaad2968d523e7dfbcffa7393032b59b`; final QA artifact present.
- Worker 07: 3 PASS / 5 HOLD; branch `ls/7-trump-files-sample100-review-07-of-12-WFXm` at `2d77d9190ecc70b4fe924b4194b1048042c38e7d`; final QA artifact **missing**.
- Worker 08: 7 PASS / 1 HOLD; branch `ls/8-trump-files-sample100-review-08-of-12-Qhy0` at `8d272c64776019e87adb7414ca4eeab0ca795f20`; final QA artifact present.
- Worker 09: 2 PASS / 6 HOLD; branch `ls/9-trump-files-sample100-review-09-of-12-WtKf` at `edab91dcc5feac7da6b6f3e166139034ed45b362`; final QA artifact present.
- Worker 10: 5 PASS / 3 HOLD; branch `ls/10-trump-files-sample100-review-10-of-12-5b45` at `1496677d19f2a616a22e9b56f53c0454e9530944`; final QA artifact **missing**.
- Worker 11: 0 PASS / 8 HOLD; branch `ls/11-trump-files-sample100-review-11-of-12-mShY` at `3133e52acf65b28dc77ec046266f14a9e2e7db57`; final QA artifact **missing**.
- Worker 12: 6 PASS / 2 HOLD; branch `ls/12-trump-files-sample100-review-12-of-12-fLSj` at `be0ef4dccf9bcc4f37212eef15bf249c5766c39b`; final QA artifact present.

## Integration blockers

- Workers 07, 10, and 11 have per-key batch reviews but no final QA artifact on their branches. Their rows are dispositioned from the available batch evidence; final exact-set attestations remain outstanding.
- Worker 12 final QA states weights 0.16 procedural abuse and 0.09 self-dealing (total formula weight 0.99). Independent recalculation using 0.15 and 0.10 matches all eight submitted scores after rounding, but its written formula attestation must be corrected before claiming a clean formula audit.
- Per-record HOLD reasons are preserved verbatim or summarized precisely in `exact-blockers.jsonl`; records held for source mismatches or unsupported descriptions remain unresolved pending evidence/correction.
- This package does not infer editorial clearance from QA PASS and does not authorize an import.
