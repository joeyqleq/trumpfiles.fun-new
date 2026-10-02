# Final context web proposals

Input commit: `e6889430b4ccbaeeb99be19cd1a433d34c4a4715`. Input SHA-256 verified against manifest. Six deterministic, disjoint assignments cover exactly the 80 reserved IDs.

All 80 IDs have saved outcomes. Effective status counts after append-only review: {'complete': 22, 'needs_context': 58}. Missing IDs: 0. Duplicate terminal outcomes: 0. Out-of-assignment IDs: 0.

## Reading the proposals

`worker-01.jsonl` through `worker-06.jsonl` contain the 80 original terminal outcomes. Preserve these published files. Apply the field updates from `worker-01-supplement.jsonl`, then `worker-03-editorial-patches.json`, then `worker-03-review-patches.json` in memory. These are review amendments, not additional terminal outcomes. Later review fields take precedence. `validate_outcomes.py` implements this order and validates the effective proposals; its report is saved as `validation.json`.

Complete means both descriptions meet the required lengths and the described, narrowed event has evidence. It does not validate unsupported wording in the original title or categories. Proposed titles and editorial notes flag those issues for coordinator review. Needs_context outcomes explain the exact missing evidence; null descriptions deliberately avoid padding. Every non-null medium is 45–90 words and every non-null long is 140–300 words.

Repository packets and previous research were checked first, followed by focused source reads/searches. Source-access failures, absent dated tracker rows, and unsupported causal/motive/impact claims are documented per record. Source URLs preserve evidence references; prior packet URLs may remain alongside added primary or syndicated source links. Mechanical URL validation checks format, not availability or the truth of the source.

No canonical records, existing histories, scores, or live database were changed. All new files are restricted to this assignment’s outputs directory. Draft PR: https://github.com/p5n-n3t/trumpfiles.fun-new/pull/46
