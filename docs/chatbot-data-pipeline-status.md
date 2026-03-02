# Chatbot Data Pipeline Status (Reset + Exact)

This is the exact current state so there is no ambiguity.

## Done in code

1. Chat foundation exists:
   - `/api/chat` streaming endpoint
   - dual frontend modes (`expert`, `trump_ai`)
   - retrieval from Neon + Oracle corpus + direct Jmail fallback + optional web search
   - strict request contract fields:
     - `citationMode` / `citation_mode` (`strict`)
     - `timeScope` / `time_scope`
     - `jurisdiction`
     - `includeSources` / `include_sources`
   - response metadata includes:
     - `simulation_badge`
     - `answer_metadata` (`entities`, `date_range`, `confidence`)
     - per-citation provenance (`sourceId`, `docId`, `chunkId`, `publishedAt`, `trustTier`)
2. Jmail crawler upgraded for long runs:
   - `scripts/ingest-jmail.mjs`
   - retries, throttling, checkpoint/resume
   - writes `tmp/jmail/jmail_docs.jsonl` and `tmp/jmail/jmail_chunks.jsonl`
3. Oracle schema script added:
   - `scripts/oracle/create_tf_kb_schema.sql`
   - creates `TF_KB_DOCUMENTS`, `TF_KB_CHUNKS`, `TF_INGEST_RUNS`
   - extends tfmeta/tfvec support tables:
     - `TF_SOURCE_REGISTRY`
     - `TF_DOC_META`
     - `TF_ENTITIES`
     - `TF_DOC_ENTITY`
     - `TF_EVENTS`
     - `TF_EVENT_ENTITY`
     - `TF_STYLE_SNIPPETS`
     - `TF_KB_CHUNK_EMBEDDINGS`
4. Oracle loader added:
   - `scripts/oracle/load-jmail-to-oracle.mjs`
   - upserts docs/chunks from JSONL into Oracle with checkpoint/resume
   - resilient wrapper added:
     - `scripts/oracle/load-jmail-to-oracle-resilient.mjs`
     - retries auto after recoverable network failures
5. Non-Jmail reference corpus seed pipeline added:
   - `data/reference_sources.seed.json`
   - `data/reference_sources.phase1.seed.json` (expanded phase-1 official/legal/history corpus)
   - includes free/open biography sources:
     - NARA archived Trump biography
     - Miller Center biography
     - Wikipedia biography (CC BY-SA)
     - Wikidata entity (CC0)
   - `scripts/ingest-reference-corpus.mjs`
   - outputs docs/chunks JSONL for legal/history/biography seed URLs
6. WebScraper CSV converter added:
   - `scripts/convert-webscraper-csv-to-jsonl.mjs`
   - converts scraper CSV (`URL` + `Plain Text`) into Oracle-loadable JSONL docs/chunks
7. Full Jmail harvester added:
   - `scripts/harvest-jmail-world.mjs`
   - sitemap discovery + thread JSON dump + page HTML dump + asset download
   - auto-generates Oracle-ready JSONL (`jmail_docs.jsonl`, `jmail_chunks.jsonl`)
8. Pipeline control interfaces added:
   - `scripts/oracle/pipeline-control.mjs`
   - actions:
     - `run_ingest(source_id, since_cursor)` via `run_ingest`
     - `run_embed(corpus, from_doc_id)` via `run_embed`
     - `run_eval(suite_name)` via `run_eval`
   - helper worker scripts:
     - `scripts/oracle/run-ingest-source.mjs`
     - `scripts/oracle/run-ingest-workers.mjs` (tracks A/B/C/D in parallel)
     - `scripts/oracle/run-embed-corpus.mjs`
     - `scripts/oracle/run-eval-suite.mjs`
     - `scripts/oracle/generate-eval-suite.mjs` (`100`-case suite)

## Not done yet

1. Full Jmail docs/chunks load is still incomplete in Oracle (resume is active/in-progress).
2. Embedding job has script support but still needs to be run on full corpora.
3. Eval suite exists (`100` cases) but needs execution against your running app endpoint.
4. Connector-specific API ingestors (Congress/GovInfo/Federal Register/etc.) still need dedicated per-source adapters beyond seed-page ingestion.

## What you do now (exact)

1. Run schema SQL in each Oracle DB where you want KB storage:
   - `@scripts/oracle/create_tf_kb_schema.sql` (SQL*Plus/SQLcl path mode)
2. Put Oracle connection env vars in your shell:
   - `ORACLE_USER`
   - `ORACLE_PASSWORD`
   - `ORACLE_CONNECT_STRING`
   - optional wallet vars:
     - `ORACLE_WALLET_LOCATION`
     - `ORACLE_WALLET_PASSWORD`
     - `ORACLE_CONFIG_DIR`
3. Preferred: run full Jmail harvester (no GUI scraper needed):
   - `JMAIL_HARVEST_OUT_DIR=tmp/jmail_full node scripts/harvest-jmail-world.mjs`
4. Resume after interruption:
   - `JMAIL_HARVEST_OUT_DIR=tmp/jmail_full JMAIL_HARVEST_RESUME=true node scripts/harvest-jmail-world.mjs`
5. Load Jmail JSONL into Oracle (resilient retry wrapper):
   - `ORACLE_DOCS_PATH=tmp/jmail_full/jmail_docs.jsonl ORACLE_CHUNKS_PATH=tmp/jmail_full/jmail_chunks.jsonl ORACLE_CORPUS_NAME=jmail_world node scripts/oracle/load-jmail-to-oracle-resilient.mjs`
6. Build + load reference corpus:
   - `node scripts/ingest-reference-corpus.mjs`
   - optional explicit phase-1 seed: `REFERENCE_SOURCES_PATH=data/reference_sources.phase1.seed.json node scripts/ingest-reference-corpus.mjs`
   - `ORACLE_DOCS_PATH=tmp/reference/reference_docs.jsonl ORACLE_CHUNKS_PATH=tmp/reference/reference_chunks.jsonl ORACLE_CORPUS_NAME=reference_seed node scripts/oracle/load-jmail-to-oracle.mjs`
7. If you export from a GUI scraper instead of API ingest:
   - `WEBSCRAPER_CSV_PATH=/absolute/path/export.csv node scripts/convert-webscraper-csv-to-jsonl.mjs`
   - `ORACLE_DOCS_PATH=tmp/jmail_webscraper/jmail_docs.jsonl ORACLE_CHUNKS_PATH=tmp/jmail_webscraper/jmail_chunks.jsonl ORACLE_CORPUS_NAME=jmail_world node scripts/oracle/load-jmail-to-oracle.mjs`
8. Run control interfaces:
   - `node scripts/oracle/pipeline-control.mjs run_ingest --track=A`
   - `node scripts/oracle/pipeline-control.mjs run_ingest --parallel=true`
   - `node scripts/oracle/pipeline-control.mjs run_embed --corpus=reference_seed --from-doc-id=ref:`
   - `node scripts/oracle/pipeline-control.mjs run_eval --suite-name=gold_questions_v1 --base-url=http://localhost:3000`

## Harvester controls

- `JMAIL_HARVEST_MAX_THREADS=0` (0 = no limit)
- `JMAIL_HARVEST_MAX_PAGES=0`
- `JMAIL_HARVEST_MAX_ASSETS=0`
- `JMAIL_HARVEST_DOWNLOAD_PAGES=true|false`
- `JMAIL_HARVEST_DOWNLOAD_ASSETS=true|false`
- `JMAIL_HARVEST_BUILD_JSONL=true|false`
- `JMAIL_HARVEST_REFRESH_DISCOVERY=true` (forces refetch of all sitemap XML files)

## Latest measured discovery baseline

From a full sitemap pass on February 19, 2026:

- `sitemap_count`: 214
- `url_count`: 5151
- `thread_count`: 5000
- `page_count`: 151

## What I will do after you send Oracle config

1. Run the schema directly against your Oracle DBs.
2. Execute ingestion and monitor long-run checkpoints.
3. Add embedding generation + vector search retrieval in Oracle.
4. Switch chat retrieval path to Oracle-backed RAG for Jmail/reference corpora while keeping Neon as canonical Trump data.
