# Worker 20 release-gate independent QA

Offline proposal and synthetic simulation only; no Neon endpoint, credential, connection, DDL, or DML was used. Inputs: packet `86d71a0bcd9d82301e72bc9f36a4271143c87ddb`, latest account2 integration QA `38ec98608d61fc6e9eab0816f9f83d2d45f8e977`, prior worker20 audit `856a2a0b715e5f5fe590eb41d485ac24ee78bc79`.

- Exact set: 100 unique results, no missing/extra keys. Latest QA 64 PASS / 36 HOLD; effective release gate 62 PASS / 38 HOLD because prior worker20 HOLDs for entry-29 and entry-77 remain held (entry-7 already held). Only 62 effective PASS rows are staged.
- Independently checked identity, dimensions, range/precision, and all 100 six-dimension weighted scores with Decimal half-up rounding.
- Simulated six fields for all 100 records (600 checks) with synthetic NULL and non-NULL target values; every synthetic pre-existing non-NULL value remained unchanged. This does not assert live DB values.
- SQL has per-column `CASE WHEN target.field IS NULL`, a NULL-filtered UPDATE, exact stage/join row-count assertions, before-image preservation assertion, transaction rollback on failures, 1s lock timeout and 30s statement timeout.

## Blockers

Migration is proposal-only: live Neon relation, unique/indexed key, existing column types/values and plan quota are unknown because database contact was prohibited. Local declarations suggest `public.trump_entries(entry_number)` but do not certify it. Workers 07/10/11 lack upstream exact-set attestations; worker 12's written weights sum to 0.99 although recalculation matches. URLs were structurally checked, not fact-checked. The 38 HOLD rows remain excluded; PASS is not import/publication approval.
