# Worker 24 application compatibility audit

Read-only review of the current application against the coordinator request for six proposed description/impact-v2 Neon fields and a 100-record sample. The detailed findings, exact source locations, limitations, and recommended migration/read order are in `worker-24-compatibility-audit-20261003.json`.

The app currently models and displays `synopsis` plus numeric `impact_scope`. `/api/catalog-data` and `/api/entries` use explicit projections that omit proposed fields; the single-entry, visualizer, admin, and legacy cached paths use `SELECT *` and could pass columns through only if the Neon view exposes them. TypeScript types, card/dossier UI, upload ingestion, and the Trumpstein chat/vector pipeline do not consume the proposed schema.

The exact six column identifiers and the 100-row sample were not present in the checkout. The `/api/entries` default limit of 100 is ordinary pagination and was not treated as the supplied sample. No database was queried. Consequently, field-level type/name compatibility and sample IDs, null rates, alignment, and old/new values remain unverified.

No application code, Neon schema/data, canonical records, or scores were changed.
