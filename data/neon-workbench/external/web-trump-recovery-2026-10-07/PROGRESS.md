# Trump Files recovery / reconciliation — 2026-10-07

## Final derived package

- Repository verified on GitHub as `p5n-n3t/trumpfiles-fun-new`; default `main` was not changed.
- Built from the 336-parent assignment at `19a772e15765348b82f6d708ad63f58927931321` and the recovered Web QA reference `1f83f6b184072c4d1e883e11998399e7121663be`.
- Recovered 158 complete parent results directly from pushed reconciliation branches. Derived the remaining 178 only from saved primary/Web-QA/recheck packet material, including 18 parents whose pushed branches were otherwise partial; no broad new research or canonical writes were made.
- `final-terminal-results.jsonl` contains 336 parent wrappers. Statuses: {"draft_as_supplied": 40, "duplicate_resolved": 68, "exclusion_candidate": 8, "hold": 109, "pass": 86, "split_ready": 25}.
- `inventory.jsonl` preserves branch/commit/file/line provenance for every recovered pushed source row. `recovery-conflicts.jsonl` preserves incomplete pushed-branch observations. `conflicts.jsonl` contains current derived-set validation conflicts (0).
- Validation checked exact assignment coverage, JSONL, allowed terminal outcomes, text limits when a reader-facing card exists, impact-v2 math/precision, URL and literal-quote formatting, split parent links and duplicate survivor mappings.
- Delivery is blocked only at GitHub authentication: the complete local commit is `ef504d584da2e7ff31560648219e746e09d94fc1`, but this environment has no HTTPS credential helper, so the branch cannot yet be pushed and no draft PR exists.

## Review boundary

This is an independent reconciliation proposal. `draft_as_supplied` records retain `unverified_as_supplied` and publication ineligibility. Holds, exclusions, splits and duplicate mappings are preserved as dispositions, not treated as finished publication-ready descriptions. Do not merge into canonical records or apply to Neon without editorial review.
