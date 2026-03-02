# AGENTS.md

## Cursor Cloud specific instructions

### Overview
The Trump Files is a single Next.js 15 (App Router) application — not a monorepo. It serves a political accountability catalog with 1135+ documented entries stored in a hosted Neon PostgreSQL database.

### Services
| Service | How to run | Notes |
|---|---|---|
| Next.js dev server | `npm run dev` (port 3000) | The only service to run. Serves frontend + API routes. |
| Neon PostgreSQL | External SaaS | Requires `DATABASE_URL` secret. App is non-functional without it. |

### Required secrets
- `DATABASE_URL` — Neon PostgreSQL connection string (required; app crashes without it)
- `RESEND_API_KEY` — Optional, only for contact form email

### Standard commands
See `package.json` scripts:
- **Dev server:** `npm run dev`
- **Lint:** `npm run lint` (ESLint 9; all rules are warnings, exit code 0 expected)
- **Build:** `npm run build`
- **Start (prod):** `npm run start`

### Gotchas
- `next.config.ts` contains a hardcoded macOS `turbopack.root` path (`/Users/joeyq/Desktop/...`). This does not break `npm run dev` because the default dev mode does not use turbopack with that config in a problematic way. However, if turbopack is explicitly enabled, this path will cause issues. Do not modify it per repo convention.
- The `scripts/` directory contains 40+ TypeScript/JS data-utility scripts for database operations — these are **not** setup scripts.
- Chat/AI features (OpenAI, Anthropic, Serper) are gitignored and not present in the repo. Do not attempt to configure them.
- No Docker, no local database, no migrations. The database is fully managed via Neon SaaS.
