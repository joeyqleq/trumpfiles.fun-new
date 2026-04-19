# Trump Files Ingestion Playbook

This file exists so future agents do not have to reverse-engineer the project every time a new batch is needed.

## Project Thesis

`The Trump Files` is not a neutral clipping service.

It is a half-scientific, half-satirical archive of the most fucked-up things Donald Trump has ever said or done. The point is to preserve receipts, fight flood-the-zone amnesia, track recurring patterns of harm, and document the behavior that would get Trump crushed in a hypothetical court of morality, ethics, manners, religion, and public memory even when formal law does not reach it cleanly.

The site should help readers:

- remember why they hate this man
- laugh at the grotesque absurdity when laughing is part of surviving it
- trace patterns across time instead of treating each outrage as isolated
- preserve evidence for historical memory and accountability

The voice can be sarcastic, mocking, and morally explicit. It must not fabricate.

## Tone Rules

- Be factual first, savage second.
- Do not use bland both-sides language to flatten clear wrongdoing.
- It is acceptable to sound disgusted, amused, or judgmental when the facts support it.
- Satire belongs in framing, wording, and editorial posture, not in invented claims.
- The writing should feel like a pissed-off but well-sourced archivist with a sense of humor.

## What Counts As an Entry

The archive should include more than traditional “headline scandal” articles.

Valid entry types include:

- direct Trump actions, executive moves, legal postures, or policy consequences
- mainstream articles about a concrete Trump-related event
- primary-source Trump quotes from rallies, speeches, interviews, Truth Social, archived White House statements, transcripts, or video clips
- blatant lies, offensive remarks, racist or misogynistic rhetoric, cruel taunts, vindictive language, humiliating incompetence, vanity stunts, absurd shenanigans, or moral filth that reveal character or pattern
- undercovered but verifiable moments that may never receive a standalone CNN-style scandal article
- “funny but damning” incidents, as long as they are concrete, sourced, and worth remembering

If a sourced Trump action or quote would materially worsen his standing in a hypothetical moral court, it is probably in scope.

## What Does Not Count

- vague rumor without a reachable source
- recycled coverage of the same event with no distinct angle, date, actor, or consequence
- liveblogs, newsletters, “as it happened” feeds, generic topic hubs, or low-signal digest pages unless they are only a temporary lead
- quote compilations with no verifiable original source
- trivia that is merely goofy but not revealing, harmful, memorable, or pattern-building

## Source Hierarchy

Preferred source order:

1. Primary source: transcript, speech, video, archived statement, government document, court document, Truth Social post, official release.
2. Mainstream reachable reporting: AP, Reuters, Guardian, NPR, PBS, CBS, ABC, CNN, NYT, WaPo, BBC, Politico, WSJ, Time, LA Times, NBC, etc.
3. Fact-check, NGO, rights, legal, or academic support: PolitiFact, FactCheck, ACLU, Amnesty, HRW, CREW, court filings, etc.

Mainstream reporting is not mandatory if the primary-source evidence is strong and reachable.

## Search Scope

Do not search only for “Trump scandal” articles.

Search across:

- event reporting
- transcripts
- fact checks
- official statements
- video clips
- archived pages
- rally remarks
- interviews
- Truth Social / social-post references
- court and government documents

Use targeted queries that combine Trump with behavior and subject matter, for example:

- `Trump said`, `Trump claimed`, `Trump told`, `Trump posted`, `Trump Truth Social`, `Trump remarks transcript`
- `Trump fact check`, `Trump false claim`, `Trump misleading`
- `Trump racist remark`, `Trump sexist remark`, `Trump insulted`, `Trump mocked`
- `Trump Iran strike`, `Trump war powers`, `Trump civilian deaths`, `Trump contradiction Iran`
- `Trump tariffs court ruling`, `Trump deportation detention`, `Trump DOJ pressure`, `Trump EPA rollback`

Also search by behavior cluster when mainstream framing is too polite:

- lying
- cruelty
- humiliation
- incompetence
- greed
- vanity
- retaliation
- corruption
- authoritarianism
- absurdity

## Recency Workflow

Always determine the uncovered window from the database first.

Important date rule:

- Postgres `date` fields are serialized through JS and can appear as timestamp-looking values.
- Do not trust the raw JSON timestamp string alone for cutoffs.
- Normalize on SQL date semantics before deciding the next ingestion window.

As of the April 18, 2026 follow-up update now applied in this repo:

- highest `entry_number`: `2313`
- actual `trump_entries` row count: `2284`
- matching `trump_individual_scores` row count: `2284`
- `trump_sources` row count: `2618`
- `trump_keywords` row count: `8973`
- max SQL `date_start`: `2026-04-18`
- the latest three applied April batches are `2214–2263`, `2264–2293`, and `2294–2313`, covering April 2 through April 18 with war escalation, pope-feud fallout, DOGE/USAID devastation, institutional intimidation, immigration cruelty, climate sabotage, economic shock, rally-level lies, and Trump Media legal retreat

So the next recency run should begin after the April 18, 2026 cutoff, with SQL-date normalization before finalizing the exact next `from-date`.

## Dedupe Rules

Apply both of these before inserting:

1. Hard URL dedupe against `trump_sources`
2. Semantic/title dedupe against recent entries and within the candidate batch

Working rule:

- `1 source URL = 1 concrete event entry`
- only split into multiple entries when there is a clearly distinct sub-event with different date, actor, or consequence

## Writing Rules for New Entries

### Title

- Must be explicitly Trump-centered
- Must be descriptive enough that another agent can identify the event from the title alone
- Avoid vague or generic macro framing

### Synopsis

- This is the long-form field
- It appears truncated on cards and fully on the entry detail page
- Write it as the expanded explanation with extra context, stakes, and why the event matters
- Paraphrase and expand; do not copy the source verbatim
- Include relevant historical or institutional context when it improves understanding

### Rationale Short

- This is the sharp, compact takeaway
- It is shown on the back of the flip card as “Context”
- Keep it punchy and specific

### Keywords

- Use concrete search and pattern terms, not filler
- Store them in both `trump_entries.keywords` and normalized `trump_keywords` rows

## Score Mapping

Each new entry should preserve the existing score shape:

- `danger`
- `insanity`
- `absurdity`
- `lawlessness`
- `authoritarianism`
- `credibility_risk`
- `recency_intensity`
- `impact_scope`
- `rationale_short`
- `rationale_detail`

The same information is mirrored in:

- `trump_entries.scores` as JSON
- `trump_individual_scores` as normalized columns

## Database Mapping

Every production batch should maintain parity across:

- `trump_entries`
- `trump_individual_scores`
- `trump_sources`
- `trump_keywords`

Minimum acceptable write pattern:

1. insert `trump_entries`
2. insert `trump_individual_scores`
3. insert `trump_sources`
4. insert `trump_keywords`

Then verify counts and missing-row parity after commit.

Do not rely only on `trump_entries.keywords`; the read model depends on `trump_keywords`.

## UI Mapping

Current UI behavior is important when drafting text:

- card front: title, category, short visible slice of `synopsis`
- card back: truncated `synopsis`, `rationale_short`, source chips, vote UI
- detail page: full `synopsis`, keywords, score grid

So the fields should be written to support all three surfaces at once.

## Logo Workflow

Every source used in production should have a working local logo if possible.

Relevant files:

- `public/brand_logos/`
- `public/brand_logos/LOGO_MAPPING.json`
- `components/FlippableEntryCard.tsx`

Real behavior:

- cards derive logo paths from the source URL domain
- aliases and special cases are hardcoded in `DOMAIN_LOGO_MAP` inside `components/FlippableEntryCard.tsx`

Workflow for a new domain:

1. Confirm the article URL works.
2. Check whether a matching PNG already exists in `public/brand_logos/`.
3. If not, fetch or generate a local PNG and save it with the domain-style filename.
4. If the domain needs aliasing or subdomain remapping, update `DOMAIN_LOGO_MAP`.
5. Keep `LOGO_MAPPING.json` reasonably in sync when practical.

Do not ship a batch of new sources without checking whether the logo path will resolve on the cards.

Operational note from the March 23, 2026 batch:

- `nytimes.com` surfaced useful candidates during discovery but returned `403` on direct GET checks, so those URLs were excluded from the production batch even though the article pages existed.
- Treat direct-GET reachability as the final source-card gate, not search discoverability alone.
- Some otherwise valid Guardian and L.A. Times article URLs timed out at `--max-time 20` during validation but returned `200` on a single `--max-time 45` retry. Retry slow reputable URLs once before discarding them.
- Very large inline `psql` URL-array dedupe checks can trip the Neon pooler and drop the connection before results are returned. Prefer smaller point checks or a driver-backed parameterized query (`psycopg2` or the repo's `pg` helper) for hard URL dedupe when the candidate list is large.
- For one-off shell checks, do not rely on `source .env.local` to populate `DATABASE_URL`; extract the variable directly from the file before running `node` or `psql`, because other env lines can prevent a clean export in shell sessions.
- In this Codex desktop environment, non-interactive shells may not resolve `node` or `psql` from `PATH`. Use `/opt/homebrew/bin/node` and `/opt/homebrew/bin/psql` explicitly for batch apply and verification commands.

## War and Mass-Harm Coverage

For war, occupation, civilian-harm, and atrocity-related entries:

- identify agency and responsibility from sourced facts
- avoid euphemistic language when the reporting is clear
- do not flatten aggressor and victim into interchangeable chaos
- explain the consequence chain, not just the isolated quote or strike

If the evidence is contested, say so explicitly. If it is not contested, do not pretend it is.

## Future-Agent Operating Order

When asked to continue ingestion:

1. Read `openmemory.md`
2. Read this file
3. Check the current DB cutoff and recent titles/sources
4. Harvest candidate URLs
5. Dedupe by URL and title similarity
6. Validate every source URL
7. Ensure source logos exist and map correctly
8. Draft entries in the established site voice
9. Generate the 4-statement SQL bundle
10. Apply sequentially, preferably with `node scripts/apply-sql-batch.mjs --file <batch.json>`
11. Verify counts, parity, and recent rows
12. Update `openmemory.md` with any new operational rule that emerged

## Most Recent Applied Batches

- Batch: `2214–2263`
- Applied on: `2026-04-18`
- Coverage shape:
  - DOGE / USAID devastation, Iran-war diplomatic chaos, ballroom vanity, DACA deportations, pope-feud fallout, Hormuz escalation, FISA extension, campus targeting, DOJ voter-data failure, ICE turmoil, aid destruction, public-health staffing, Fed pressure, climate denial, AI-religious spectacle, alliance humiliation, NASA gutting, migrant dumping, inflation shock, and workforce ruin
- Source domains used:
  - `theguardian.com`
  - `apnews.com`
  - `npr.org`
  - `pbs.org`
  - `cbsnews.com`
  - `latimes.com`
- Validation result:
  - all 50 source URLs returned `200`
  - hard URL dedupe against `trump_sources` returned `0` collisions
  - post-commit parity checks returned `0` missing rows across scores, sources, and keywords

- Batch: `2264–2293`
- Applied on: `2026-04-18`
- Coverage shape:
  - ceasefire branding, Lebanon mass-killing fallout, NASA self-congratulation lies, civilization-scale threats, journalist intimidation, civil-rights rollback, carceral spectacle, MilitaryTok blowback, budget cruelty, anti-mail-voting backlash, Bondi/Gabbard turbulence, NATO rupture, and market shock
- Source domains used:
  - `theguardian.com`
  - `latimes.com`
- Validation result:
  - all 30 source URLs returned `200`
  - hard URL dedupe against `trump_sources` returned `0` collisions
  - post-commit parity checks returned `0` missing rows across scores, sources, and keywords

- Batch: `2294–2313`
- Applied on: `2026-04-18`
- Coverage shape:
  - American-Catholic pope-feud fallout, psychedelic-veteran gimmickry, Arizona rally lie-fog, Pakistan backchannel diplomacy, FEMA patronage, Iran-deal spin, anti-mail-voting backlash, DOJ politicization, student-debt retaliation, migrant-death backlash, climate blackout, alliance rebuff, and Trump Media legal retreat
- Source domains used:
  - `theguardian.com`
  - `cbsnews.com`
  - `npr.org`
  - `latimes.com`
  - `abcnews.com`
- Validation result:
  - all 20 source URLs returned `200`
  - hard URL dedupe against `trump_sources` returned `0` collisions
  - post-commit parity checks returned `0` missing rows across scores, sources, and keywords
  - no logo-file changes were needed because existing local aliases already covered the domains used

## Current Ground Truth Files

Start here if resuming:

- `openmemory.md`
- `docs/trumpfiles-ingestion-playbook.md`
- `scripts/apply-sql-batch.mjs`
- `scripts/_tmp_collect_trump_candidates.py`
- `scripts/_tmp_generate_batch_from_candidates.py`
- `scripts/repair-sources.mjs`
- `components/FlippableEntryCard.tsx`
- `app/page.tsx`
- `app/wtf/page.tsx`

## Final Reminder

The mission is not “be comprehensive in a neutral encyclopedia voice.”

The mission is:

- document the worst things Trump has said or done
- preserve the pattern logic behind them
- resist forgetting
- keep the facts straight
- keep the tone sharp
- make the archive useful, damning, and memorable
