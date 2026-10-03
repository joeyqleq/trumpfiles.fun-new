# Worker 02 — sample100 offline rehearsal QA

- Packet commit: `86d71a0bcd9d82301e72bc9f36a4271143c87ddb`
- Input: `worker-02-input.jsonl`; SHA256: `d03503aa35f2e7865af5c00c7c7dff4ded3a181ac4e981c8e4de21d74eeeeff1`
- Exact key set (9): `entry-2`, `entry-14`, `entry-26`, `entry-40`, `entry-52`, `entry-65`, `entry-78`, `entry-90`, `entry-102`
- Result: 5 PASS, 4 HOLD.
- Word counts use whitespace-separated tokens. Impact weight calculation uses decimal half-up rounding; weights are inferred from packet values because no explicit rubric is present in this checkout.
- SQL handling is a parameter-shape simulation only. Target schema and live NULL state were not read; no Neon calls or SQL execution occurred. A hypothetical update is constrained to `target_field IS NULL`.
- This rehearsal is not editorial approval or production import. Source provenance presence was checked; independent claim-level fact checking was not performed.

| Key | Verdict | Exact reason | Short chars | Medium words | Long words | Score check | Simulated SQL |
|---|---|---|---:|---:|---:|---|---|
| `entry-2` | **HOLD** | impact_proposal.notes says "No weighted total calculated" although impact_score is populated and matches the six-dimension formula. | 54 | 70 | 236 | 2.63 = 2.63 | SIMULATED_READY_SCHEMA_UNBOUND |
| `entry-14` | **PASS** | Frozen identity, preserved-field snapshot, all three length limits, packet-internal weighted score, source/provenance metadata, and simulation-only NULL guard all pass. | 56 | 84 | 247 | 4.93 = 4.93 | SIMULATED_READY_SCHEMA_UNBOUND |
| `entry-26` | **HOLD** | preserved_fields lists field names without prior values; unchanged packet text can be carried through, but prior-value preservation cannot be independently compared offline. | 67 | 52 | 240 | 1.70 = 1.70 | SIMULATED_READY_SCHEMA_UNBOUND |
| `entry-40` | **PASS** | Frozen identity, preserved-field snapshot, all three length limits, packet-internal weighted score, source/provenance metadata, and simulation-only NULL guard all pass. | 126 | 67 | 210 | 3.15 = 3.15 | SIMULATED_READY_SCHEMA_UNBOUND |
| `entry-52` | **HOLD** | preserved_fields lists field names without prior values; unchanged packet text can be carried through, but prior-value preservation cannot be independently compared offline. | 68 | 51 | 231 | 5.05 = 5.05 | SIMULATED_READY_SCHEMA_UNBOUND |
| `entry-65` | **PASS** | Frozen identity, preserved-field snapshot, all three length limits, packet-internal weighted score, source/provenance metadata, and simulation-only NULL guard all pass. | 54 | 63 | 224 | 2.75 = 2.75 | SIMULATED_READY_SCHEMA_UNBOUND |
| `entry-78` | **PASS** | Frozen identity, preserved-field snapshot, all three length limits, packet-internal weighted score, source/provenance metadata, and simulation-only NULL guard all pass. | 61 | 74 | 262 | 5.43 = 5.43 | SIMULATED_READY_SCHEMA_UNBOUND |
| `entry-90` | **HOLD** | impact_proposal.notes says "No weighted total calculated" although impact_score is populated and matches the six-dimension formula. | 60 | 75 | 236 | 3.88 = 3.88 | SIMULATED_READY_SCHEMA_UNBOUND |
| `entry-102` | **PASS** | Frozen identity, preserved-field snapshot, all three length limits, packet-internal weighted score, source/provenance metadata, and simulation-only NULL guard all pass. | 59 | 58 | 218 | 6.00 = 6.00 | SIMULATED_READY_SCHEMA_UNBOUND |

## Checkpoint history

- After 5 records: keys `entry-2, entry-14, entry-26, entry-40, entry-52`; 2 PASS / 3 HOLD.
- Final after 9 records: exact manifest key set; 5 PASS / 4 HOLD.

## Holds

- `entry-2`, `entry-90`: packet note says no weighted total was calculated even though `impact_score` is populated and formula-consistent.
- `entry-26`, `entry-52`: `preserved_fields` contains field names only, not prior-value snapshots, so preservation cannot be independently compared offline for those rows.

No packet input, canonical data, or other worker branch was edited.
