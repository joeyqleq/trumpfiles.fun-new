# Trump Files Archive, Intelligence, Visual System, and Automation Overhaul

Date: 2026-08-02  
Status: Proposed for implementation  
Project: `trumpfiles.fun-new`  
Primary database: Neon project `trump`, production branch `br-muddy-bonus-aalybvz7`

## 1. Purpose

Trump Files is a half-scientific, half-satirical accountability and character archive. It is not limited to crimes or events for which Donald Trump is the sole, legally proven cause. It documents:

- crimes, corruption, conflicts of interest, institutional abuse, and policy harm;
- direct and indirect consequences of Trump, his family, appointees, agencies, allies, and administration;
- attributed lies, insults, threats, inflammatory rhetoric, etiquette breaches, hypocrisy, humiliating performances, and absurd conduct;
- credible allegations, reported gossip, hearsay, and speculation when their status and origin are explicit;
- satirical interpretation that comments on sourced material without inventing factual claims.

The archive must preserve its rude, funny, opinionated voice while making the underlying evidence model more precise. Scientific structure and satirical writing are complementary layers, not competing identities.

## 2. Program decomposition

This overhaul contains five bounded workstreams that share contracts but can be implemented and verified independently:

1. Data integrity, editorial taxonomy, and score reconstruction.
2. Current-period research, source capture, rewriting, and publication.
3. Site-wide visual-system modernization and responsive repair.
4. Visualizer and insight-mining architecture.
5. Codex-assisted local update switch and optional durable automation.

The sequence is intentional: trustworthy data contracts precede insights, and working insights precede unattended automation.

## 3. Current-state findings

### 3.1 Production data

- Production has 4,175 rows and a maximum public `entry_number` of 4204.
- The latest stored event date is 2026-07-02 and the latest insert occurred on 2026-07-02.
- Entries 4185 through 4204 exist but have no normalized source rows and no score rationales.
- The repair batch covers events dated 2026-05-15 through 2026-07-02.
- Scores for entries 2330 through 4034 match the boundaries and output shape of an untracked random 2-to-9 generator. The public site will not label these entries “untrusted”; their values will be replaced and their prior values retained only in an internal revision log.
- The schema has dual source representations, category and phase drift, duplicate source and keyword rows, missing indexes, and no first-class actor, claim, consequence, relationship, evidence-class, model-version, ingestion-run, or review-state entities.
- The public upload endpoint is unauthenticated, is not atomic, and does not maintain source/keyword parity.
- Two untracked rewrite scripts contain a live-looking Neon credential. That credential must be rotated before automation is enabled.

### 3.2 Production browser audit

Audit artifacts are in `output/playwright/2026-08-02-audit/`.

Routes inspected at desktop and 390-by-844 mobile widths:

- `/`
- `/catalog`
- `/visualizer`
- `/enigma`
- `/wtf`
- `/donate`
- `/entry/4204`
- `/visualizer-lab`

Verified findings:

- Production still requests obsolete `tianji.p5n.lol` and `matomo.p5n.lol` trackers. Both fail DNS.
- The homepage emits a React hydration error and WebGL readback warnings.
- `/visualizer-lab` returns 404 even though the recovered lab is committed on `main`.
- Catalog takes roughly 15 seconds to render entries and transfers the complete archive before filtering client-side.
- At 390px, catalog has 67 rendered interactive targets smaller than 44-by-44 pixels.
- The complete mobile catalog is roughly 38,000px tall.
- The current visualizer takes roughly 20 seconds to load. Its desktop category visualization can render blank, the legend competes with the plot, and mobile tabs clip horizontally.
- `/enigma` renders a very tall empty timeline containing little more than a vertical line.
- Entry 4204 exposes score claims but no source section because its source parity is broken.
- Cards display rank more prominently than the public entry number, making recent entries appear to have lower identifiers.
- The footer still contains stale “1100+” language in one deployed path while live counts report 4,175.
- Decorative multi-spoked PNGs are fixed to viewport percentages, causing repeated clustering and making them feel pasted into the middle rather than distributed through the page.

### 3.3 Technical audit score

| Dimension | Score | Primary issue |
|---|---:|---|
| Accessibility | 2/4 | Small touch targets, clipped controls, incomplete chart semantics |
| Performance | 1/4 | Full-table client payloads, 15–20 second loads, expensive animated backgrounds |
| Theming | 2/4 | Strong tokens exist, but many pages and charts hard-code colors |
| Responsive design | 2/4 | No global horizontal overflow, but broken Enigma, clipped tabs, and excessive mobile document length |
| Anti-patterns | 2/4 | Repeated glass cards, glow-heavy pills, card-grid monotony, uncoordinated props |
| **Total** | **9/20** | **Poor: major repair required** |

Positive foundations to preserve include the orange/black palette, custom Neue Thing and Arctic Guardian typography, irreverent copy, recognizable illustrations, thermal score vocabulary, strong mobile stacking on most prose pages, and the recovered visualizer-lab selectors and evidence-rail concept.

## 4. Editorial and evidence model

### 4.1 Evidence classes

Every candidate receives an evidence class independent of its editorial tone:

| Code | Class | Publishing rule |
|---|---|---|
| `documented` | Official record, direct media, transcript, court record, filing, or strong multi-source reporting | Publish as observed fact with direct citations |
| `reported` | Reputable accountable outlet reporting a claim that is not independently proven | Attribute the claim in headline and description |
| `attributed_statement` | Verifiable words, post, gesture, joke, insult, or performance | Quote or closely paraphrase with date and venue |
| `allegation` | Named allegation, lawsuit, complaint, or accusation | State who alleges what and include the response or denial |
| `inference` | Reasoned interpretation of established facts | Label as analysis and state the mechanism and alternative explanation |
| `rumor` | Traceable gossip or hearsay with a public origin | Label prominently as rumor; never convert it into a factual assertion |
| `satire` | Editorial joke or deliberately comic framing | Satire may interpret facts but may not fabricate a person, quote, event, or outcome |

Every non-satirical claim must have at least one traceable source. A rumor sources its origin; it does not acquire credibility merely by being archived.

### 4.2 Source tiers

Sources are ranked without banning low-tier material:

1. Official records and primary material.
2. Independent wire services and accountable reporting.
3. Specialist, local, trade, or advocacy reporting with transparent authorship.
4. Entertainment and gossip publications.
5. Social posts, anonymous claims, Reddit threads, and aggregators.

Lower-tier sources remain eligible for etiquette, reaction, humor, and rumor entries, but their tier controls wording, confidence, and the ability to support causal or financial claims.

### 4.3 Three writing lengths

Each entry receives three authored layers:

- `description_short`: a card teaser of at most 180 characters. It can carry the sharpest joke.
- `description_medium`: 45–90 words for catalog cards and sharing. It states the conduct and immediate context.
- `description_long`: 140–300 words for the detail page. It separates observed facts, attribution, consequences, uncertainty, response, and satirical interpretation.

The title and short description may be savage. The long description must make it possible for a skeptical reader to reconstruct what is fact, report, allegation, inference, rumor, and joke.

### 4.4 Scope and causation

An entry does not require Trump to be the sole direct cause. It records a `causal_role`:

- `direct_action`
- `ordered_or_authorized`
- `appointed_or_enabled`
- `amplified_or_normalized`
- `policy_consequence`
- `foreseeable_indirect_effect`
- `temporal_association_only`
- `family_or_administration_actor`
- `commentary_or_reaction`

This field prevents indirect effects from being written as sole-cause claims while still allowing them into the archive.

## 5. Database design

The migration is additive and remains in Neon Postgres. A separate Neo4j or warehouse is unnecessary at the current scale.

### 5.1 New tables

- `trump_ingestion_runs`: trigger, requested window, query set, model, status, counts, timestamps, and resumable checkpoint.
- `trump_candidates`: staged entry content, editorial/evidence class, confidence, causal role, dedupe state, and review status.
- `trump_candidate_sources`: source metadata and captured claim snippets before promotion.
- `trump_entities`: people, offices, agencies, companies, countries, organizations, programs, laws, and places.
- `trump_entry_entities`: typed entry/entity roles such as actor, target, beneficiary, victim, implementer, critic, or location.
- `trump_relationships`: directional relations such as appointed, ordered, implemented, funded, profited-from, attacked, contradicted, married-to, or associated-with.
- `trump_score_revisions`: prior and replacement score sets, rubric version, model, rationale, evidence IDs, and timestamp. This is internal and is not a public “untrusted” flag.
- `trump_impact_estimates`: financial, health, institutional, environmental, casualty, time, and household estimates with units and confidence intervals.
- `trump_estimate_inputs`: formula inputs, source, retrieval date, unit, denominator, geography, and scenario.
- `trump_entry_descriptions`: short, medium, and long variants with tone/version metadata.
- `trump_embeddings`: entry and claim embeddings plus model/version for semantic deduplication and clustering.

### 5.2 Existing-table hardening

- Preserve `entry_number` as the public archive sequence but introduce a stable UUID internally.
- Assign `entry_number` only during approved promotion.
- Add canonical URL and URL hash uniqueness to sources.
- Add indexes for source and score joins, publication/event date, category, phase, review state, and entity relations.
- Add uniqueness to normalized keywords and relationships.
- Add the missing destination-entry foreign key and duplicate protection to entry links.
- Repair the `ai_complete_trump_data` rank to sort composite score descending.
- Remove ordering assumptions from the view and make ordering explicit in APIs.
- Add `pg_trgm` and `pgvector`; use exact URL/title checks before fuzzy and semantic matching.
- Replace the unauthenticated upload route with an authenticated, idempotent promotion endpoint that writes entry, scores, sources, keywords, descriptions, entities, relationships, and revisions in one transaction.

### 5.3 Analytical projections

The frontend will not download 4,175 full records for every analytical view. Server-side endpoints and materialized projections provide:

- archive summary metrics;
- time buckets;
- category, actor, source, phase, and evidence-class aggregates;
- score distributions and cross-dimension matrices;
- relationship-graph slices;
- narrative clusters;
- economic-estimate series;
- paginated evidence rows for the active selection.

Projections are refreshed after publication and cached with explicit invalidation by ingestion run ID.

## 6. Score reconstruction

### 6.1 Rubric

All eight dimensions use anchored 1–10 judgments:

- Danger: symbolic or individual effect through mass, systemic, or catastrophic risk.
- Authoritarianism: ordinary political conduct through coercion and institutional consolidation.
- Lawlessness: manners/ethics breach through credibly alleged, adjudicated, or openly unlawful conduct.
- Insanity: conventional conduct through erratic, incoherent, surreal, or self-defeating conduct. This is an editorial behavior score, not a diagnosis.
- Absurdity: mundane through historically farcical or grotesquely contradictory.
- Credibility risk: well-supported and consistent through unsupported, contradicted, fabricated, or rumor-dependent.
- Recency intensity: captured at scoring time for compatibility; current recency is derived dynamically in analytics.
- Impact scope: individual through local, national, multinational, or global consequence.

The public “Fucked-Up Score” uses rubric version 2:

```text
0.18 danger
+ 0.16 authoritarianism
+ 0.14 lawlessness
+ 0.14 impact scope
+ 0.12 credibility risk
+ 0.10 insanity
+ 0.08 absurdity
+ 0.08 recency intensity
```

Low-danger etiquette and insult entries remain valid: they can score low on danger and high on absurdity, insanity, credibility risk, or recency without being inflated into crimes.

### 6.2 Entries 2330–4034

- Recompute all 1,705 entries in deterministic batches.
- The model receives the title, all three descriptions when available, sources, dates, category, and evidence class.
- Output must pass a strict JSON schema and include dimension-by-dimension rationales.
- A second pass inspects discontinuities, identical repeated vectors, source/rationale mismatch, and category outliers.
- Approved replacement scores update the current score row atomically.
- Prior values are retained only in `trump_score_revisions` for rollback and audit. No public warning badge is added.

### 6.3 Entries 4185–4204

- Search for the original event, allegation, gossip item, or primary material behind every row.
- Add at least one traceable source and normalized keywords.
- Rewrite the title and three descriptions in the half-scientific, half-satirical voice.
- Assign evidence class, source tier, causal role, actors, targets, and relationships.
- Recompute all scores with rationales.
- If an item has only a rumor origin, retain it as a labeled rumor rather than laundering it into fact.
- If no public origin can be found at all, keep it in the candidate review queue rather than publishing an invented source.

## 7. Current-period research and publication

### 7.1 Window

- Primary new-event window: 2026-07-03 through 2026-08-02, because the database's latest event date is 2026-07-02.
- Overlap/repair window: 2026-05-24 through 2026-07-02, used to repair entries 4185–4204 and catch omissions without duplicating already published rows.
- Dedupe always compares against the entire archive.

### 7.2 Search lanes

Every run covers:

- official actions, litigation, enforcement, firings, appointments, and policy;
- war decisions, rhetoric, casualties, concealment, displacement, Lebanon effects, energy and shipping effects, and diplomatic reversals;
- economy, tariffs, inflation, employment, deficits, consumer confidence, household costs, and conflicts of interest;
- Trump-family money, crypto, businesses, lawsuits, public conduct, and influence;
- administration figures and agencies;
- speeches, interviews, Truth Social, jokes, insults, gaffes, protocol breaches, appearance criticism, and audience reaction;
- reputable entertainment reporting, gossip publications, social media, and Reddit for lower-tier candidate discovery;
- fact checks and contradiction tracking;
- counterarguments, denials, reversals, and later corrections.

### 7.3 Current candidate slate

The completed pilot already identified distinct candidates involving:

- renewed Iran-war threats, ceasefire declarations and reversals, and threatened energy-infrastructure attacks;
- the Iran war's connection to renewed fighting and casualties in Lebanon;
- removal of four U.S. troop deaths from the publicly described Iran-war toll;
- the insult-heavy White House Correspondents' Dinner speech, criticism of a female reporter's smile, a transgender comparison, attacks on the press, attacks on his own speechwriters, and third/fourth-term jokes;
- unsupported election-security assertions and pressure around mail voting;
- Election Assistance Commission removals;
- law-firm and journalist subpoenas;
- immigration detention, deportation, enforcement-death, and disputed-DHS-account cases;
- administration cancellation of clean-energy grants according to states' political identity;
- RFK Jr. and Pete Hegseth conduct and policy controversies;
- Trump-family crypto income, retail-investor losses, conflicts, and Melania-linked memecoin criticism;
- Melania's legal campaign against Epstein-related allegations and the public gossip surrounding it;
- tariffs, tariff refunds, new import taxes, inflation, gas prices, consumer confidence, mortgage rates, and slower-than-expected growth.

This is a starting slate, not the final count. Candidate generation remains deliberately broad; publication wording is controlled by evidence class.

## 8. Site-wide visual system

### 8.1 Brand position

Preserve the existing identity: near-black surfaces, thermal orange/red accents, custom Neue Thing body type, Arctic Guardian display type, irreverent illustrations, and the “built with spite and data” voice. The redesign should feel like a hostile evidence terminal crossed with a bootleg political arcade cabinet, not a generic SaaS dashboard or monochrome magazine.

The site surface is brand-led; analytical controls use a quieter product register.

### 8.2 Shared controls

Create one coherent component vocabulary:

- `ActionButton`
- `IconButton`
- `ControlPill`
- `SearchField`
- `FilterBar`
- `SegmentedControl`
- `DataTabs`
- `EvidenceClassBadge`
- `ConfidenceBadge`
- `MetricLabel`
- `DataPanel`
- `EmptyState`
- `SkeletonState`

Every interactive component supports default, hover, focus-visible, active, disabled, loading, and error states. Touch targets are at least 44-by-44px. Controls use 150–250ms state motion and respect reduced-motion preferences.

### 8.3 Spoke and prop field

Replace fixed viewport decoration arrays with a deterministic `PropField` system:

- Seed positions by route and section so server and client render identically.
- Anchor props to document sections, not the fixed viewport.
- Use all spoke/ASCII-Jack variants and supporting stars/Xs with varied scale, rotation, opacity, blur, and depth.
- Mix small distant props, medium edge props, and occasional large cropped props.
- Maintain content exclusion zones and minimum inter-prop spacing.
- Use fewer and smaller props on mobile.
- Allow only subtle parallax or drift; no perpetual distracting motion.
- Freeze motion under `prefers-reduced-motion`.
- Ensure decorations never change document dimensions or create horizontal scrolling.

The result should read like a star field distributed through the page, not several nearly identical PNGs stacked around the center.

### 8.4 Route repairs

- Home: retain the mission and personality, reduce mobile hero clutter, eliminate hydration error, and reconcile counts and dates.
- Catalog: use server pagination or cursor loading, expose entry number separately from rank, add compact sticky filters, improve search, and virtualize or paginate long lists.
- Entry detail: add source/evidence/claim-status panels, actor and relationship links, score rationale, and related entries.
- WTF: preserve its voice and artifacts but break repetitive card rhythm with exhibits, pull quotes, mini diagrams, and linked evidence.
- Enigma: replace the empty vertical timeline with a responsive event spine, era overview, range controls, and meaningful cards.
- Donate/WHOAMI: repair profile-card clipping, align payment controls, and preserve the personal frontier narrative.
- Footer/navigation: remove stale counts, fix analytics deployment mismatch, use consistent control geometry, and make all links/controls accessible.

## 9. Visualizer and insight-mining design

### 9.1 Information architecture

The visualizer is not one endless dashboard. It becomes a family of linked analytical stories:

- `/visualizer`: Current Briefing — major changes, unusual clusters, and evidence-linked takeaways.
- `/visualizer/timeline`: Timeline — events, rhetoric, policy, war, legal action, and corrections by day/month/era.
- `/visualizer/people`: People and Power — family, appointees, agencies, targets, implementers, and beneficiaries.
- `/visualizer/money`: Money and Cost — corruption, private gain, public expenditure, household cost, and scenario ranges.
- `/visualizer/rhetoric`: Rhetoric and Themes — insults, lies, recurring phrases, target groups, contradictions, and narrative change.
- `/visualizer/relationships`: Relationship Explorer — directional actor/event/organization graph.
- `/visualizer/methodology`: Methodology — data contracts, formulas, model versions, limitations, and counterarguments.

Each route is deep-linkable and retains shared filters without forcing every chart into one viewport.

### 9.2 Visualization vocabulary

Use visual forms because they answer distinct questions, not merely for variety:

- annotated timelines and lane charts;
- actor/category matrices;
- beeswarms, violin plots, and score distributions;
- chord or Sankey diagrams for actor-to-action flows;
- WebGL relationship graph for thousands of nodes and edges;
- alluvial flows for category/phase/evidence changes;
- calendar heatmaps and day-level war/activity bands;
- small multiples for administrations, actors, and eras;
- lexical constellation and term-shift views rather than a decorative random word cloud;
- proportional-symbol and waterfall charts for financial estimates;
- evidence funnels showing claim, reporting, corroboration, contradiction, and resolution;
- plain-language exhibits when a chart would add no value.

ECharts 6 handles dense standard charts and matrix/chord/beeswarm forms. D3 handles bespoke data stories and annotations. Sigma.js plus Graphology handles the relationship graph. Framer Motion or GSAP handles purposeful transitions. Recharts remains only where an existing view is stable and accessible.

### 9.3 Insight generation

Insights are derived from reproducible selectors and evidence IDs before AI writes prose:

1. SQL/materialized projection computes the metric or pattern.
2. An analysis record stores method, filters, sample size, uncertainty, and supporting entry IDs.
3. Deterministic rules identify leaders, changes, outliers, clusters, co-occurrences, and possible breaks.
4. AI writes short and long explanations from that bounded record.
5. The interface shows “what this shows,” “why it matters,” “method,” “sources,” “limitations,” and “what would change the conclusion.”

No insight may cite an entry or source not present in its evidence payload.

### 9.4 Relationship intelligence

The relational model enables questions that the current entry table cannot answer:

- Which appointees repeatedly implement Trump's directives?
- Which family members or businesses profit near policy decisions?
- Which targets recur across rhetoric, legal pressure, and enforcement?
- Which people co-occur across corruption, war, immigration, media pressure, and crypto?
- What causal chains connect a statement to an agency action and measurable consequence?
- Which denials or corrections attach to earlier claims?

At 4,175 entries, recursive Postgres queries and materialized graph projections are sufficient. A separate graph database is deferred until query complexity or graph size proves the need.

## 10. Economic and public-cost estimates

### 10.1 Estimate classes

Financial claims are separated into:

- `observed_cost`: appropriations, refunds, settlements, documented business losses, or directly measured price changes.
- `attributable_estimate`: a sourced model with an explicit causal mechanism and uncertainty range.
- `counterfactual_scenario`: the difference between observed data and a named alternative baseline.
- `illustrative_conversion`: per-person, per-household, or per-day rendering of another estimate.

### 10.2 Formula contract

Every estimate stores:

- formula and version;
- numerator and denominator;
- nominal/real currency and base year;
- geography and population;
- start/end dates;
- base, low, and high scenario;
- source for every input;
- exclusions and likely double-counting;
- confidence and sensitivity notes;
- responsible policy/action/actor links.

Example display:

```text
Estimated household tariff burden per day
= modeled annual consumer tariff incidence
÷ U.S. households
÷ 365
```

The interface must display the input year, pass-through assumption, range, and source next to the number. It must not claim a counterfactual is an observed invoice.

### 10.3 Data sources and safeguards

Preferred sources include BEA, BLS, CBO, Treasury, OMB, Federal Reserve/FRED, Census, EIA, AAA, GAO, DoD appropriations, court records, company filings, and peer-reviewed or clearly documented economic studies.

The system must not sum overlapping estimates into a theatrical mega-total. A cost meter can sum only additive records from the same accounting boundary, period, units, and scenario.

## 11. Codex-assisted update switch

The correct solution is both a deterministic script and a Codex workflow.

### 11.1 Deterministic repository commands

- `npm run archive:discover -- --since last-success`: collect feeds/search results and create a run manifest.
- `npm run archive:dedupe -- --run <id>`: exact URL, canonical title, entity/date, trigram, and embedding checks.
- `npm run archive:validate -- --run <id>`: schema, source reachability, parity, and score checks.
- `npm run archive:publish -- --run <id>`: authenticated atomic promotion after approval.
- `npm run archive:status -- --run <id>`: checkpoint and resume information.

Scripts handle deterministic work; they do not invent descriptions or scores.

### 11.2 Codex reasoning workflow

A project-owned update prompt/skill tells Codex to:

1. inspect the last successful run and checkpoint;
2. run broad search lanes;
3. classify evidence, source tier, causation, actors, and relationships;
4. deduplicate semantically;
5. write all three description lengths in the approved voice;
6. score with rubric version 2 and rationales;
7. surface candidates, rumor labels, conflicts, and source failures for review;
8. publish only approved candidates;
9. verify production and save a Mem0 checkpoint.

This keeps AI reasoning inside Codex while keeping collection, validation, transactions, and rollback in testable repository code.

### 11.3 Trigger options

- Manual local switch: run the project command from this Codex task.
- Scheduled local heartbeat: wake the same Codex task weekly and perform discovery/review preparation only.
- Phone trigger: later call an authenticated Cloudflare Workflow or GitHub `workflow_dispatch` endpoint that creates a candidate run, then review it in Codex.

The recommended first release is the manual switch plus a weekly Codex heartbeat. Cloudflare durable execution follows after the schema and promotion endpoint have proven reliable.

## 12. Failure handling and safety

- Discovery is idempotent and resumable by ingestion run ID.
- Source errors create candidate warnings; they do not cause partial publication.
- AI output is schema-validated and rejected rather than silently coerced.
- Promotion occurs in one database transaction.
- A failed parity check rolls back the promotion.
- Every score change and entry rewrite retains a private revision record.
- Secrets are loaded from environment/profile configuration and never embedded in scripts or Mem0.
- The live credential found in untracked scripts is rotated before any automation work.
- Production deletes are not part of this design. Unsupported drafts remain staged until resolved.
- Current untracked user files are preserved unless the user explicitly approves their removal after credential rotation.

## 13. Verification contract

### Data

- Every published entry has descriptions, current score, rationale, source, keywords, evidence class, causal role, and review record.
- Zero missing parity across entries, scores, sources, keywords, and descriptions.
- No duplicate canonical URLs or duplicate candidate promotions.
- All current scores are in range and match the active composite formula.
- Entries 2330–4034 have rubric-v2 revisions without public warning labels.
- Entries 4185–4204 are sourced and rewritten or remain explicitly staged.

### Frontend

- No console errors, hydration errors, failed analytics requests, or uncaught API failures.
- Tested at 390×844, 768×1024, 1366×768, and 1440×1000.
- No horizontal overflow.
- Interactive targets are at least 44×44px.
- Keyboard navigation and visible focus work throughout.
- Reduced motion preserves all content.
- Full-page screenshots cover every public route.
- Spoke props do not collide with controls or cluster in the page center.
- Catalog and briefing content becomes usable without a 15–20 second wait.

### Visualizer

- Every visual has a plain-language explanation, method, source/evidence rail, limitations, and empty/error/loading state.
- Metrics are reproduced by database queries or selector tests.
- Economic figures expose formula, denominator, time window, scenario, and uncertainty.
- Relationship graph edges link back to source entries.
- Mobile routes do not rely on clipped horizontal tabs.

### Automation

- Dry-run, resume, duplicate-run, source-failure, invalid-AI-output, rejected-review, approved-publish, rollback, and production-verification flows are tested.
- Scheduled discovery cannot publish without an approval event.
- Final completion writes Mem0 checkpoint and project-state records.

## 14. Implementation sequence

1. Rotate the exposed credential and disable the unauthenticated write path.
2. Create a Neon safety branch and apply the additive schema migration there.
3. Build deterministic candidate, source, dedupe, validation, and promotion contracts.
4. Repair entries 4185–4204 and reconstruct scores 2330–4034 in reviewed batches.
5. Research and publish the 2026-07-03 through 2026-08-02 update with the overlap audit.
6. Build the shared visual controls and document-anchored `PropField`.
7. Repair each existing route and its responsive behavior.
8. Replace the current visualizer with the linked analytical-story architecture, reusing the strongest recovered lab selectors.
9. Add relationship and economic-estimate views.
10. Add the repository commands and Codex update prompt/skill.
11. Create the weekly discovery heartbeat only after end-to-end dry runs pass.
12. Build, test, screenshot, verify production, and checkpoint in Mem0.

## 15. Explicit non-goals

- No separate graph database in the first implementation.
- No public “untrusted” badge on legacy scores.
- No claim that rumor is fact or that satire is evidence.
- No autonomous scheduled production publication.
- No single unexplained “Trump cost” number.
- No redesign into a generic one-screen dashboard.
- No deletion of unrelated user work or untracked files.
- No push or production deployment without explicit authorization at the relevant implementation stage.
