# ChatGPT Web review assignment — 2026-10-03

You are assigned an offline evidence and disposition review packet. Work only from these packet files and any focused public-source research needed to resolve a specific claim. Do not access Neon or another database. Do not write to any database, merge, deploy, or modify the frozen source artifacts.

## Exact workload

- Review 283 held dispositions: 32 split-required, 111 soft-hide candidates, 59 approved-duplicate candidates, and 81 unresolved.
- Independently review 84 fresh candidates in their separate `fresh-*` / `expanded-*` key namespace. Their status is a proposal for human review only; `insert_authorized` is false for all rows.
- Independently review 58 PR47 correction proposals under `pr47-review-entry-*` keys (425 total assigned rows across held, fresh, and PR47). These are all `PROPOSED_NOT_APPROVED` from PR head `abf8c473db2998e37368966811ec4cf0274088e9`; review must not edit or approve that overlay.
- Use the original full facts for the reserved 80-record Web assignment as context only; these 80 are not assigned again.
- Held IDs are checked disjoint from the active 311 Light wave-2 IDs and the separately reserved 80-record Web assignment. The exact protected IDs are in `active-assignment-exclusions.json`.

## Review rules

1. Preserve the original row and its claim as provided. Produce append-only review proposals with cited support, access notes, factual scope, and remaining uncertainty. Do not edit the source packet, ordinary records, PR47 overlay, owner branches, or index/database values.
2. For the 32 split proposals, recommend a split only where each event has independently supported facts and dates. Give proposed components as review proposals; never invent survivors or create entries.
3. For the 111 soft-hide candidates, assess whether a supportable discrete event remains and whether the proposed soft-hide rationale is justified. Do not claim a soft hide was applied.
4. For the 59 duplicate candidates, inspect both complete frozen entry records and the supplied counterpart description/corpus text in `duplicate-counterpart-fulltext.jsonl`, plus the frozen source metadata in `source-evidence.jsonl`. A title match alone is insufficient. State which event evidence matches or differs. Canonical records are context only; these canonical IDs also belong to the active Light wave-2 assignment: entry-7045.
5. For the 81 unresolved items, perform narrow, credible-source research when possible. If supplied and public evidence does not resolve the claim, retain an explicit unresolved outcome. Never fill gaps with inference or invented survivors.
6. Independently audit each of the 84 fresh candidate records for event identity, source support, description quality/length, possible duplicates, and impact-v2 support. Keep each under its exact `candidate_key`; never assign or rewrite an existing `entry-*` ID. Existing Light wave-2 and Web80 IDs referenced in fresh candidate context are context only and must not be edited.
7. Source URLs are leads, not proof. Distinguish primary source text from headlines, filed company statements from independent confirmation, and direct support from contextual mention. If full source text is absent or inaccessible, record that limitation rather than claiming it was read.
8. For PR47 rows, classify whether the source describes a discrete event or only a generic tracker/theme. Analyze shared-event relationships with real identity evidence; consolidate only where event identity is demonstrated. Do not force merges merely because topics, people, or URLs overlap. The PR47 report warns that shared events should be consolidated before canonical acceptance.
9. Return one JSONL review row per assigned source row, preserving `record_id`/`entry_number` for held rows, `candidate_key` for fresh rows, and `review_key` for PR47 rows. Include `review_status`, `recommended_disposition`, `supported_facts`, `contradicted_or_unsupported_claims`, `sources_consulted`, `source_access_notes`, `counterpart_comparison` when relevant, event-vs-tracker classification, evidence-based related-event groups (or none), and `remaining_gap`. Every output is a proposal for separate human review only.

## Packet files

- `held-dispositions.jsonl`: source held manifest rows joined to the full frozen original record, current merged description snapshot where present, corpus snapshot, and claim-level cited leads.
- `duplicate-counterpart-fulltext.jsonl`: all 59 duplicate/canonical pairs with both full frozen rows, available full description/corpus text, dedupe decisions, and sources. Missing text/source coverage is explicit; do not invent it.
- `source-evidence.jsonl`: frozen source rows, embedded source fields, cached description/corpus source metadata, and held claim-level evidence.
- `existing-corrections-context.jsonl`: only matching historical correction/proposal rows, labeled context-only.
- `fresh84-review-only.jsonl`: the 84 separate candidate records and exact promotion review state.
- `pr47-proposed-corrections-review-only.jsonl`: 58 unapproved proposed corrections with original facts and PR-head provenance, on separate review keys.
- `web80-original-fullfacts-context-only.jsonl`: frozen original records and available full description/source context for the reserved 80; context-only, not reassigned.
- `active-assignment-exclusions.json`: authoritative active Light and Web ID fences and computed overlap assertions.
- `manifest.json`: input/output SHA-256 values and exact row counts.

The `complete_for_human_insert_review` label in the fresh manifest is a structural workflow state, not fact approval or insert authorization. No proposal from this assignment is production-ready until separate human review and fresh release gates.
