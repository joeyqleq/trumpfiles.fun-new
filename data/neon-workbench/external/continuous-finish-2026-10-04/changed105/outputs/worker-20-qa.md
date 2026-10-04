# Worker 20 final QA — changed105-20

The input packet pinned at `5c14293f4d0478462fd6e83148025eed1e5a6dc1` contains exactly nine rows, matching the nine explicitly assigned record IDs. The stale “13 IDs” wording is only in the task title; scope follows the explicit list and packet.

Exact-set validation passed: **9/9 terminal rows**, with no missing IDs, extras, duplicates, or reordering. All rows use `impact-v2`, include the required event, confidence, rationale, basis, and notes fields, and have six one-decimal dimensions in the 0–10 range. All nine are scored; none required deferral. No worker composite was added.

Scoring uses only the narrowed supported event in each packet row. Disputed wiretap and intent claims, unmade fund payouts, unaltered vote claims, the unsupported phrase count/intimidation claim, and the unadjudicated Emoluments Clause claim were kept distinct from established actions. The Paris fee remains attributed as an estimate. No original score was overwritten, no canonical record was edited, no Neon/database write was made, and no amendment was needed.

The terminal file was absent before this run. Nine missing rows were appended in three batches while preserving the existing history (which was empty). The coordinator’s `output_missing` artifact issue is resolved by this terminal file, QA report, and checkpoint.

Input: `data/neon-workbench/external/continuous-finish-2026-10-04/changed105/worker-20-input.jsonl` at `5c14293f4d0478462fd6e83148025eed1e5a6dc1` (SHA-256 `397c43349877b99a07080734bfb6f5a85dcd7b9e740a099262427b3e82d5bbda`).

Terminal: `data/neon-workbench/external/continuous-finish-2026-10-04/changed105/outputs/worker-20-terminal.jsonl` (SHA-256 `2cec19a3515d259e0529ca8e87d78c8d0e1a7e247a859fbc12f34fd3b643c0fd`).
