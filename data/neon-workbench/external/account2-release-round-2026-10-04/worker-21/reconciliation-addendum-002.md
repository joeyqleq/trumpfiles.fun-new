# Superseding addendum 002: exact Wave3 needs-context reconciliation

The 204-key subset is available on `origin/codex/wave3-needs-context-204-2026-10-04` at `4b722b9fc56f83e514181cdb9a1098500f1fe1c3`. Its manifest reports 6,944 rows (6,740 complete; 204 needs_context), binds the original snapshot SHA256 `c091939b50a8af24682b6025f69c5a063bfbac90351933016e183b0f5266e762`, and declares the held204 file SHA256 `0fe8113c09856847ae3e1bf2bb8f4ce60d7499469bc0f7297f3112ea10211e41`. The held file SHA, 204 rows, unique keys, and all-needs_context status were verified.

Of the 204 held keys, **202 overlap** the 311 latest effective Wave3 worker results. **163** overlapping keys have a latest worker proposal status of `complete`; **39** remain `needs_context`. The other **2** keys (`entry-2442, entry-405`) are outside the assignment and remain staged needs_context.

A worker proposal marked `complete` is not itself publication or release approval. Per-key classifications and provenance are in `held204-reconciliation-20261004.jsonl`; the refreshed 311-result set is in `worker-results-effective-20261004.jsonl`.

This addendum supersedes the earlier missing-source blocker and retracts the stale 498-current-status claim. Earlier audit files remain unchanged. No canonical or Neon writes were made.
