# Superseding correction: authoritative Wave3 staging input unavailable

This addendum supersedes the prior release audit's staging-status statement while preserving that audit as history.

## Retraction

I retract the prior statement that 498 is the current authoritative Wave3 `needs_context` count. That count came from the older `merged/descriptions.jsonl` at `origin/codex/description-results-2026-09-30` commit `d1d12b0232c277aeb65d52ddb8f913f2366c275b`; it is stale for this release gate and must not be used as the Wave3 current count. The prior audit's claimed 204-key-list blocker is likewise superseded: the user identified the correct authoritative file and stated its aggregate counts, but the row-level file itself is not available in the fetched repository refs or checkout, so its exact IDs and overlaps cannot yet be recomputed here.

## Exact source blocker

Expected path: `data/neon-workbench/external/description-completion/2026-09-30/merged/descriptions-full-staged-2026-10-03-wave3.jsonl`.

After fetching all 130 advertised origin heads, this path was absent from every reachable remote tree and from the checkout. A scan of unreachable local Git commits also found no tree containing the path. Consequently the file's authoritative branch, commit, and SHA256 are unavailable. The reported 6,944 rows (6,740 `complete`, 204 `needs_context`) are preserved as user-provided aggregate facts, not independently verified input values.

## Reconciliation status

The prior audit's exact identity partition remains independently supported by the different inputs it used: staged 6,944 = canonical 6,860 + fresh 84, and frozen 7,143 = canonical 6,860 + held 283. This correction does not certify that its staged member set equals the newer Wave3 staged file. Exact IDs for the 204 `needs_context` rows, their intersection with the 311 effective worker results, and their specific canonical/fresh classifications remain uncomputed until the expected file is fetched. No held record is reclassified as pass.

No historical audit file was edited. No canonical or Neon write was made. The prior checkpoint and QA must be read together with this superseding correction; the old 498 current-status claim is withdrawn.
