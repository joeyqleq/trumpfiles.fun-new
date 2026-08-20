# Trumpstein Orchestrator Checkpoint

Date: 2026-08-20  
Branch: `main`  
Base HEAD: `8bb73387b754b5de692fa14455d7022a39b4f776`  
Status: paused for Codex quota contingency; dirty worktree intentionally preserved

## Authoritative context

Read these completely before resuming:

1. `docs/TRUMPSTEIN_MASTER_OVERHAUL_HANDOFF_2026-08-20.md`
2. `docs/TRUMPSTEIN_RATHBONE_WORLD_CANON_2026-08-20.md`

Use Mem0 with `user_id=trumpfiles.fun-new`, `app_id=joeyqleq-trumpfiles.fun-new`, and `agent_id` matching the active tool. The latest final-verification and GitHub-backfill memories were written on 2026-08-20.

## Completed locally

- Frontend/brand work: global typography and metadata, navigation/Enigma polish, Trumpstein page and chat art/SVG treatment, actual kippah-based OG image, responsive catalogue control/card improvements, and evidence-labelled Insights content.
- Network: removed hardcoded Neo4j connection fallbacks; added safe Neon archive-tag fallback, diversified co-occurrence graph, person dossier links, healthy Neo4j path support, fallback path explanation, draft/applied URL-backed filters, responsive controls, retry state, and evidence-safe language.
- Trumpstein Worker: layered deterministic routing, bounded conversation/session state, delayed Rathbone Stage 0-3 fictional canon, selective cast and reality boundary, compact assistant-created fictional continuity, deeper RAG candidate retrieval/reranking/provenance handling, and offline verification suites.
- Data foundations: source-backfill predicate fix plus seven fixtures; normalized enrichment contract, phase normalization, quality gate, legacy adapter, and dry-run chunk planner. No live enrichment/backfill execution or schema migration occurred.
- Insights: methodology/scope labelling; source-linked Gallup, Yale Budget Lab, CRS/State, EPA and DOJ baselines; unsupported causal/legal certainty softened; no fake donor/taxpayer denominator or blackmail probability.

## Current changed files

Tracked modifications:

- `.gitignore`
- `app/api/network/route.ts`
- `app/catalog/CatalogClient.tsx`
- `app/enigma/page.tsx`
- `app/globals.css`
- `app/insights/InsightsClient.tsx`
- `app/insights/page.tsx`
- `app/layout.tsx`
- `app/network/page.tsx`
- `app/opengraph-image.tsx`
- `app/trumpstein/page.tsx`
- `components/FlippableEntryCard.tsx`
- `components/Kippah.tsx`
- `components/Navigation.tsx`
- `components/TrumpsteinChat.tsx`
- `lib/fonts.ts`
- `scripts/auto-update.mjs`
- `scripts/backfill-sources-auto.mjs`
- `workers/trumpstein/package.json`
- `workers/trumpstein/src/index.ts`
- `workers/trumpstein/src/rag.ts`

Untracked additions:

- `scripts/backfill-sources-state.mjs`
- `scripts/backfill-sources-state.test.mjs`
- `scripts/enrichment-chunk.mjs`
- `scripts/enrichment-contract.mjs`
- `scripts/enrichment-contract.test.mjs`
- `workers/trumpstein/scripts/verify-rathbone.mjs`
- `workers/trumpstein/src/rathbone.ts`
- `workers/trumpstein/src/routing.ts`
- `workers/trumpstein/src/session-state.ts`
- `workers/trumpstein/src/verify-rag.ts`
- `workers/trumpstein/src/verify-rathbone-continuity.ts`
- `workers/trumpstein/src/verify-routing.ts`

Root `package.json`, `package-lock.json`, `eslint.config.mjs`, `.github/workflows/*`, Wrangler/Cloudflare config, and the flat `/api/entry/[entry_number]` route contract are unchanged. Worker `package.json` adds verifier scripts only; no dependency was added. No login/auth, fake catalogue votes, fabricated sources, GitHub Actions change, Cloudflare binding change, schema write, push, deployment, or workflow rerun was performed.

## Final local verification evidence

- `npm run build`: PASS on Next.js 16.2.10; compile 2.3 minutes, production TypeScript 116 seconds, page data 4.3 seconds, 28/28 static pages.
- `npx tsc --noEmit --pretty false`: PASS.
- Worker TypeScript: PASS.
- Worker verifiers `verify:routing`, `verify:rathbone`, `verify:rag`, and `verify:rathbone-continuity`: PASS.
- Source-backfill state fixtures: 7/7 PASS.
- Combined source/enrichment fixtures: 12/12 PASS in the earlier gate.
- `git diff --check`: PASS.
- Root lint: exit 0 with 199 warnings and no errors; warnings are mostly existing React/any/unused/image rules.

Built-browser checks on `http://127.0.0.1:3137`:

- Network default fallback: 39 nodes / 41 edges.
- Network `minDanger=8`: 45 nodes / 54 edges; Apply/Clear URL and active-filter state correct.
- Network Path in fallback: explicit unsupported explanation and disabled Path button; no invented route.
- Network mobile at 390x844: document width 390, no horizontal overflow, primary controls 44px.
- OG image: valid complete 1200x630 PNG with actual Trumpstein kippah art.
- Insights approval, tariffs, and `overview/recent`: HTTP 200, direct-link URL preserved, no Next crash.
- All 25 valid Insights section/view pairs passed the earlier route audit; bad query values fall back safely.
- Only expected local Vercel Analytics `/_vercel/insights/script.js` 404 remained.

## GitHub backfill failure diagnosis

Scheduled run `32326775603` (`Backfill Entry Sources (Exa)`) failed on 2026-08-20 at 03:02Z / 06:02 Beirut, commit `ade944739af8127bf4e4661f8425d117e92edb74`.

Exact failure: `NeonDbError: cannot get array length of a non-array`, PostgreSQL code `22023`, from unguarded `jsonb_array_length(sources)` in the initial eligibility SELECT. It failed before Exa processing or writes. The current local fix guards every array-length call with `jsonb_typeof(sources) = 'array'` and aligns SQL NULL, JSON null, legacy `[]`, fresh skip, expired skip, accepted source, and rejected marker behavior. Do not rerun until this fix reaches `main`.

## Interrupted delegates

Quota warning interrupted three read-only/local delegates immediately:

- GLM routing/bakeoff foundation
- resumable enrichment job ledger foundation
- remaining-gap acceptance audit

They made no additional visible worktree changes before interruption. Reassign these tasks rather than assuming completion.

## Remaining work

1. Review this dirty diff once more and create small scoped commits; preserve unrelated/user work. Do not stage with `git add .` or `git add -A`.
2. Finish a provider-backed GLM-5.2 routing/bakeoff only after confirming a real configured provider/model endpoint. Keep the current Cloudflare model as deterministic fallback; never invent credentials or claim a live bakeoff from offline tests.
3. Add a durable resumable enrichment job ledger, then perform staged test-mode/sample validation. Live ~7K enrichment and source backfill are external writes and require explicit production gating, coverage measurement, and rollback/checkpoint evidence.
4. Reingest/verify Vectorize provenance metadata, deploy the Worker separately if authorized, and run the long live conversational/Rathbone/reality-boundary evaluation. Offline verifiers are not a substitute for live model behavior.
5. After authorized push/deploy: verify GitHub backfill success, Worker `/chat`, Vercel production pages, Insights routes, Network healthy/fallback behavior, mobile layouts, OG/social preview, and production console/network logs.

## Resume command sequence

```bash
git status --short
git log --oneline --decorate -10
git diff --check
npm run build
npx tsc --noEmit --pretty false
cd workers/trumpstein && npm run verify:routing && npm run verify:rathbone && npm run verify:rag && npm run verify:rathbone-continuity && npx tsc --noEmit
```

Do not claim the full master overhaul complete until the live enrichment/backfill, GLM/provider bakeoff, Vectorize/Worker deployment, long chat evaluation, and production smoke tests are actually executed and evidenced.
