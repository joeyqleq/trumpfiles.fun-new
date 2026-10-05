# Manual Neon import safety runner

This is an offline-prepared, operator-invoked runner. It is not wired to GitHub Actions and does not discover or promote candidate data. Never point it at `backfill-sources-auto.mjs`, a Neo4j plan, or an unreviewed JSONL source file. It accepts a separate reviewed JSON plan; no Neon connection or write is made by the dry run or tests.

## What it enforces

- Dry-run unless `--apply` is explicitly supplied, plus a second confirmation value `IMPORT_CONFIRM=APPLY:<plan_id>`.
- One local exclusive lock per checkpoint path. A crashed process may leave a stale lock; inspect the process and transaction outcome, then remove that exact lock file manually before continuing.
- Plan SHA-256 binding on resume, unique positive `entry_number` values, at most 500 rows per invocation, and at most 10 rows in a committed batch.
- A hard 15-minute walltime maximum (default 10 minutes), statement timeout no higher than 5 seconds, and lock timeout no higher than 1 second.
- Each batch is one Neon HTTP transaction. `statement_timeout` and `lock_timeout` are set transaction-locally before row updates.
- Each update only fills rows where every named target column is SQL NULL. A row that is already populated or changed causes a stop. Every row must return its expected entry ID before the checkpoint advances.
- Atomic local checkpoint after each committed batch. A plan digest mismatch or un-reconciled nonzero checkpoint blocks ordinary invocation. `--resume` requires the exact same plan bytes.
- First database error stops the run. There is no automatic retry/backoff and no row-level skip-and-continue.

The local lock coordinates processes sharing that filesystem. It cannot prevent a second runner on another machine; run from one operator host only. Neon transaction request timeout ambiguity is handled conservatively: on timeout or transport error the checkpoint stays behind, and the operator must reconcile the last batch against a fresh read before resume. Do not blindly resume an uncertain commit.

## Plan format

Prepare a separate JSON file with this shape. `columns` are identifiers; `values` are bound parameters in matching order. Every row must be reviewed and its target fields must be NULL in the production preflight. No SQL text is accepted from the plan.

```json
{
  "version": 1,
  "plan_id": "descriptions-reviewed-2026-10-03-a",
  "target": "public.trump_entries",
  "columns": ["description_medium", "description_long"],
  "rows": [
    {"entry_number": 123, "values": ["reviewed medium text", "reviewed long text"]}
  ]
}
```

The current offline plans are not production approval: `data/neon-workbench/description-import-plan.md` records that the frozen export lacks the dedicated description columns, and the schema-v2 apply plan is explicitly `offline_only_not_authorized_for_neon`. `impact-v2` has an additive offline migration draft, but the impact import plan requires a fresh schema/export and release review. Do not construct a production plan from those artifacts until the current branch and exact target rows have passed the gates below.

## Before any production plan is created

Production import is currently blocked. The previous export is dated 2026-09-23 and does not establish current schema, branch, storage headroom, or compute remaining. A future separately authorized release operator must:

1. Identify the exact Neon project and production branch from the Neon console; compare its branch ID/name with the approved release record. Never infer production from a URL label or use a development branch by accident.
2. Check current storage used/available and compute remaining/reset time in Neon’s usage view. Save a timestamped screenshot or export reference in the release record. Require enough storage for the planned rows, indexes/WAL overhead, and rollback window. If the usage view is unavailable, ambiguous, exhausted, or below the agreed budget, stop without connecting the importer.
3. Take a fresh read-only schema/data preflight from that exact branch. Confirm target columns/types, primary key, every planned `entry_number`, row count, and that all target columns are still NULL. Compare the preflight to the reviewed plan and record its checksum. The old frozen SQLite export is not a substitute.
4. Validate content and provenance; `complete` status, word counts, or an offline validator do not constitute factual/editorial approval. Get a distinct review reference and put it in the release record (not in credentials or SQL).
5. Keep the first plan small (suggested 5 rows per transaction, hard max 10) and one invocation to at most 500 rows. Save plan, hash, preflight, compute/storage evidence, branch identity, and expected counts together.

If any gate fails, do not run `--apply`. Review and release approval are separate from this implementation; this document does not authorize a database write.

## Local use

Dry-run (prints counts and plan digest only):

```sh
node scripts/neon-safe-import.mjs /secure/path/reviewed-plan.json
```

Only after the gates and release authorization above, run one bounded invocation from a single operator host:

```sh
IMPORT_CONFIRM='APPLY:descriptions-reviewed-2026-10-03-a' \
IMPORT_BATCH_SIZE=5 \
IMPORT_WALLTIME_MS=600000 \
IMPORT_STATEMENT_TIMEOUT_MS=5000 \
IMPORT_LOCK_TIMEOUT_MS=1000 \
DATABASE_URL="$DATABASE_URL" \
node scripts/neon-safe-import.mjs /secure/path/reviewed-plan.json --apply
```

Keep credentials in the environment or a secret manager; never print or place them in the plan, checkpoint, shell history, or logs. To continue after a cleanly checkpointed stop, first re-run the branch/usage and changed-row preflight, then use the identical plan bytes with `--apply --resume`. After an ambiguous batch outcome, reconcile every row in that batch before deciding whether to advance/rebuild the checkpoint. Do not edit checkpoint state to force progress.

## Local bounded verification

Run only the focused, network-free test file:

```sh
node --test scripts/neon-safe-import.test.mjs
```

This does not validate Neon availability or authorize/perform production import.
