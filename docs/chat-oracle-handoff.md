# Trump Files Chat + Oracle Handoff

This project now includes:

- A streaming chat API route: `/api/chat`
- A dual-mode chat widget (`expert` and `trump_ai`)
- Retrieval adapters for:
  - Trump Files data in Neon
  - Oracle chunk/doc corpora (`TF_KB_CHUNKS` + `TF_KB_DOCUMENTS`)
  - Jmail direct API retrieval
  - Optional web search via Serper
- A Jmail ingestion utility: `scripts/ingest-jmail.mjs`
- Pipeline control interfaces:
  - `scripts/oracle/pipeline-control.mjs`
  - `run_ingest`, `run_embed`, `run_eval`

## Environment Variables

Add these to `.env.local` (or your deployment environment):

```bash
# LLM providers
OPENAI_API_KEY=
OPENAI_MODEL_PRIMARY=gpt-4.1-mini
OPENAI_MODEL_FALLBACK=gpt-4o-mini

# Optional fallback provider
ANTHROPIC_API_KEY=
ANTHROPIC_MODEL=claude-3-5-sonnet-latest

# Retrieval behavior
CHAT_MAX_TRUMP_ENTRIES=8
CHAT_MAX_ORACLE_CHUNKS=8
CHAT_MAX_ORACLE_CANDIDATES=80
CHAT_ORACLE_ENABLED=true
CHAT_ORACLE_CORPORA=jmail_world,reference_seed
CHAT_MAX_JMAIL_THREADS=3
CHAT_MAX_WEB_RESULTS=4
CHAT_MAX_TURNS=24
CHAT_MAX_OUTPUT_TOKENS=900

# Jmail direct retrieval toggle
JMAIL_BASE_URL=https://jmail.world
JMAIL_ENABLED=true

# Optional live web search (tool-on-demand)
WEB_SEARCH_ENABLED=false
SERPER_API_KEY=
```

## Chat API contract additions

Request fields accepted by `/api/chat`:

- `mode`: `"expert" | "trump_ai"`
- `citationMode` (or `citation_mode`): currently `"strict"`
- `timeScope` (or `time_scope`): `{ preset, from?, to? }`
- `jurisdiction`: `"any" | "us_federal" | "us_legal" | "global"`
- `includeSources` (or `include_sources`): boolean

Response stream additions:

- `meta` includes:
  - `simulation_badge`
  - `answer_metadata` (`entities`, `date_range`, `confidence`, `retrieval_strategy`)
  - `stats` including Oracle hit counts
- `citation` includes provenance:
  - `sourceId`, `docId`, `chunkId`, `publishedAt`, `trustTier`

## Jmail Ingestion Script

Generate normalized docs/chunks from Jmail search results:

```bash
node scripts/ingest-jmail.mjs
```

Override behavior with env vars:

```bash
JMAIL_QUERY=trump \
JMAIL_PAGE_START=1 \
JMAIL_PAGE_END=60 \
JMAIL_THREAD_LIMIT=3000 \
JMAIL_CHUNK_CHARS=1200 \
node scripts/ingest-jmail.mjs
```

Outputs:

- `tmp/jmail/jmail_docs.jsonl`
- `tmp/jmail/jmail_chunks.jsonl`
- `tmp/jmail/jmail_ingest_summary.json`

## Full Jmail Harvester (preferred)

For complete sitemap-driven ingestion (raw thread JSON + page HTML + media/PDF assets + JSONL output):

```bash
JMAIL_HARVEST_OUT_DIR=tmp/jmail_full \
node scripts/harvest-jmail-world.mjs
```

Resume a stopped run:

```bash
JMAIL_HARVEST_OUT_DIR=tmp/jmail_full \
JMAIL_HARVEST_RESUME=true \
node scripts/harvest-jmail-world.mjs
```

Primary outputs:

- `tmp/jmail_full/jmail_docs.jsonl`
- `tmp/jmail_full/jmail_chunks.jsonl`
- `tmp/jmail_full/raw/threads/`
- `tmp/jmail_full/raw/pages/`
- `tmp/jmail_full/assets/`
- `tmp/jmail_full/harvest_summary.json`

## Oracle Wiring (next step once configs are ready)

When your Oracle connection details are available, run:

```bash
# Resilient Jmail load with retries
ORACLE_DOCS_PATH=tmp/jmail_full/jmail_docs.jsonl \
ORACLE_CHUNKS_PATH=tmp/jmail_full/jmail_chunks.jsonl \
ORACLE_CORPUS_NAME=jmail_world \
node scripts/oracle/load-jmail-to-oracle-resilient.mjs
```

Then run pipeline controls:

```bash
# Ingest reference track(s)
node scripts/oracle/pipeline-control.mjs run_ingest --track=A
node scripts/oracle/pipeline-control.mjs run_ingest --parallel=true

# Embed corpus
node scripts/oracle/pipeline-control.mjs run_embed --corpus=reference_seed

# Execute eval suite (100 cases)
node scripts/oracle/pipeline-control.mjs run_eval --suite-name=gold_questions_v1 --base-url=http://localhost:3000
```
