# impact368 worker-15 integration QA

Read-only integration of the 12 worker proposal ledgers frozen against `86d71a0bcd9d82301e72bc9f36a4271143c87ddb`. No worker branch was edited, and no canonical record, database, or stored score was changed.

## Exact-set validation

- Expected assignment: 368 unique IDs from the frozen manifest.
- Integrated ledger: 368 rows, 368 unique IDs; exact set match: **True**.
- Normalized statuses: 5 scored; 363 deferred. Raw `remain_deferred` values normalize to `deferred`; no deferral was forced into a score.
- Ledger SHA256: `0f70c16cca457d061d2a02a811959c6dc0465e903d05925c69681dc7588146f6`.

## Worker proposal sources

- Worker 01: 31/31 proposals from `ls/2-trump-files-impact368-review-01-of-12-ulQ4` at `cb484af16587`
- Worker 02: 31/31 proposals from `ls/3-trump-files-impact368-review-02-of-12-2F_B` at `7c9b5c7404a1`
- Worker 03: 31/31 proposals from `ls/4-trump-files-impact368-review-03-of-12-46t_` at `9601af179bdd`
- Worker 04: 31/31 proposals from `ls/5-trump-files-impact368-review-04-of-12-OOIR` at `771947e881ac`
- Worker 05: 31/31 proposals from `ls/6-trump-files-impact368-review-05-of-12-o-Gh` at `7274ef487092`
- Worker 06: 31/31 proposals from `ls/7-trump-files-impact368-review-06-of-12-sjBp` at `53fdd7651b3d`
- Worker 07: 31/31 proposals from `ls/8-trump-files-impact368-review-07-of-12-7OJh` at `f895c36820bc`
- Worker 08: 31/31 proposals from `ls/9-trump-files-impact368-review-08-of-12-3Ywr` at `3f9072398667`
- Worker 09: 30/30 proposals from `ls/10-trump-files-impact368-review-09-of-12-jMbt` at `5f9c468c66d5`
- Worker 10: 30/30 proposals from `ls/11-trump-files-impact368-review-10-of-12-Kjf6` at `af9fe5472384`
- Worker 11: 30/30 proposals from `ls/12-trump-files-impact368-review-11-of-12-DPiB` at `3e5d6a11b243`
- Worker 12: 30/30 proposals from `ls/13-trump-files-impact368-review-12-of-12-lHzI` at `e0696ad07468`

## Dimensions and formula

Scored records must have exactly six dimensions in [0, 10], each at one-decimal precision. Deferred records keep `dimensions: null` and no weighted score. Derived proposal totals use the established formula rounded half-up to two decimals:

`round_half_up(0.30*harm + 0.20*reach + 0.15*institutions + 0.15*procedural_abuse + 0.10*self_dealing + 0.10*persistence, 2)`.

Composite values are read-only QA calculations; worker proposals are unchanged.

- `entry-1200`: 1.00 from {'harm': 2.0, 'reach': 2.0, 'institutions': 0.0, 'procedural_abuse': 0.0, 'self_dealing': 0.0, 'persistence': 0.0}
- `entry-1589`: 1.30 from {'harm': 2.0, 'reach': 2.0, 'institutions': 2.0, 'procedural_abuse': 0.0, 'self_dealing': 0.0, 'persistence': 0.0}
- `entry-113`: 2.50 from {'harm': 0.5, 'reach': 7.0, 'institutions': 4.0, 'procedural_abuse': 0.0, 'self_dealing': 0.0, 'persistence': 3.5}
- `entry-6278`: 5.65 from {'harm': 4.5, 'reach': 8.0, 'institutions': 7.0, 'procedural_abuse': 6.0, 'self_dealing': 4.0, 'persistence': 3.5}
- `entry-1385`: 0.78 from {'harm': 1.0, 'reach': 1.0, 'institutions': 1.5, 'procedural_abuse': 0.0, 'self_dealing': 0.0, 'persistence': 0.5}

## Exact validation errors

- None.

Deferred proposals retain their record-specific missing-fact/rationale text in the ledger. The exact expected/actual keys, all branch/file hashes, counts, formula totals and validation errors are recorded in `final-qa.json` and `checkpoint-final.json`.
