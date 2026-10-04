# Worker 03 repair checkpoint

- Status: complete; all nine assigned IDs have full effective extraction rows in the repair terminal.
- Progress saved after batches of 3, 6, and 9 rows: entry-3/15/27; entry-41/53/67; entry-79/91/103.
- Source commit: `2476ae4896b888830fd3888f40581e19b78fae30`.
- Review commit: `7d5fe9dc1b7973db5753f2cd5e74df7099b3c772`.
- Task branch at start: `ls/3-trump-files-sample100-review-03-of-12-gPrZ`, base `84c21429ecba8597ab74b9fc94483edbdbafbf41`.
- The only review-directed fact repairs are entry-27 relation direction and entry-53 legal-action target. Existing immutable amendments for entry-41 and entry-67 are applied. No other passing values changed.
- Validation: exact assigned IDs/order, JSONL parsing, required fields, allowed values, evidence coverage, supplied URLs, and literal quote checks passed; 9 complete rows, 74 evidence-map entries.
- Input SHA-256: `1e26948a9ff5bce1fe6f5e6932871f928ff20c8b1dfcbb6b784b3afa0f112737`.
- Review terminal SHA-256: `d7cd4c0459e2a3bcb68edcdacf91f48686067f2ded2020d919709b0fdeaaf976`.
- Original terminal SHA-256 (unchanged): `8e5e8675b3943dfd4a1b214077ba4421b304a4212864ff27f2558d90a29dee8f`.
- Amendment log SHA-256 (unchanged): `4b08f8cdf243c1e5c165dc2d26bcfb66c4bf31ab995e452a65815281bc4f51d3`.
- Repair terminal SHA-256: `f32182b74213f9f16c986cff6852c40e02cbeede37bd5ecb92eeece9854337c6`.
- Final QA: `worker-03-final-qa.md`.
- Commit and push are performed on the required existing task branch after this checkpoint is written.
- No pull request, canonical/Neon edit, or code edit is in scope.
