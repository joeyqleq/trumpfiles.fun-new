# Worker 04 sample100 offline QA

Packet commit: `86d71a0bcd9d82301e72bc9f36a4271143c87ddb` on `codex/five-account-review-packets-2026-10-03`.

Input SHA256 verified: `d87729dac75073905c6bd71d889c18fd732f71fcec4be7f40a726704506ef694`. The packet contains the exact nine assigned keys and no extras.

## Results

| Key | Result | Lengths (short chars / medium words / long words) | Score check | Simulated SQL parameters |
|---|---|---:|---|---|
| `entry-4` | **PASS** | 61 / 50 / 227 | 2.28 = 2.28 | READY_FOR_SIMULATED_BIND; `IS NULL` guard required; target state unverified |
| `entry-16` | **PASS** | 52 / 52 / 240 | 2.90 = 2.9 | READY_FOR_SIMULATED_BIND; `IS NULL` guard required; target state unverified |
| `entry-28` | **PASS** | 71 / 52 / 238 | 2.90 = 2.9 | READY_FOR_SIMULATED_BIND; `IS NULL` guard required; target state unverified |
| `entry-42` | **PASS** | 55 / 77 / 234 | 3.95 = 3.95 | READY_FOR_SIMULATED_BIND; `IS NULL` guard required; target state unverified |
| `entry-54` | **HOLD** | 60 / 72 / 239 | 2.65 = 2.65 | READY_FOR_SIMULATED_BIND_WITH_IMPORT_HOLD; `IS NULL` guard required; target state unverified |
| `entry-68` | **PASS** | 52 / 73 / 219 | 4.85 = 4.85 | READY_FOR_SIMULATED_BIND; `IS NULL` guard required; target state unverified |
| `entry-80` | **PASS** | 62 / 71 / 275 | 4.73 = 4.73 | READY_FOR_SIMULATED_BIND; `IS NULL` guard required; target state unverified |
| `entry-92` | **PASS** | 84 / 79 / 230 | 3.03 = 3.03 | READY_FOR_SIMULATED_BIND; `IS NULL` guard required; target state unverified |
| `entry-104` | **PASS** | 59 / 58 / 221 | 5.25 = 5.25 | READY_FOR_SIMULATED_BIND; `IS NULL` guard required; target state unverified |

Exact hold reason:

- `entry-54` — HOLD: preserved existing text mismatch: category staged='Conspiracy Theories / Disinformation'; frozen category='Medical Misinformation'.

## QA method and limits

- Checked staged and impact record identifiers against the frozen entry number; checked each declared preserved text/value against the frozen row. `entry-54` is held because its staged category changes an existing value.
- Counted words by whitespace-separated tokens. Limits are short <=180 characters, medium 45–90 words, and long 140–300 words.
- Recomputed impact as `round_half_up(0.30*harm + 0.20*reach + 0.15*institutions + 0.15*procedural_abuse + 0.10*self_dealing + 0.10*persistence, 2)`; all nine supplied scores match.
- Checked for non-empty HTTPS source URLs, draft provenance, impact-score provenance, and score basis in packet metadata. URLs and claims were not fetched or independently fact-checked.
- Simulated bind values are present for all nine rows. Any eventual update must match the frozen entry number and include a `target_column IS NULL` predicate for every field written. No live database read was made, so actual target NULL state and production schema/column mapping remain unverified.
- No live Neon calls, DDL/DML, canonical edits, editorial approval, or production import were performed. This is rehearsal QA only.

Batch JSONL SHA256: `bbb73564bb2252690feb0a8fe5fcbb3ee338d9bf479a7bee2bc9cdc6dac6981c`.

Repository lint: `npm run lint` exited 0 with 0 errors and 186 warnings. No type-check or test script is declared in `package.json`; no application code changed.
