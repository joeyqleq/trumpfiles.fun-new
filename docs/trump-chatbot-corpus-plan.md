# Trump Chatbot Corpus Plan (Mode 1 + Mode 2)

Updated: February 19, 2026

## 1) Product contract

Two modes, one shared evidence core:

- Mode 1 (`Analyst`): date/entity/location precise answers with verifiable citations.
- Mode 2 (`Persona`): simulated Trump-like voice grounded in evidence, clearly labeled as a simulation.

Hard rule: Mode 2 may alter style only, never facts.

## 2) Current pipeline state

As of February 19, 2026:

- Full Jmail harvest exists locally:
  - `tmp/jmail_full/jmail_docs.jsonl` (`5000` docs)
  - `tmp/jmail_full/jmail_chunks.jsonl` (`22144` chunks)
- Oracle load is actively resumable from:
  - `tmp/jmail_full/oracle_load_checkpoint_full_r3.json`
- Existing Oracle KB tables:
  - `TF_KB_DOCUMENTS`
  - `TF_KB_CHUNKS`
  - `TF_INGEST_RUNS`

Neon remains canonical for your editorial Trump entries. Oracle is the high-volume retrieval layer.

## 3) Storage split (Neon vs Oracle)

- Neon (`trump` DB): your curated entry records, scoring, source links, structured editorial facts.
- Oracle `tfvec_*`: vector/text retrieval corpora (Jmail + reference corpora + legal/history/economic corpus).
- Oracle `tfmeta_*`: structured entities/events/timelines/features for analytics and reasoning.

## 4) Corpus map by purpose

### A) Core Trump primary corpus (highest priority)

1. Jmail World dump (already harvested)
   - Role: high-volume narrative evidence + relationship/network patterns.
   - Ingest mode: current JSONL pipeline.

2. American Presidency Project
   - Link: [American Presidency Project](https://www.presidency.ucsb.edu/)
   - Role: speeches, debates, statements across all presidents (critical for cross-president comparisons).
   - Ingest mode: sitemap/API-style crawl of official text pages.

3. Trump White House archive + NARA presidential archives
   - Link: [Archived White House Websites (NARA)](https://www.archives.gov/presidential-records/research/archived-white-house-websites)
   - Link: [PRA Trump Administration Records (NARA)](https://www.archives.gov/foia/pra-trump-admin)
   - Role: official presidency-era statements and records context.
   - Ingest mode: targeted archive-domain crawler.

### B) U.S. legal and constitutional grounding (Mode 1 must-have)

4. Congress API
   - Link: [Congress API](https://api.congress.gov/)
   - Link: [Congress API docs (GitHub)](https://github.com/LibraryOfCongress/api.congress.gov)
   - Role: bill actions, sponsors, dates, committee paths.
   - Ingest mode: API pull with daily delta.

5. GovInfo API + bulk
   - Link: [GovInfo API](https://www.govinfo.gov/features/api)
   - Link: [GovInfo BILLSTATUS bulk](https://www.govinfo.gov/bulkdata/BILLSTATUS)
   - Role: authoritative legislative/executive publications.
   - Ingest mode: bulk snapshots + weekly refresh.

6. Federal Register API
   - Link: [Federal Register API docs](https://www.federalregister.gov/developers/documentation/api/v1)
   - Link: [Data.gov Federal Register API listing](https://catalog.data.gov/dataset/federalregister-gov-and-api)
   - Role: executive orders, rules, notices, presidential documents timeline.
   - Ingest mode: API by date window.

7. U.S. Code bulk corpus
   - Link: [US Code downloads](https://uscode.house.gov/download/download.shtml)
   - Role: statutory baseline for legal claims.
   - Ingest mode: bulk download + structured parser.

8. Constitution Annotated
   - Link: [Constitution Annotated](https://constitution.congress.gov/about/constitution-annotated/)
   - Role: constitutional interpretation and case linkage.
   - Ingest mode: full crawl + periodic updates.

9. CourtListener / RECAP
   - Link: [CourtListener API](https://www.courtlistener.com/help/api/)
   - Link: [RECAP API endpoints](https://www.courtlistener.com/help/api/rest/recap/)
   - Role: litigation history, docket metadata, opinion text.
   - Ingest mode: API + selective bulk.

10. eCFR API
    - Link: [eCFR developer API](https://www.ecfr.gov/developers/documentation/api/v1)
    - Role: live regulatory text context.
    - Ingest mode: API snapshots by title/section.

### C) Political, economic, campaign context (reasoning layer)

11. FEC/OpenFEC
    - Link: [FEC data portal](https://www.fec.gov/data/)
    - Link: [OpenFEC developers](https://api.open.fec.gov/developers/)
    - Role: campaign finance, committee and spending trails.
    - Ingest mode: API pull.

12. SEC EDGAR API
    - Link: [SEC EDGAR APIs](https://www.sec.gov/search-filings/edgar-application-programming-interfaces)
    - Role: entity filings and financial event context.
    - Ingest mode: API + filing text extractor.

13. MIT Election Data and Science Lab
    - Link: [MIT Election Lab data](https://electionlab.mit.edu/data)
    - Role: election trend and comparative baselines.
    - Ingest mode: dataset import.

14. Census API
    - Link: [Census developer portal](https://www.census.gov/data/developers.html)
    - Role: demographic/geographic normalization.
    - Ingest mode: API by geography.

15. FRED / BLS / BEA
    - Link: [FRED API docs](https://fred.stlouisfed.org/docs/api/fred/)
    - Link: [BLS developer portal](https://www.bls.gov/developers/)
    - Link: [BEA API signup/docs](https://apps.bea.gov/api/signup/)
    - Role: macroeconomic context for policy and impact questions.
    - Ingest mode: scheduled time-series pull.

### D) Enrichment and large-scale backfill

16. Wikidata entity dump
    - Link: [Wikidata entity dumps](https://dumps.wikimedia.org/wikidatawiki/entities/)
    - Role: canonical entity IDs and alias normalization.
    - Ingest mode: periodic dump processing.

17. GDELT
    - Link: [GDELT Project](https://www.gdeltproject.org/)
    - Role: global media event timelines and co-occurrence signals.
    - Ingest mode: daily export ingestion.

18. Common Crawl (selective)
    - Link: [Common Crawl](https://commoncrawl.org/)
    - Role: only for targeted backfill where official API is unavailable.
    - Ingest mode: query-constrained extraction, not full crawl.

## 5) Oracle schema extension plan

Current tables are enough for document retrieval. Add these for reasoning quality:

- `TF_SOURCE_REGISTRY`
  - `source_id`, `name`, `base_url`, `license_type`, `trust_tier`, `update_cadence`, `active`
- `TF_DOC_META`
  - `doc_id`, `published_at_utc`, `jurisdiction`, `doc_type`, `language`, `hash_sha1`, `ingest_version`
- `TF_ENTITIES`
  - `entity_id`, `entity_type`, `canonical_name`, `aliases_json`, `wikidata_qid`
- `TF_DOC_ENTITY`
  - `doc_id`, `entity_id`, `mention_count`, `first_offset`, `confidence`
- `TF_EVENTS`
  - `event_id`, `event_date_utc`, `location_text`, `summary`, `source_doc_id`, `event_type`
- `TF_EVENT_ENTITY`
  - `event_id`, `entity_id`, `relation_type`, `confidence`
- `TF_STYLE_SNIPPETS`
  - `snippet_id`, `speaker`, `period`, `style_tags_json`, `text`, `source_doc_id`

Keep embeddings in `TF_KB_CHUNKS.EMBEDDING` once VECTOR is enabled.

## 6) Retrieval and latency strategy

Use a hybrid RAG pipeline so chat stays fast:

1. Query planner:
   - extract entities, dates, legal intent, requested precision.
2. Candidate retrieval:
   - lexical BM25 + vector search (Oracle Vector Search).
3. Rerank:
   - cross-encoder on top 50 candidates.
4. Multi-hop assembly:
   - merge evidence across Neon + Oracle corpora.
5. Answer generation:
   - enforce citation spans.
6. Guardrails:
   - legal phrasing for allegations, uncertainty when evidence is weak.

Latency controls:

- precompute embeddings at ingest time.
- maintain small summary chunks (200-400 tokens) + long chunks (700-1200 tokens).
- cache top query plans and high-frequency entities.
- use async retrieval fans with hard timeout per source.

## 7) Mode-specific logic

### Mode 1 (`Analyst`)

- Prioritize official/legal sources by trust tier.
- Require at least two citation anchors for contested claims.
- Expose `date`, `location`, `people`, `confidence` in answer metadata.

### Mode 2 (`Persona`)

- Same fact retrieval as Mode 1 first.
- Style transfer only from approved style snippets (speeches/interviews/tweets/public remarks).
- Always show UI badge: `Simulated Persona`.
- Block fabricated names, dates, cases, and fake legal claims.

## 8) Predictive analytics layer (after corpus baseline)

Build features from structured timelines:

- event frequency and burst detection.
- co-mention network dynamics (entity graph drift).
- language markers over time (sentiment, aggression, certainty, repetition).
- policy/legal event lag correlations.

Output as:

- confidence-scored projections.
- scenario explanations with explicit assumptions.
- no deterministic claims about future actions.

## 9) Acquisition sequence (what to do in order)

1. Finish full Jmail Oracle load.
2. Ingest P0 corpora (APP + NARA archives + Congress/GovInfo/Federal Register).
3. Add legal stack (US Code + Constitution Annotated + CourtListener + eCFR).
4. Add campaign/economic context (FEC + SEC + MIT Election + Census + FRED/BLS/BEA).
5. Add enrichment (Wikidata + GDELT + selective Common Crawl).
6. Run dedupe/entity-link/timeline jobs.
7. Rebuild embeddings and evaluate both modes.

## 10) Immediate tasks in this repo

- Keep Oracle loader running until all `5000` docs and `22144` chunks are upserted.
- Expand seed sources for non-Jmail reference ingestion.
- Add source-level trust tiers and citation formatting in chat response objects.
- Add RAG evaluation set (100+ fixed questions for date/location/association checks).

## 11) Compliance and data-quality notes

- Prefer official APIs over scraping whenever available.
- Respect robots, terms, and rate limits for each source.
- Keep claim provenance explicit and timestamped.
- Treat allegations distinctly from adjudicated findings.
