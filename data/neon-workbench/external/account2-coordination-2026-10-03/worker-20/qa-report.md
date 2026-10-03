# Account 2 worker 20 — sample100 offline import rehearsal

Source: `86d71a0bcd9d82301e72bc9f36a4271143c87ddb` on `codex/five-account-review-packets-2026-10-03`; all 12 source packet files matched their manifest SHA256 values. **100/100 exact keys validated**, with zero missing or duplicate rows.

Results: **97 PASS, 3 HOLD.** All identities, description lengths, six-dimensional score inputs, weighted score arithmetic, and supplied source/draft provenance passed across the packet. The weighted formula is 30% harm + 20% reach + 15% institutions + 15% procedural abuse + 10% self-dealing + 10% persistence, rounded half-up to two decimals.

The six nullable fields are the impact dimensions. Their NULL-only behavior was exercised offline with both a synthetic NULL target (fill) and non-NULL target (preserve) for each dimension on every row. No SQL ran and no Neon/database connection was made. The source packet does not include the actual production SQL statement, so the real query’s predicates remain unverified and must be checked before any execution.

## Holds

- `entry-77`: Preservation snapshot and staged payload differ in source_urls.
- `entry-29`: Preservation snapshot and staged payload differ in people_tags.
- `entry-7`: Preservation snapshot and staged payload differ in title, description_short, description_long.

Old-text preservation found 5 supplied value-snapshot differences across 3 records: `entry-7` (title, description_short, description_long), `entry-29` (people_tags), and `entry-77` (source_urls). Those rows are held so a NULL-only predicate can preserve the pre-existing value; no overwrite is permitted. For field-list snapshots, old values were not present in the packet, so the simulation verified the non-NULL preservation behavior using the NULL-guard truth table rather than claiming a content comparison.

Rollback the entire proposed transaction if identity/count changes, any write affects a non-NULL target, dimensions or weighted score fail, any description length fails, or provenance is missing. No transaction was run; rollback conditions were checked as simulation gates. This rehearsal is not editorial approval or production-import approval.
