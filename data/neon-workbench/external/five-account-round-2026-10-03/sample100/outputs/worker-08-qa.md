# Worker 08 — sample100 import rehearsal QA

Packet: `codex/five-account-review-packets-2026-10-03` at `86d71a0bcd9d82301e72bc9f36a4271143c87ddb`.
Input: `data/neon-workbench/external/five-account-round-2026-10-03/sample100/worker-08-input.jsonl`; SHA256 `2d8a8cff708e0e95b15792a1938299710341f2d6d228a0b50c3efde2b9e9b24e`.
Exact assigned key set: entry-8, entry-20, entry-32, entry-46, entry-58, entry-72, entry-84, entry-96 (8 records).

## Method and guardrails

Offline review only. No live Neon reads or writes, no DDL/DML, and no canonical edits. The impact-v2 formula checked was `round(0.30×harm + 0.20×reach + 0.15×institutions + 0.15×procedural_abuse + 0.10×self_dealing + 0.10×persistence, 2)`. Dimension values were checked for all six names, 0–10 bounds, and one-decimal precision. Text counts use whitespace splitting for words and Unicode code points for short-description characters.

SQL readiness is simulated only: parameter names can be assembled, but target NULL state was not read. Any write must use `WHERE entry_number = :entry_number AND target_column IS NULL`; an existing non-NULL value is preserved and not overwritten. This rehearsal is not editorial approval or production-import authorization.

## Per-key result

| Key | Result | Text counts (short chars / medium words / long words) | Impact (calculated / supplied) | Simulated parameter readiness | Exact reason |
|---|---|---:|---:|---|---|
| `entry-8` | **PASS** | 60 / 63 / 210 | 5.16 / 5.16 | conditional_ready | PASS: frozen identity matches entry_number 8; declared preserved text fields match the supplied frozen values; all three text limits pass; impact score 5.16 matches the weighted six-dimension result 5.16; source URL and both provenance references are present. |
| `entry-20` | **PASS** | 103 / 59 / 158 | 0.90 / 0.90 | conditional_ready | PASS: frozen identity matches entry_number 20; declared preserved text fields match the supplied frozen values; all three text limits pass; impact score 0.90 matches the weighted six-dimension result 0.90; source URL and both provenance references are present. |
| `entry-32` | **PASS** | 57 / 52 / 241 | 4.58 / 4.58 | conditional_ready | PASS: frozen identity matches entry_number 32; declared preserved text fields match the supplied frozen values; all three text limits pass; impact score 4.58 matches the weighted six-dimension result 4.58; source URL and both provenance references are present. |
| `entry-46` | **PASS** | 43 / 48 / 238 | 1.20 / 1.20 | conditional_ready | PASS: frozen identity matches entry_number 46; declared preserved text fields match the supplied frozen values; all three text limits pass; impact score 1.20 matches the weighted six-dimension result 1.20; source URL and both provenance references are present. |
| `entry-58` | **PASS** | 58 / 70 / 255 | 2.65 / 2.65 | conditional_ready | PASS: frozen identity matches entry_number 58; declared preserved text fields match the supplied frozen values; all three text limits pass; impact score 2.65 matches the weighted six-dimension result 2.65; source URL and both provenance references are present. |
| `entry-72` | **PASS** | 59 / 68 / 268 | 1.10 / 1.10 | conditional_ready | PASS: frozen identity matches entry_number 72; declared preserved text fields match the supplied frozen values; all three text limits pass; impact score 1.10 matches the weighted six-dimension result 1.10; source URL and both provenance references are present. |
| `entry-84` | **PASS** | 61 / 47 / 234 | 3.31 / 3.31 | conditional_ready | PASS: frozen identity matches entry_number 84; declared preserved text fields match the supplied frozen values; all three text limits pass; impact score 3.31 matches the weighted six-dimension result 3.31; source URL and both provenance references are present. |
| `entry-96` | **HOLD** | 113 / 70 / 165 | 0.20 / 0.20 | hold_correction_parameter | HOLD: the staged status is complete, but its note says the row remains needs_context pending a short-field correction. The same note says neither supplied report supports the preserved claim that Trump was unaware for several minutes. The proposed corrected text is available, but the frozen short field is populated, so a NULL-only write must skip it. Keep this record out of simulated correction readiness pending separate editorial approval and an authorized non-NULL correction path. |

## Metadata notes

- `entry-20`: Staged category is Human Rights Violations; frozen category is Racism / Discrimination. This is outside declared preserved fields and is recorded for editorial review, not treated as a row-identity failure.
- `entry-46`: Staged category is Authoritarianism; frozen category is Authoritarianism / Dictator Worship. This is outside declared preserved fields and is recorded for editorial review, not treated as a row-identity failure.
- `entry-72`: Staged category is Authoritarianism; frozen category is Violent Rhetoric / Threats. The packet note says the category was replaced; this is outside declared preserved fields and is recorded for editorial review, not treated as a row-identity failure.

## Exact-set QA

- Result count: 8; pass: 7; hold: 1.
- Keys and order exactly match the packet manifest: `["entry-8", "entry-20", "entry-32", "entry-46", "entry-58", "entry-72", "entry-84", "entry-96"]`.
- Source SHA256 verified: `2d8a8cff708e0e95b15792a1938299710341f2d6d228a0b50c3efde2b9e9b24e`.
- All eight records have matching row identity, preserved-field checks, valid description bounds, formula-matching impact scores, and source/provenance references.
- All rows use the NULL-only predicate in the simulated plan; target NULL status remains unknown because the database was not queried.
- Entry-96 is held because its staged `complete` status conflicts with a `needs_context` note, and the preserved populated short field is unsupported by its supplied sources. The NULL-only guard safely prevents overwriting it.
- One checkpoint was written after record 8, within the required 5–10-record interval.
- No tests or UI verification apply: this change adds offline QA artifacts only and does not alter application code or a user-facing flow.
