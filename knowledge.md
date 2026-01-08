# The Trump Files - Project Knowledge

## Project Overview
The Trump Files is a comprehensive database and visualization platform documenting Trump-related events, categorized and scored across multiple dimensions (danger, authoritarianism, lawlessness, insanity, absurdity).

## Tech Stack
- **Framework:** Next.js 15 (App Router)
- **Database:** Neon PostgreSQL (~700 entries)
- **Styling:** Tailwind CSS + custom Arctic Guardian fonts
- **UI Components:** shadcn/ui + Magic UI
- **3D Graphics:** React Three Fiber (@react-three/fiber, @react-three/drei)
- **Animations:** Framer Motion

## Branding Guidelines
- **Primary Color:** Orange gradient (from-orange-500 via-orange-400 to-red-500)
- **Title Font:** Arctic Guardian (3 variants: grad, laser-italic, 3d)
- **Body Font:** Epilogue
- **"THE TRUMP FILES" Styling:** 
  - THE = font-arctic-grad
  - TRUMP = font-arctic-laser italic
  - FILES = font-arctic-3d
  - All with orange gradient background

## Database Schema
- **Primary View:** `ai_complete_trump_data` (~700 entries)
- **Key Fields:** entry_number, title, synopsis, category, phase, scoring dimensions
- **Connection:** Neon PostgreSQL pooler (DATABASE_URL)

## Site Structure
- `/` - Homepage with 3D orange model hero
- `/catalog` - Searchable grid of all entries with collapsible filters
- `/visualizer` - Data visualization dashboard with scatter plots
- `/entry/[entry_number]` - Individual entry detail pages
- `/wtf` - About/mission page
- `/admin` - Admin dashboard

## Development Commands
- `npm run dev` - Start development server (port 3000)
- `npm run build` - Production build
- `npm run typecheck` - TypeScript validation

## Key Components
- **TrumpFilesBrand** - Standardized 3-font logo component
- **OrangeHero** - 3D model component (React Three Fiber)
- **Navigation** - Site-wide navigation with active states
- **FlippableEntryCard** - Catalog entry cards with animations

## Important Notes
- All Arctic Guardian text should use orange gradient
- Hero section must fit in one viewport
- Supabase fully removed - use Neon exclusively
- All scoring fields use plain names (danger, not danger_score)
- Date fields are date_start/date_end (not date_occurred)
