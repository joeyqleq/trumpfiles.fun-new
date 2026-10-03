# Worker 21 release-gate identity audit

## Exact release partition

The staged descriptions reconcile exactly as **6,860 canonical IDs + 84 fresh keys = 6,944 staged rows**, disjoint. The frozen identity index reconciles exactly as **6,860 canonical IDs + 283 held IDs = 7,143 frozen IDs**, disjoint. The staged/frozen overlap is exactly 6,860 canonical IDs; staged-only is the 84 fresh keys; frozen-only is the 283 held IDs. There is no double count. Exact sets are in `release-partition.json`.

## Needs-context and worker results

The merged staging file contains 498 `needs_context` rows. The exact dual-account-wave3 manifest assigns 311 keys; current worker branches provide one effective result per key: 272 `complete`, 39 `needs_context`. Of the latter, 39 also appear as staged `needs_context`. Neither source yields the separately claimed 204-key set. Its key list and overlap are blocked; no held records are inferred to pass. Per-key provenance is in `worker-results-effective.jsonl`.

## Inputs and validation

Exact source commits and SHA256 values are in `checkpoint.json`; independent set checks are in `independent-qa.json`. All worker-assigned keys map to staged IDs. No canonical edits or Neon writes were made.
