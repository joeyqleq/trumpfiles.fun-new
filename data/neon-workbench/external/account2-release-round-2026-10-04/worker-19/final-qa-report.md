# Worker 19 — Web PR49 release-gate audit

**Outcome: BLOCKED.** The published PR49 results branch at `d68d16f1546cc03b0d5e6596b1dc99921852b97d` still contains an access blocker stating final validation was not completed; it has no terminal release result. Per-row passes are proposal-only and do not authorize canonical or database changes.

Reconciled all **425** assigned Web425 keys: **142 staged-only** and **283 account4 held283**. The key sets partition exactly; held283 is a subset of Web425, the prior Web425 output has exactly one terminal QA row per key, and account4 has exactly one latest normalized row per held key. The staged-only segment comprises 84 fresh and 58 PR47 keys.

## Effective outcomes

- Staged-only 142: prior Web425 QA recorded 61 passes and 81 holds. Independent candidate-state review leaves 53 supported proposal candidates, holds 87 items including six PR47 candidates still unresolved, and preserves two explicit no-event exclusion proposals (one pending evidence and one incoherent composite).
- Held283 283: 41 account4 rows are marked release-ready after independent structural checks (40 event proposals and one publication-context-only exclusion); 242 remain blocking holds.
- Combined row-level outcome: 93 supported event proposal candidates, 329 holds, and three explicit no-event/exclusion proposals (including account4’s publication-context-only result). All remain proposal-only; the overall PR49 release gate remains blocked.
- Prior Web425 statuses across all IDs: 224 pass, 191 hold, 10 superseded.

## Precedence and independent checks

For held283 overlaps, the newest account4 normalized result controls over previous Web425 QA. Earlier conflicts remain visible in each key row: account4 held 137 prior Web425 passes; it advances 13 prior holds and 2 superseded rows to a later proposal-ready outcome; 26 prior passes remain proposal-ready; 97 prior holds and 8 superseded outcomes remain blocking. The 142 staged-only keys have no account4 row; their prior Web425 terminal rows are retained as evidence, with six unresolved PR47 candidates held and three no-event/exclusion outcomes kept distinct.
The 425 packet keys and record identity tuples are unique. 43 keys have an explicit duplicate/consolidation/counterpart disposition and 21 have an explicit split disposition; duplicate mappings remain proposal-only, and a split is not treated as ready when any retained child is incomplete or unsupported.
Independently checked all 47 event drafts in account4’s 41 ready outcomes against short ≤180 characters, medium 45–90 words, long 140–300 words, and valid source URLs. Scanned 295 unique Web425 QA URLs and 178 unique account4 URLs; no malformed HTTPS URLs were found. One additional ready outcome is explicitly ‘do not create’ (publication context only), not an event draft. No structural failures were found among these ready candidates. All available per-worker account4 summary counts matched independent row-level recomputation; several summaries omit counters, which are recorded and recomputed in the checkpoint.

## Exact input and output provenance

- Web425 input packet commit: `86d71a0bcd9d82301e72bc9f36a4271143c87ddb` (425 assigned keys).
- Held283 input packet commit: `9c072598a308f740fa3948896bab26beb72edb3b` (283 assigned keys).
- Published PR49 baseline: `d68d16f1546cc03b0d5e6596b1dc99921852b97d`; final validation blocker is `data/neon-workbench/external/web-release-review/2026-10-03/results/ACCESS-BLOCKER-2026-10-03.md`.
- Exact latest branch heads for all 12 Web425 workers, per-worker input hashes, QA file hashes, and account4 normalized result hashes are recorded in `checkpoint.json`.
- Per-key effective records: `data/neon-workbench/external/account2-release-round-2026-10-04/worker-19/effective-results.jsonl`; independent validation: `data/neon-workbench/external/account2-release-round-2026-10-04/worker-19/independent-qa.json`.

## Remaining blockers

There are 329 row-level blockers, listed by exact key and reason in `effective-results.jsonl` and `independent-qa.json`. The six PR47 candidates reclassified from prior QA pass to release hold are `pr47-review-entry-1445`, `pr47-review-entry-1455`, `pr47-review-entry-1521`, `pr47-review-entry-1526`, `pr47-review-entry-1593`, and `pr47-review-entry-1648`; `pr47-review-entry-112` remains an explicit exclusion proposal pending evidence; `pr47-review-entry-130` and `entry-7123` are separately marked no-event/context exclusions. Independently, the global PR49 release blocker remains: its published checkpoint says review is unfinished and no terminal release result exists. No blocker was converted into approval.

No canon, database, Neon, PR, merge, or other-worker output changes were made.
