# The Trump Files - PRD

## Problem Statement
thetrumpfiles.fun is a Next.js website hosted on Vercel that catalogs documented Trump incidents from a Neon PostgreSQL DB. The dev configuration had hard-limited data fetching to 1,000 entries to reduce local dev server lag, but this limit leaked into the production deployment. The homepage hero/footer correctly showed dynamic count (2,295) but the catalog and visualizer pages displayed hardcoded 1,000.

## Architecture
- **Framework**: Next.js 15 (App Router)
- **Database**: Neon PostgreSQL (serverless)
- **Hosting**: Vercel
- **UI**: Tailwind CSS 4, Radix UI, Recharts, Framer Motion, Three.js
- **Fonts**: Arctic Guardian (display), Neuething (body text)

## Core Requirements (Static)
1. All entry counts across the site must be dynamically sourced from the live Neon DB
2. No hardcoded limits on production data fetching
3. Catalog page should support search, filter, sort, and pagination
4. Visualizer page should compute charts/graphs against ALL entries in the DB
5. Frontend must remain performant with 2,000+ entries

## What's Been Implemented (Jan 2026)
- **Fixed hardcoded 1,000 limit**: Catalog and Visualizer pages now fetch data client-side from API routes (`/api/catalog-data` and `/api/visualizer-data`) which have a 10,000 production limit
- **Dynamic counts**: Subtitle text and summary cards show real DB count via `getEntryStats()` 
- **Removed "ARCHIVE SEARCH & FILTERS"**: GlitchText title removed from catalog search box
- **Card title font changed**: From arctic-guardian-grad to neuething bold for readability
- **Pagination maintained**: 50 entries per page with client-side filtering/sorting
- **Build verified**: Next.js build passes successfully

## Files Modified
1. `app/catalog/page.tsx` - Removed server-side entry fetching, passes only totalCount
2. `app/catalog/CatalogClient.tsx` - Client-side API fetch, dynamic counts, removed GlitchText
3. `app/visualizer/page.tsx` - Removed server-side entry fetching, passes only totalCount
4. `app/visualizer/VisualizerClient.tsx` - Client-side API fetch, dynamic counts
5. `components/FlippableEntryCard.tsx` - Card title font changed to neuething
6. `lib/entries.ts` - Updated getAllEntries() comment and limit (no longer used by pages)

## User Personas
- General public interested in Trump accountability
- Researchers and journalists needing data-driven analysis
- Site creator managing content via Neon DB + Codex workflows

## Backlog
- P0: None
- P1: Server-side pagination API for catalog (offset/limit query params) for better SEO
- P2: Loading skeleton states for charts in visualizer
- P2: Entry detail page count verification
- P3: Search optimization with debounce for large datasets

## Next Tasks
- Pull changes to local machine and push to GitHub for Vercel deployment
- Verify live deployment shows correct counts (2,295+)
- Continue Codex workflow for adding new entries
