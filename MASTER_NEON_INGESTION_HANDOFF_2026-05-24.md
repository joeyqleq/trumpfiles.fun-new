# MASTER NEON INGESTION HANDOFF — TrumpFiles.fun

Updated: 2026-05-24  
Repo: `joeyqleq/trumpfiles.fun-new`  
Local path previously used: `C:\Users\ADMIN\desktop\trumpfiles.fun-new`

This file is the master handoff for a new ChatGPT/Codex/Neon-connected session. It captures the state of the repo, the Neon ingestion state, what has already happened locally, what still needs to be fixed in Neon, and what frontend tasks come after the Neon cleanup is closed.

## 0) First rule for the next AI

Do not start by inserting more entries.

Start by verifying live Neon connectivity, backing up the affected rows, and auditing the newly-added ranges. The recently inserted Trumpfile.org backfill and May 4–May 24 recency batch may contain duplicate topics, weak generated text, overly template-like scoring, bad source attribution, and HTML/source debris inside visible fields.

The desired next phase is **quality finalization**, not volume.

## 1) Required connector and environment check

The new ChatGPT account/session is expected to have:

- GitHub connector access to `joeyqleq/trumpfiles.fun-new`.
- Neon Postgres connector access to the production Neon DB.
- Read/write permissions on Neon, but do not write until after read-only verification and backup.
- If Neon connector is unavailable or write-blocked, fall back to the local script workflow using `.env.local` and `node scripts/apply-sql-batch.mjs`.

First commands/queries to run with Neon connector:

```sql
select current_database(), current_user, now();

select
  count(*)::int as count,
  max(entry_number)::int as max_entry,
  max(date_start) as max_date_start
from public.trump_entries;

select
  (select count(*) from public.trump_entries)::int as entries,
  (select count(*) from public.trump_individual_scores)::int as scores,
  (select count(*) from public.trump_sources)::int as sources,
  (select count(*) from public.trump_keywords)::int as keywords;
```

Then verify whether the 150-entry recency insert really landed:

```sql
select
  count(*)::int as count_4035_4184,
  min(entry_number)::int as min_entry,
  max(entry_number)::int as max_entry
from public.trump_entries
where entry_number between 4035 and 4184;
```

Expected possibilities:

- If only the 1710 Trumpfile backfill is present: `count = 4005`, `max_entry = 4034`.
- If the later local recency run also landed: `count = 4155`, `max_entry = 4184`, with 150 rows in `4035–4184`.

The user pasted both the pre-recency verification (`count=4005`, `max_entry=4034`) and a later successful local run that claimed it inserted `4035–4184`. Treat the live DB as source of truth.

## 2) Security note

A Neon `DATABASE_URL` was pasted into chat earlier. Treat it as exposed. Rotate/regenerate the Neon database password/credential as soon as practical. Do not commit secrets to the repo. Do not paste `.env.local` contents into future chats.

## 3) Canonical codebase facts already verified

The frontend uses Neon through `lib/neonClient.ts`, which reads `process.env.DATABASE_URL`.

Homepage data flow:

- `app/page.tsx` imports `getCachedEntries` and `getEntryStats`.
- It fetches `getCachedEntries(30)` and `getEntryStats()` server-side.
- It passes `entryCount` and `lastScrapedFormatted` to `HomeClient`.

`lib/entries.ts` currently:

- Uses `unstable_cache`.
- Uses `SELECT COUNT(*) as count, MAX(date_start) as last_date FROM trump_entries`.
- Revalidates every 3600 seconds.
- Therefore the homepage hero number is a cached **row count**, not `max(entry_number)`.

Footer flow:

- `components/AsciiFooter.tsx` uses `useEntryCount()`.
- `hooks/useEntryCount.ts` fetches `/api/entry-count`.
- `app/api/entry-count/route.ts` also runs `SELECT COUNT(*) as count, MAX(date_start) as last_date FROM trump_entries`.
- Production count/date are live DB-derived, but the route is not explicitly forced dynamic/revalidate-zero.
- Development mode hardcodes `count: 1100`.

Catalog flow:

- `app/catalog/CatalogClient.tsx` fetches `/api/catalog-data`.
- Search currently checks only `entry.title` and `entry.synopsis`.
- It does not search `entry_number` or `fucked_up_rank`.
- Cards render `FlippableEntryCard`.
- `FlippableEntryCard` front badge currently shows `#{entry.fucked_up_rank}`, not `#{entry.entry_number}`.
- Detail links use `/entry/${entry.entry_number}`.
- This is why searching the visible card number may fail and why the card number can feel disconnected from the actual DB entry number.

Catalog cards:

- `components/FlippableEntryCard.tsx` has fixed outer height `h-[680px]`.
- It inserts a `<div className="flex-grow" />` spacer before the front “See Details” button.
- Back side uses `CardContent className="p-6 space-y-3 h-full flex flex-col overflow-auto"`.
- The current button styles are normal `Button` components.
- `components/ui/hover-border-gradient.tsx` exists and should replace front/back action buttons later.

Source logos:

- `components/FlippableEntryCard.tsx` has `DOMAIN_LOGO_MAP`.
- Cards derive local logo filename from source URL domain, falling back to `<domain-with-dashes>.png`.
- `public/brand_logos/LOGO_MAPPING.json` and local logo PNGs should stay in sync.

## 4) DB state known from the user's terminal before the bulk insert

Before the 1710 Trumpfile backfill, the DB had:

```text
count = 2295
max_entry = 2324
gap_count = 29
```

Missing entry numbers were:

```text
621, 768, 770, 808, 1060, 1061, 1617, 1622, 1653, 1678,
1682, 1683, 1684, 1689, 1699, 1705, 1707, 1709, 1710,
1715, 1720, 1723, 1724, 1733, 1734, 1739, 1741, 1742, 1745
```

Therefore the safe next `entry_number` was `2325`, not the homepage number `2295`.

The difference existed because homepage displayed `COUNT(*)`, while ingestion numbering must use `MAX(entry_number)+1`.

## 5) What was run locally

### 5.1 Trumpfile.org one-time scrape/backfill

Input:
`tmp/oneclick/trumpfile_candidates.json`

The scrape produced 1710 candidates.

The generator originally defaulted to `--count 50`, so it had to be run with `--count 1710`.

The safe generator start was `--start-entry 2325`.

Expected result after the full 1710 insert:

```text
start_entry = 2325
last_entry = 4034
count = 4005
max_entry = 4034
```

The user verified this state locally:

```text
count = 4005
max_entry = 4034
```

### 5.2 Recency update May 4–May 24, 2026

The user updated `scripts/run-trump-ingestion-oneclick.mjs` locally after previous problems:

- Windows needed `py` instead of `python3`.
- `_tmp_collect_trump_candidates.py` accepts `--out` and `--max-candidates`, not `--output` and `--batch-size`.
- The wrapper began querying max entry number and using `max + 1`.

The user ran:

```powershell
$env:MODE="recency_update"
$env:FROM_DATE="2026-05-04"
$env:BATCH_SIZE="150"
node scripts/run-trump-ingestion-oneclick.mjs
```

The local run printed:

```text
Current max entry_number: 4034
Next start entry_number: 4035

candidate_count: 150
from_date: 2026-05-04
to_date: 2026-05-24

selected: 150
start_entry: 4035
last_entry: 4184

applied_statement=1
applied_statement=2
applied_statement=3
applied_statement=4
statements_applied=4
```

If that run truly committed, live DB should now be:

```text
count = 4155
max_entry = 4184
```

But this must be rechecked in Neon because the user also pasted the earlier `4005/4034` check after describing the recency run.

## 6) Existing ingestion methodology problem

The current generator is useful as a mechanical SQL builder, but it is not enough for final production quality.

`scripts/_tmp_generate_batch_from_candidates.py` currently:

- Classifies entries by simple keyword buckets.
- Assigns fixed score tuples from a `SCORES` dict.
- Assigns fixed metrics from a `METRICS` dict.
- Builds `synopsis` mostly from the source title + scraped description + a generic boilerplate sentence.
- Writes `rationale_short` and `rationale_detail` from templates.
- Does not do real AI reasoning.
- Does not do semantic dedupe against the entire existing DB.
- Does not rewrite in the full TrumpFiles.fun voice.
- For Trumpfile.org backfill candidates, it likely used the Trumpfile entry URL as the `trump_sources.url` unless underlying article sources were separately extracted.
- It does not strip all HTML/source-image markup from source bodies because the bootstrap scrape only collected WordPress API title/excerpt/link data, not full parsed source sections.

This means the newly inserted ranges must be audited and repaired.

## 7) High-risk ranges to audit

Treat these ranges as target remediation ranges:

```text
2325–4034  = Trumpfile.org one-time backfill, 1710 rows
4035–4184  = May 4–May 24 recency run, 150 rows if present
```

The old canonical DB baseline before the one-time backfill is:

```text
original/core rows: entry_number <= 2324
```

Do not delete or rewrite original/core rows unless a duplicate cluster requires carefully preserving child rows and the user explicitly approves.

## 8) Mandatory backup before Neon writes

Before deleting/updating anything in affected ranges, create timestamped backup tables. Use an actual timestamp suffix if possible.

Example:

```sql
create table if not exists public.backup_20260524_trump_entries_2325_4184 as
select * from public.trump_entries
where entry_number between 2325 and 4184;

create table if not exists public.backup_20260524_trump_scores_2325_4184 as
select * from public.trump_individual_scores
where entry_number between 2325 and 4184;

create table if not exists public.backup_20260524_trump_sources_2325_4184 as
select * from public.trump_sources
where entry_number between 2325 and 4184;

create table if not exists public.backup_20260524_trump_keywords_2325_4184 as
select * from public.trump_keywords
where entry_number between 2325 and 4184;
```

Then verify:

```sql
select 'entries' as table_name, count(*) from public.backup_20260524_trump_entries_2325_4184
union all
select 'scores', count(*) from public.backup_20260524_trump_scores_2325_4184
union all
select 'sources', count(*) from public.backup_20260524_trump_sources_2325_4184
union all
select 'keywords', count(*) from public.backup_20260524_trump_keywords_2325_4184;
```

## 9) Deduplication task

Goal: compare newly inserted rows against original rows and delete only confident duplicate **new** rows.

### 9.1 Candidate duplicate analysis

Compare `entry_number between 2325 and 4184` against `entry_number <= 2324`.

Use:

- normalized title similarity
- normalized synopsis/body similarity
- date proximity
- source URL overlap
- keyword overlap
- entity/topic overlap
- category/subcategory similarity
- not just exact title match

Suggested read query:

```sql
select
  e.entry_number,
  e.title,
  e.date_start,
  e.category,
  e.subcategory,
  e.synopsis,
  array_agg(distinct s.url) filter (where s.url is not null) as urls
from public.trump_entries e
left join public.trump_sources s on s.entry_number = e.entry_number
where e.entry_number between 2325 and 4184
group by e.entry_number
order by e.entry_number;
```

Also load original/core rows:

```sql
select
  e.entry_number,
  e.title,
  e.date_start,
  e.category,
  e.subcategory,
  e.synopsis,
  array_agg(distinct s.url) filter (where s.url is not null) as urls
from public.trump_entries e
left join public.trump_sources s on s.entry_number = e.entry_number
where e.entry_number <= 2324
group by e.entry_number
order by e.entry_number;
```

### 9.2 Deletion policy

For a duplicate cluster:

- Preserve the older original/core row when a new backfill row merely retells the same event.
- Preserve the new row only if it adds a truly distinct actor, date, consequence, policy move, quote, legal event, or new source angle.
- Delete the duplicate new row from child tables first unless FK cascade is confirmed.

Safe deletion sequence for entries chosen in an array:

```sql
begin;

-- replace values with audited duplicate new entry_numbers only
with doomed(entry_number) as (
  values
  -- (2325), (2326)
)
delete from public.trump_keywords k
using doomed d
where k.entry_number = d.entry_number;

with doomed(entry_number) as (
  values
  -- (2325), (2326)
)
delete from public.trump_sources s
using doomed d
where s.entry_number = d.entry_number;

with doomed(entry_number) as (
  values
  -- (2325), (2326)
)
delete from public.trump_individual_scores sc
using doomed d
where sc.entry_number = d.entry_number;

with doomed(entry_number) as (
  values
  -- (2325), (2326)
)
delete from public.trump_entries e
using doomed d
where e.entry_number = d.entry_number;

commit;
```

After deletion, verify parity.

## 10) Rewrite/rephrase task for surviving Trumpfile.org-derived entries

The surviving 2325–4034 entries must be rewritten so they do not read like Trumpfile.org excerpts.

Required output shape:

1. `title`: explicitly Trump-centered or Trump-administration/family/network centered. It should not be a bare copied headline.
2. `synopsis`: long expanded detail text. The site uses this as:
   - clipped text on catalog front card
   - truncated text on card back
   - full text on entry detail page
3. `rationale_short`: punchy context line shown on flip card back.
4. `scores.rationale_detail`: score-specific explanation.

Write in the TrumpFiles.fun tone:

- factual first
- mocking/satirical second
- sharp but sourced
- no invented factual claims
- broader scope now includes Trump’s administration, family, loyalists, appointees, and close confidants when the event is part of the same governance/power ecosystem.

The user asked for more words and context than the original Trumpfile.org posts, including:

- circumstances
- environment
- reasons
- nuance
- institutional stakes
- historical/pattern context
- why this belongs in the archive
- why it is absurd, dangerous, corrupt, authoritarian, or otherwise revealing

Do not include baseless claims. If using “chitchat” or satire, keep it clearly rhetorical and do not present it as a fact.

## 11) HTML/source debris cleanup

Audit the new ranges for visible raw markup and debris:

```sql
select entry_number, title
from public.trump_entries
where entry_number between 2325 and 4184
  and (
    synopsis ~* '<[^>]+>'
    or synopsis ilike '%&lt;%'
    or synopsis ilike '%&amp;%'
    or synopsis ilike '%src=%'
    or synopsis ilike '%<img%'
    or synopsis ilike '%twitter.com/%'
    or synopsis ilike '%cnn.com/%'
    or rationale ~* '<[^>]+>'
  )
order by entry_number;
```

Clean:

- HTML tags
- image tags
- embedded tweet markup
- raw shortcodes
- `Sources ...` pasted source sections
- HTML entities
- Trumpfile.org backlink text
- any visible `trumpfile.org` attribution

## 12) Source attribution task

The user does not want Trumpfile.org to appear as a visible source on the cards.

Audit:

```sql
select entry_number, url, title, publisher
from public.trump_sources
where entry_number between 2325 and 4184
  and (
    url ilike '%trumpfile.org%'
    or publisher ilike '%trumpfile%'
    or title ilike '%trumpfile%'
  )
order by entry_number;
```

For 2325–4034:

- Use the original Trumpfile entry page only as a lead.
- Scrape/fetch the Trumpfile entry page to extract its underlying source links.
- Preferred links are the reputable news/official/court/primary source links cited in the article.
- Replace `trump_sources.url` with the underlying source link(s).
- Replace publisher/title/date_published/source_type accordingly.
- Do not display Trumpfile.org as publisher or URL.
- If no usable source is found in the article HTML, run targeted web search and attach at least one reachable reputable source.

Source hierarchy:

1. Primary docs/transcripts/court/government/official posts.
2. AP, Reuters, Guardian, NPR, PBS, CBS, ABC, CNN, NYT, WaPo, BBC, Politico, WSJ, Time, LA Times, NBC, etc.
3. Fact-checks/NGOs/legal/academic when relevant.

## 13) Logo workflow

For every final source URL domain:

1. Check `public/brand_logos/`.
2. Check `public/brand_logos/LOGO_MAPPING.json`.
3. Check `components/FlippableEntryCard.tsx` `DOMAIN_LOGO_MAP`.
4. If the source domain has no logo:
   - add a logo PNG to `public/brand_logos/`, or
   - add a generated placeholder PNG with source name, or
   - update `DOMAIN_LOGO_MAP` to reuse an existing parent-domain logo.
5. Do not leave broken image icons on source chips.

## 14) Score/ranking/metric repair

The current backfill generator likely produced mechanical scores, not true per-entry reasoning.

Audit distributions:

```sql
select
  min(entry_number) as min_entry,
  max(entry_number) as max_entry,
  count(*)::int as n,
  avg(danger) as avg_danger,
  avg(authoritarianism) as avg_authoritarianism,
  avg(lawlessness) as avg_lawlessness,
  avg(insanity) as avg_insanity,
  avg(absurdity) as avg_absurdity,
  avg(credibility_risk) as avg_credibility_risk,
  avg(recency_intensity) as avg_recency_intensity,
  avg(impact_scope) as avg_impact_scope
from public.trump_individual_scores
where entry_number between 2325 and 4184;
```

Look for suspicious repeated tuples:

```sql
select
  danger, authoritarianism, lawlessness, insanity, absurdity,
  credibility_risk, recency_intensity, impact_scope,
  count(*)::int
from public.trump_individual_scores
where entry_number between 2325 and 4184
group by 1,2,3,4,5,6,7,8
order by count(*) desc;
```

Re-score each surviving entry using the project rubric:

- `danger`: immediate/foreseeable harm to people/institutions.
- `insanity`: incoherence, contradiction, delusional or clown-car framing.
- `absurdity`: grotesque/surreal mismatch between action/claim and reality.
- `lawlessness`: defiance or abuse of law/process/rights.
- `authoritarianism`: coercion, retaliation, intimidation, censorship, state-force abuse.
- `credibility_risk`: false/misleading claim and epistemic damage.
- `recency_intensity`: freshness/current escalation.
- `impact_scope`: spread/persistence/geographic/institutional scope.

Keep scoring consistent with older data and the `neon_export/trump_fucked_up_ranking.json` snapshot. That JSON is a QA/reference export, not necessarily what the frontend directly reads. The frontend reads `fucked_up_score` and `fucked_up_rank` from the live `ai_complete_trump_data` view.

Also repair:

- `trump_entries.scores` JSON
- `trump_individual_scores` columns
- `impressions`
- `reach_estimate`
- `financial_cost_usd`
- `public_reaction`
- `age`
- `phase`
- `keywords`
- normalized `trump_keywords`

User preference: no empty cells in production tables if a best-effort estimate can reasonably fill them. Do not fabricate factual event claims, but estimates and editorial scoring can be reasoned best guesses.

## 15) Export files in repo

Files the previous Codex note said matter:

```text
neon_export/trump_entries.json
neon_export/trump_individual_scores.json
neon_export/trump_sources.json
neon_export/trump_keywords.json
neon_export/trump_dedupe_backup_log.json
neon_export/trump_fucked_up_ranking.json
neon_export/ai_trump_analysis.json
```

Important observation from this chat:

- `neon_export/trump_sources.json` appears populated.
- `neon_export/trump_fucked_up_ranking.json` appears populated and is useful for rank/score distribution QA.
- `neon_export/trump_entries.json`, `neon_export/trump_individual_scores.json`, and `neon_export/ai_trump_analysis.json` appeared empty via the GitHub fetch tool. Verify in the repo/local clone before relying on them.
- If Neon connector works, prefer the live Neon DB over stale/empty JSON exports.

## 16) Recency methodology validation

Current `recency_update` should not be treated as “done forever.”

Known weaknesses:

- Collector harvests Guardian API + RSS feeds + AP page.
- It may miss key leads.
- It does not do AI-assisted research.
- It does not robustly filter liveblogs/opinion/digest pages.
- It does not perform full semantic dedupe.
- It may silently fail hard URL dedupe if `psql` is missing.
- Generated text and scores are template-driven.
- Source validation is not always enforced.

Desired future flow:

1. Query DB for latest SQL `date_start`.
2. Use that as automatic `FROM_DATE` if env var is absent.
3. Gather candidates from multiple source pools and user-provided leads.
4. Convert candidates into a research queue.
5. For each queue item, find/validate primary/reporting URLs.
6. Hard dedupe by URL.
7. Semantic dedupe against recent/all DB entries.
8. Generate rich title/synopsis/rationale/scores.
9. Verify logos.
10. Generate correctly numbered SQL.
11. Apply in chunks.
12. Verify parity and null/HTML/source contamination.
13. Update memory log.

The wrapper should eventually support:

```text
MODE=recency_update
BATCH_SIZE=150
FROM_DATE optional
TO_DATE optional
PYTHON_CMD optional
```

If `FROM_DATE` is not provided, it must query:

```sql
select max(date_start)::date from public.trump_entries;
```

and start after that SQL date.

## 17) Homepage/footer/count/date fixes

Problem shown in screenshots:

- Homepage hero still showed `2295+ ENTRIES DOCUMENTED`.
- Last updated still showed `May 4, 2026`.
- Catalog showed new entries around `#4033`, proving DB/catalog had newer material while homepage was stale or logically mismatched.

Code problems:

- `getEntryStats` uses `unstable_cache` with `revalidate: 3600`.
- `/api/entry-count` has no explicit `dynamic = 'force-dynamic'` or `revalidate = 0`.
- Homepage count is server-rendered and cached.
- Footer uses a client hook, but API route can still be cached by deployment behavior.
- “Last updated” currently means `MAX(date_start)`, not actual ingestion timestamp.

Fix options:

### Minimal live count/date fix

- Remove or bypass `unstable_cache` for `getEntryStats`.
- Add `export const dynamic = 'force-dynamic';` and `export const revalidate = 0;` to `/api/entry-count/route.ts`.
- Use one shared DB stats query across homepage and footer.
- Ensure visualizer/catalog counts use live `/api/catalog-data` or a stats API.
- If using Next fetch from client, pass `{ cache: 'no-store' }`.

### Better “last ingestion update” fix

Create a table:

```sql
create table if not exists public.trump_ingestion_runs (
  id bigserial primary key,
  run_at timestamptz not null default now(),
  mode text not null,
  start_entry int,
  end_entry int,
  inserted_count int,
  notes text
);
```

Update `scripts/apply-sql-batch.mjs` or wrapper to insert a row after successful commit.

Then display:

```sql
select
  (select count(*) from public.trump_entries)::int as count,
  (select max(entry_number) from public.trump_entries)::int as max_entry,
  (select max(date_start) from public.trump_entries) as latest_event_date,
  (select max(run_at) from public.trump_ingestion_runs) as last_ingested_at;
```

Use `last_ingested_at` for “Last updated” if the user means DB update date.

## 18) Frontend work after Neon cleanup

Do this only after the Neon chapter is finished.

Read `app/TASK_INSTRUCTIONS.md`. It already defines:

- homepage hero responsive fixes
- separate desktop/mobile hero sections
- footer responsive fixes
- pixel shimmer wrapper
- analytics domain updates

Additional user frontend comments from this chat:

### 18.1 Catalog card number search

Current issue: user wants to search by the visible `#` on the card. Currently visible `#` is `fucked_up_rank`, while the real route/detail ID is `entry_number`.

Preferred fix:

- Change front card badge from `#{entry.fucked_up_rank}` to `#{entry.entry_number}`.
- Optionally display rank separately as `Rank #{entry.fucked_up_rank}` in smaller text.
- Update catalog search to include:
  - `String(entry.entry_number)`
  - `#${entry.entry_number}`
  - `String(entry.fucked_up_rank)`
  - `#${entry.fucked_up_rank}`
  - `title`
  - `synopsis`
  - keywords
  - category/subcategory
- This makes the number uniform and route-relevant.

### 18.2 Catalog card vertical whitespace

Current issue: card front has too much empty vertical space between content/button/bottom border.

Current code uses fixed `h-[680px]` plus spacer. Fix carefully:

- Reduce card height only if no clipping occurs.
- Replace crude spacer with a flex layout that pins CTA to bottom.
- Ensure front “See Details” and back “View Full Discussion” CTAs align on the same horizontal baseline.
- Avoid adding scrollbars to the card front.
- Back side can scroll only if content genuinely overflows, but avoid iframe-like misalignment.

Suggested first pass:

- Outer: `min-h-[560px] md:min-h-[620px] h-full` or responsive height.
- Card grid containers should use `items-stretch`.
- Use `mt-auto` on CTA wrappers.
- Reduce `p-6` to `p-5` if needed.
- Keep metric list compact.

### 18.3 Replace card buttons with `HoverBorderGradient`

Component already exists at:

```text
components/ui/hover-border-gradient.tsx
```

Use it for:

- front “See Details”
- back “View Full Discussion”

Requested style:

- front: orange background/border animation with small purple skew/accent
- back: slightly different orange shades
- props available: `children`, `containerClassName`, `as`, `duration`, `clockwise`, plus button props/className.

Example shape:

```tsx
<HoverBorderGradient
  as="button"
  onClick={() => setIsFlipped(true)}
  duration={1.2}
  clockwise
  containerClassName="w-full rounded-xl"
  className="w-full justify-center bg-gradient-to-r from-orange-600 via-orange-500 to-purple-700 text-white font-semibold"
>
  <span className="inline-flex items-center justify-center gap-2">
    <RotateCw className="h-4 w-4" />
    See Details
  </span>
</HoverBorderGradient>
```

## 19) Screenshots attached in the previous chat

Screenshots showed:

- mobile homepage at `trumpfiles.fun`: large 3D orange model, centered layout, stale `2295+` counter and `Last updated May 4, 2026`.
- desktop homepage variants: stale counter/date, hero composition needs responsive tuning.
- catalog screenshot: cards show `#1927`, `#3799`, etc. Those are rank-like values, not necessarily `entry_number`; card spacing has too much empty vertical space; CTA button baseline/space needs tuning.
- ChatGPT Automations UI screenshot: shows automation title prompt, Workflow, Select project, “Daily at 9:00 AM”, template buttons. New AI should ask user to resend screenshots if visual work begins.

## 20) Automation / on-demand trigger guidance

The user does not want scheduled automatic ingestion. They want an on-demand run.

Practical recommendation:

- Prefer a Codex manual task or ChatGPT automation configured as manual/on-demand if the UI supports it.
- If the UI forces a schedule, do not use it for DB writes unless it can be paused/disabled and manually triggered.
- The automation prompt should tell the agent to:
  - connect to GitHub and Neon
  - verify DB counts
  - calculate `FROM_DATE` from live DB if not provided
  - harvest/dedupe/validate
  - generate and apply SQL in chunks
  - run parity checks
  - update memory/docs
  - stop before frontend visual work unless instructed

Suggested on-demand automation prompt:

```text
Project: trumpfiles.fun-new

Run a TrumpFiles recency ingestion update on demand.

Before writing:
1. Read MASTER_NEON_INGESTION_HANDOFF_2026-05-24.md.
2. Read docs/trumpfiles-ingestion-playbook.md.
3. Confirm Neon read/write access with read-only queries.
4. Query current count, max(entry_number), max(date_start), and parity across trump_entries/trump_individual_scores/trump_sources/trump_keywords.
5. If FROM_DATE is not supplied, use the day after max(date_start). If supplied, use the supplied value.
6. Build a research queue for Trump, Trump administration, family, appointees, and close confidants.
7. Dedupe by URL and semantic topic.
8. Validate all source URLs and source logos.
9. Draft rich TrumpFiles-style entries with title, synopsis, rationale_short, rationale_detail, scores, metrics, keywords, age, phase, sources.
10. Apply in safe chunks with backup and parity checks.
11. Update memory docs.
12. Stop and summarize results.
```

## 21) New chat prompt

Use this in the new ChatGPT account/session:

```text
You are continuing the TrumpFiles.fun Neon ingestion finalization project.

First, use the GitHub connector to open joeyqleq/trumpfiles.fun-new and read:
- MASTER_NEON_INGESTION_HANDOFF_2026-05-24.md
- docs/trumpfiles-ingestion-playbook.md
- docs/trumpfile-org-mass-ingestion-plan.md
- openmemory.md
- knowledge.md
- app/TASK_INSTRUCTIONS.md

Ignore chatbot/oracle chatbot docs.

Then use the Neon Postgres connector to test read access only:
select count(*)::int, max(entry_number)::int, max(date_start) from public.trump_entries;

If read works, test whether write access is available safely, but do not modify production rows until you have created backup tables for the affected ranges.

Your first task is NOT to add more entries. Your first task is to audit and finalize the newly inserted ranges:
- 2325–4034: 1710 Trumpfile.org backfill
- 4035–4184: May 4–May 24 2026 recency update, if present

Do the following:
1. Verify current DB counts and whether 4035–4184 exists.
2. Backup affected rows.
3. Deduplicate new rows against original rows <=2324 and within the new ranges.
4. Remove only confidently duplicate new rows.
5. Rewrite surviving Trumpfile-derived rows so the title/synopsis/rationale fields are expanded, original, and in the TrumpFiles.fun tone.
6. Strip HTML/image/source markup and visible Trumpfile.org text.
7. Replace Trumpfile.org sources with underlying reputable source URLs from the original article pages or reputable web search.
8. Validate source URLs and logo coverage.
9. Re-score and repair metrics if the generator’s bucket scores are too mechanical.
10. Verify parity across entries/scores/sources/keywords and fix null/empty fields.
11. Fix homepage/footer/count/date logic so live counters and visualizer counts match Neon.
12. Only after the Neon chapter is closed, begin frontend tasks in app/TASK_INSTRUCTIONS.md plus the catalog-card search/spacing/button changes in the master handoff.

Ask me for screenshots again when you begin frontend visual work or if you need mobile/desktop reference images. If agent/browser mode is required for visual validation, tell me exactly when to switch.
```

## 22) Final warning

Do not trust the 1710 backfill as finished just because it inserted successfully. Treat it as a draft import that needs dedupe, source repair, rewrite, score repair, and UI-facing quality control.
