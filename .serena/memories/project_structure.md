# Project Structure - The Trump Files

## Directory Layout

```
trumpfiles.fun-warp/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── catalog-data/
│   │   ├── visualizer-data/
│   │   ├── entry/[entry_number]/
│   │   ├── user-vote/
│   │   ├── comments/
│   │   └── send-email/
│   ├── catalog/           # Catalog page
│   ├── visualizer/        # Data visualizer page
│   ├── wtf/               # About/FAQ page
│   ├── entry/             # Entry detail pages
│   │   └── [entry_number]/
│   ├── enigma/            # Biographical timeline page
│   ├── admin/             # Admin panel (protected)
│   ├── page.tsx           # Homepage
│   ├── layout.tsx         # Root layout
│   ├── globals.css        # Global styles
│   └── fonts.ts           # Font definitions
│
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── TrumpFilesBrand.tsx
│   ├── OrangeHero.tsx    # 3D model component
│   ├── Navigation.tsx
│   ├── AsciiFooter.tsx
│   └── FlippableEntryCard.tsx
│
├── lib/                   # Utility functions
│   ├── utils.ts          # cn() and helpers
│   ├── db.ts             # Database client
│   └── neonClient.ts     # Neon connection
│
├── types/                 # TypeScript types
│   └── database.ts       # Database interfaces
│
├── public/                # Static assets
│   ├── fonts/            # Custom fonts
│   ├── orange_hero.glb   # 3D model
│   └── images/           # Image assets
│
├── .serena/               # Serena MCP memory files
├── .playwright-mcp/      # Playwright screenshots
│
├── PROJECT_JOURNAL.md     # Development log (THE BIBLE)
├── MEGA_PROMPT_REBUILD.md # Complete rebuild guide
├── VIBE_CODING_MEGA_PROMPT.md # Alternative rebuild guide
├── SESSION_3_COMPLETE.md  # Latest session summary
│
├── package.json
├── tsconfig.json
├── components.json        # shadcn config
├── tailwind.config.ts
└── .env.local            # Environment variables (gitignored)
```

## Key Files

### Pages (app/)
- `app/page.tsx` - Homepage with hero, features, mission
- `app/catalog/page.tsx` - Entry catalog with filters/pagination
- `app/visualizer/page.tsx` - Data visualization dashboard
- `app/wtf/page.tsx` - About page with project info
- `app/entry/[entry_number]/page.tsx` - Individual entry details
- `app/enigma/page.tsx` - Biographical timeline

### Components
- `components/TrumpFilesBrand.tsx` - Standardized brand component
- `components/OrangeHero.tsx` - 3D model with React Three Fiber
- `components/Navigation.tsx` - Global navigation bar
- `components/FlippableEntryCard.tsx` - Flip cards with voting

### API Routes
- `app/api/catalog-data/route.ts` - Fetch all entries
- `app/api/visualizer-data/route.ts` - Chart data
- `app/api/entry/[entry_number]/route.ts` - Single entry
- `app/api/user-vote/route.ts` - Voting system
- `app/api/comments/route.ts` - Comments system

### Configuration
- `tsconfig.json` - TypeScript config (strict mode)
- `components.json` - shadcn/ui configuration
- `.env.local` - Database and API keys

## Database Schema Reference

**Primary View**: `ai_complete_trump_data`
- Entry fields: entry_number, title, synopsis, category, phase
- Scoring: danger, authoritarianism, lawlessness, insanity, absurdity, etc.
- Metadata: dates, duration, keywords, rationale
- ~775 entries total

## Component Conventions

- **Client Components**: Must have `"use client"` directive
- **Server Components**: Default (no directive needed)
- **Dynamic Imports**: Used for 3D models, heavy libraries
- **MagicUI Components**: From `@/components/ui/` directory

## Import Paths

All imports use `@/` alias:
- `@/components` - Component directory
- `@/lib` - Utilities
- `@/types` - Type definitions
- `@/app` - App directory (for relative imports)
