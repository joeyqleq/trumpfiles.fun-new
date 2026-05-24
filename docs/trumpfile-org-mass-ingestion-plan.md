# Trumpfile.org Mass Ingestion Plan (One-Time Backfill + Ongoing One-Click Updates)

Updated: 2026-05-22

## 1) Goals from user request

- Run a **one-time high-volume backfill** from `trumpfile.org` into The Trump Files.
- Keep entries that are already in our DB out of inserts (dedupe by URL/title similarity).
- Rewrite unmatched entries in our existing house tone (factual + half-satirical/half-sarcastic).
- Expand scope beyond Trump personally to administration/family/network complicity where covered.
- After backfill, continue normal recency ingestion from the latest SQL date cutoff.
- Save an **automation-friendly, one-click workflow** for future runs.

## 2) Constraints and policy for this run

- For this one-time backfill, no source-domain exclusion list is applied.
- Prefer maximal capture volume, then quality-gate by concrete event and dedupe only.
- If a Trumpfile article has source links, use those links as primary references.
- If no usable references are listed, run targeted side-search to attach at least one reachable supporting source.

## 3) Scoring model (explicit mapping)

Each entry writes both JSON scores (`trump_entries.scores`) and normalized columns (`trump_individual_scores`).

Dimensions (0-10):

- `danger`: Immediate or foreseeable harm to people/institutions.
- `insanity`: Observable incoherence, contradiction, or delusional framing.
- `absurdity`: Grotesque or surreal mismatch between action/claim and reality.
- `lawlessness`: Defiance/abuse of legal process, rights, or constitutional norms.
- `authoritarianism`: Coercion, retaliation, intimidation, censorship, state-force abuse.
- `credibility_risk`: Magnitude of false/misleading claim and epistemic damage.
- `recency_intensity`: How live/currently escalating the event is.
- `impact_scope`: Localized vs national/international spread and persistence.

### 3.1 Suggested calculation rubric

Base each score as weighted sum of observed signals, then clamp to `[0,10]`.

- Severity of act/event: 0-4
- Institutional power involved: 0-2
- Scale of affected population: 0-2
- Repetition/pattern fit: 0-1
- Evidence strength/clarity: 0-1

Formula:

`score = round(min(10, severity + power + population + pattern + evidence), 1)`

### 3.2 Dimension-specific signal emphasis

- `danger`: weigh severity + population most heavily.
- `insanity`: weigh contradiction/incoherence + evidence of repeated reversal.
- `absurdity`: weigh spectacle/grift theater + factual mismatch.
- `lawlessness`: weigh legal defiance indicators + process abuse.
- `authoritarianism`: weigh coercive state-use + retaliation evidence.
- `credibility_risk`: weigh falsity clarity + audience reach.
- `recency_intensity`: weigh event freshness + current escalation.
- `impact_scope`: weigh geographic and institutional spread.

### 3.3 Text fields tied to scoring

- `rationale_short`: one sharp sentence naming the core indictment.
- `rationale_detail`: concise paragraph connecting evidence to score shape.

## 4) One-time Trumpfile.org backfill workflow

1. Pull all index/list pages from Trumpfile.org and extract entry URLs.
2. Parse each entry for title/body/date/entities/category/tags/source links.
3. Normalize into candidate JSONL schema.
4. Hard dedupe against `trump_sources.url` and soft dedupe against recent `trump_entries.title`.
5. Rewrite unmatched items to The Trump Files editorial voice.
6. Compute score set via rubric above.
7. Generate 4-statement SQL bundle for:
   - `trump_entries`
   - `trump_individual_scores`
   - `trump_sources`
   - `trump_keywords`
8. Apply with `scripts/apply-sql-batch.mjs`.
9. Verify row parity/counts and latest inserted window.
10. Log run summary + any ingestion caveats.

## 5) Post-backfill recency update workflow

Start strictly after latest SQL `date_start` in DB and continue normal recency harvesting with the same score rubric and tone.

## 6) One-click automation design

Automation has two modes:

- `bootstrap_trumpfile_once` (manual one-time): full Trumpfile scrape + rewrite + insert.
- `recency_update` (repeatable): fetch from last DB date cutoff forward.

Execution targets:

- Codex Web: can run scripted pipeline if env vars are available in runtime.
- Codex app/desktop: preferred for long-running jobs and easier credential management.

Minimal trigger contract:

- `DATABASE_URL`
- `MODE=bootstrap_trumpfile_once|recency_update`
- `FROM_DATE` optional override
- `BATCH_SIZE` optional (default 50)

## 7) Immediate next implementation steps

1. Build `scripts/trumpfile_bootstrap_scrape.mjs` for site extraction.
2. Build `scripts/trumpfile_bootstrap_transform.py` for dedupe + rewrite payload.
3. Build `scripts/trumpfile_bootstrap_generate_sql.py` for 4-statement output.
4. Add `scripts/run-trump-ingestion-oneclick.mjs` wrapper to execute mode-based flows.
5. Add verification command set and final run report.

