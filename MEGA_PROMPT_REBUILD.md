# THE TRUMP FILES - Complete Rebuild Prompt

You are building "The Trump Files" - a Next.js 16 website that serves as a comprehensive, data-driven encyclopedia cataloging controversial moments and actions of the 45th U.S. President. This is a dark-themed, modern web application with orange branding, advanced data visualization, and AI-powered content analysis.

## TECH STACK & SETUP

**Framework:** Next.js 16 (App Router, TypeScript, React 19)
**Database:** Neon PostgreSQL (serverless)
**Styling:** Tailwind CSS v4
**UI Components:** shadcn/ui + Magic UI + Aceternity UI
**Animations:** Framer Motion
**3D Graphics:** React Three Fiber
**Data Visualization:** D3.js + Recharts
**Authentication:** Clerk
**Fonts:** Custom Arctic Guardian (multiple variants) + Epilogue

### Installation Commands:
```bash
npx create-next-app@latest trumpfiles.fun-warp --typescript --tailwind --app --no-src-dir
cd trumpfiles.fun-warp

npm install @neondatabase/serverless @clerk/nextjs framer-motion motion
npm install @react-three/fiber @react-three/drei three @types/three
npm install d3 @types/d3 recharts
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-label
npm install @radix-ui/react-navigation-menu @radix-ui/react-select @radix-ui/react-separator
npm install @radix-ui/react-slider @radix-ui/react-slot @radix-ui/react-switch
npm install @radix-ui/react-tabs @radix-ui/react-tooltip @tanstack/react-table
npm install lucide-react class-variance-authority clsx tailwind-merge
npm install pg resend zod react-hook-form @hookform/resolvers
```

## DIRECTORY STRUCTURE

```
trumpfiles.fun-warp/
├── app/
│   ├── api/
│   │   ├── catalog-data/route.ts
│   │   ├── visualizer-data/route.ts
│   │   ├── entry/[entry_number]/route.ts
│   │   └── send-email/route.ts
│   ├── catalog/page.tsx
│   ├── visualizer/page.tsx
│   ├── wtf/page.tsx
│   ├── entry/[entry_number]/page.tsx
│   ├── admin/page.tsx
│   ├── page.tsx
│   ├── layout.tsx
│   ├── globals.css
│   └── fonts.ts
├── components/
│   ├── ui/ (shadcn components)
│   ├── OrangeHero.tsx
│   ├── TrumpFilesBrand.tsx
│   └── Navigation.tsx
├── types/
│   └── database.ts
├── lib/
│   └── utils.ts
├── public/
│   ├── fonts/arctic-guardian/ (multiple variants)
│   ├── orange_hero.glb
│   └── logos/trumpfiles_orange_logo.png
├── .env.local (DATABASE_URL, CLERK keys)
├── components.json
├── tailwind.config.ts
└── tsconfig.json
```

## DATABASE SCHEMA (Neon PostgreSQL)

**Primary View:** `ai_complete_trump_data` (~775 entries)

**Fields:**
- entry_number (number)
- title (string)
- synopsis (string)
- category (string)
- subcategory (string | null)
- phase (string)
- age (number | null)
- start_year (number | null)
- date_start (string | null)
- date_end (string | null)
- duration_days (number | null)
- fucked_up_score (string) - composite score
- fucked_up_rank (string) - ranking
- danger (number 0-10)
- authoritarianism (number 0-10)
- lawlessness (number 0-10)
- insanity (number 0-10)
- absurdity (number 0-10)
- credibility_risk (number 0-10)
- recency_intensity (number 0-10)
- impact_scope (number 0-10)
- rationale_short (string) - AI analysis
- all_keywords (string array)

**Connection:** Use `@neondatabase/serverless` with DATABASE_URL from .env.local

## BRANDING & DESIGN SYSTEM

### Colors:
**Primary Brand:** Orange Gradient
```
from-orange-500 via-orange-400 to-red-500
```

**Background:** Dark theme with subtle gradients
```
bg-gradient-to-br from-orange-500/10 via-background to-purple-500/10
```

**Glass Effect:**
```
backdrop-blur-lg bg-white/10 border border-white/20
```

### Typography:
**Headings:** Arctic Guardian font family (7 variants)
- font-arctic-grad
- font-arctic-gradient-italic  
- font-arctic-3d
- font-arctic-laser
- font-arctic-half
- font-arctic-twotone
- font-arctic-left

**Body Text:** Epilogue (sans-serif)

**CRITICAL RULE:** ALL Arctic Guardian text MUST use orange gradient:
```
bg-gradient-to-r from-orange-500 via-orange-400 to-red-500 bg-clip-text text-transparent
```

### "THE TRUMP FILES" Standard:
ALWAYS display as 3-word combo with different fonts:
```tsx
<span className="font-arctic-grad [ORANGE_GRADIENT]">THE</span>
<span className="font-arctic-laser italic [ORANGE_GRADIENT]">TRUMP</span>
<span className="font-arctic-3d [ORANGE_GRADIENT]">FILES</span>
```

## PAGES & FUNCTIONALITY

### 1. Homepage (`app/page.tsx`)

**Hero Section:**
- Full viewport height (h-screen)
- "THE TRUMP FILES" title in orange gradient (3-font combo)
- Subtitle badge with orange styling
- Body paragraph
- 2 CTA buttons (Explore The Files, Visualize The Data)
- 3D Trump model (orange head) on right side
- Proper spacing: pt-20, space-y-6, gap-12
- Grid: lg:grid-cols-2

**Features Section:**
- 4 feature cards with icons
- Glass card styling
- MagicCard hover effects

**3D Model (`components/OrangeHero.tsx`):**
- React Three Fiber canvas
- Load `/orange_hero.glb`
- Float animation
- Mouse-follow rotation (clamped)
- NO data-oid attributes on Three.js components
- Orange point light
- Sunset environment

### 2. Catalog Page (`app/catalog/page.tsx`)

**Header:**
- "THE TRUMP FILES" using TrumpFilesBrand component
- "Catalog" subtitle with orange gradient
- Entry count display

**Filters (Collapsible):**
- Search input
- "Show/Hide Category Filters" button (collapsed by default)
- Color-coded category toggle buttons
- Phase dropdown
- Clear filters button
- Show count of filtered results

**Entry Grid:**
- Responsive grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- MagicCard wrapper per entry
- Display: rank badge, phase, title, category, synopsis (3-line clamp)
- Metadata: date, duration
- Fucked-up Score prominent display
- 5 animated progress bars (Danger, Authoritarianism, Lawlessness, Insanity, Absurdity)
- Keywords (first 3 + count)
- Copy link button
- Link to `/entry/[entry_number]`

### 3. Visualizer Page (`app/visualizer/page.tsx`)

**Title:** "Data Visualizer" with orange gradient

**Layout:** Sidebar controls + main chart area

**Chart Types:**
1. Bar Chart (default)
2. Line Chart  
3. Scatter Plot
4. Heatmap
5. **TODO:** Radar Chart
6. **TODO:** Pie Chart
7. **TODO:** Venn Diagram
8. **TODO:** Financial Timeline
9. **TODO:** Relationship Mermaid Diagram

**Controls:**
- Chart type tabs
- Y-Axis metric selector (count, danger, authoritarianism, lawlessness, insanity, absurdity)
- X-Axis group by (timeline, category, phase)
- Data point count display

**Chart Rendering (D3.js):**
- SVG with orange gradient definition
- Rotated x-axis labels (-65deg) for readability
- Increased bottom margin (120px) for labels
- Orange gradient bars/lines
- Tooltips on hover
- Animated transitions

**TODO Features:**
- Add highlight stats per chart
- Add text explanations
- Cross-correlate data for predictions
- Tooltips on ALL datapoints

### 4. Entry Detail Page (`app/entry/[entry_number]/page.tsx`)

**Fetch:** `/api/entry/[entry_number]` (uses Neon)

**Layout:** 2-column (main content + sidebar)

**Main Content:**
- Entry header with rank badge
- Title with orange gradient
- Metadata (date, category, fucked-up score)
- Synopsis card
- Rationale (AI analysis) in orange box
- Keywords
- Timeline & Context card (phase, age, year, duration)

**Sidebar:**
- AI Scoring Analysis card
- 8 animated score displays with thermal coloring
- Progress bars for each dimension

### 5. WTF Page (`app/wtf/page.tsx`)

**Content Source:** `new_wtf_text_content.txt`

**TODO:** Complete overhaul with:
- Modern layout
- Magazine-style text wrapping around Trump logo
- Orange gradient headings
- Custom bullet points (use Lucide icons)
- Sections:
  - What The Fuck (WTF) Are The Trump Files?
  - Project Vision: Break The Cycle of Amnesia
  - Methodology: The Data Pipeline from Hell
  - Core Personality Pie Chart (image)
  - Analytics, Visualizations, and Custom Insights
  - What Does This Teach Us?
  - Our Goal
  - What Can You Do?
  - WTF is Next?

### 6. Navigation (`components/Navigation.tsx`)

**Layout:** Fixed top navigation with glass effect

**Logo:** Trump Files orange logo + "THE TRUMP FILES" brand component (sm size)

**Nav Items:** Home, Catalog, Visualizer, WTF?, Admin, Contact

**Active State:** Orange gradient background + border
```
bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-400 border border-orange-500/30
```

**Contact:** Opens dialog with email form

**TODO:** Redesign as centered glass island with:
- Centered horizontally (fixed top-4 left-1/2 -translate-x-1/2)
- Rounded-full or rounded-2xl
- Orange-tinted glass effect
- Smooth gradient hover animations

## COMPONENTS

### TrumpFilesBrand (`components/TrumpFilesBrand.tsx`)

Standard component for "THE TRUMP FILES" branding:
```tsx
export const TrumpFilesBrand = ({ size = "md", className }) => {
  const ORANGE_GRADIENT = "bg-gradient-to-r from-orange-500 via-orange-400 to-red-500 bg-clip-text text-transparent";
  
  return (
    <div className={cn("flex flex-wrap gap-2 lg:gap-3", className)}>
      <span className={cn("font-arctic-grad", sizeClasses[size], ORANGE_GRADIENT)}>THE</span>
      <span className={cn("font-arctic-laser italic", sizeClasses[size], ORANGE_GRADIENT)}>TRUMP</span>
      <span className={cn("font-arctic-3d", sizeClasses[size], ORANGE_GRADIENT)}>FILES</span>
    </div>
  );
};
```

Sizes: sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl

### TrumpFilesHeading

Wrapper for h1-h6 that applies orange gradient to Arctic Guardian text.

## API ROUTES

### `/api/catalog-data/route.ts`
```typescript
import { neon } from "@neondatabase/serverless";
const sql = neon(process.env.DATABASE_URL!);

export async function GET() {
  const entries = await sql`SELECT * FROM ai_complete_trump_data ORDER BY fucked_up_rank::int ASC`;
  return NextResponse.json(entries);
}
```

### `/api/visualizer-data/route.ts`
Same as catalog-data

### `/api/entry/[entry_number]/route.ts`
```typescript
const entry = await sql`
  SELECT * FROM ai_complete_trump_data
  WHERE entry_number = ${entryNum}
  LIMIT 1
`;
return NextResponse.json(entry[0]);
```

## TODO TASKS (High Priority)

### Task #1: Typography Audit
- Scan all pages for font usage
- Ensure ONLY Arctic Guardian (headings) + Epilogue (body)
- Apply orange gradient to ALL Arctic Guardian text
- Vary Arctic Guardian subtypes within sections for visual interest

### Task #3: GradientBlinds Background
Add to main page:
```tsx
<GradientBlinds
  gradientColors={['#FF9FFC', '#5227FF']}
  angle={0}
  noise={0.3}
  blindCount={12}
  spotlightRadius={0.5}
  mouseDampening={0.15}
/>
```
Ensure text contrast with z-index and backdrop-blur

### Task #4: WTF Section Content Overhaul
Use content from `new_wtf_text_content.txt`:
- Modern layout with sections
- Magazine-style text wrapping around `/public/trump-logo.png`
- Orange gradient headings
- Custom bullet points (Lucide icons)
- Pie chart image integration

### Task #6: Navigation Redesign
Transform to centered glass island:
- `fixed top-4 left-1/2 -translate-x-1/2 z-50`
- `backdrop-blur-lg bg-orange-500/10 border border-white/20 rounded-full`
- Smooth hover animations with gradient
- Active page: different gradient intensity

### Task #7: Red → Orange Gradient
Search and replace ALL instances of:
- `text-red-*` → orange gradient
- `bg-red-*` → orange gradient  
- `border-red-*` → `border-orange-*`
- Pulsating button: change red to orange

### Task #8: DecryptedText Animation
Apply to Arctic Guardian text (EXCEPT cards):
```tsx
<DecryptedText text="..." speed={100} maxIterations={20} animateOn="view" />
```
Pages: app/page.tsx (hero, sections), app/wtf/page.tsx (headings)

### Task #9: Mission Statement Section
Add after features in `app/page.tsx`:
```tsx
<section className="relative py-20">
  <InteractiveGrid className="absolute inset-0" />
  <div className="container mx-auto px-4 relative z-10">
    <GlowingShadow>
      <div className="p-12 text-center">
        <h2 className="font-heading text-4xl mb-6 [ORANGE_GRADIENT]">Our Mission</h2>
        <p>The Trump Files exists as an AI-powered chronicle cataloging crimes, lies, 
        and personality flaws. We aim to understand patterns, provide comic relief, 
        and offer evidence for potential prosecution. Our goal: jail or bar from heaven, 
        whichever comes first.</p>
      </div>
    </GlowingShadow>
  </div>
</section>
```

### Task #10: Database Preview Charts
Create 4 charts BEFORE footer on homepage:
1. **Pie Chart:** Category distribution
2. **Radar Chart:** Score metrics across phases
3. **Line Chart:** Entries over time
4. **Bar Chart:** Financial burden per phase

Create directory structure: `components/evilcharts/pie/`, `/radar/`, `/line/`, `/bar/`
Each with: chart component, card wrapper, badge, demo
Fetch from `/api/catalog-data`
Uniform size: `max-h-[300px] w-full`
Grid: `grid grid-cols-1 md:grid-cols-2 gap-8`

### Task #11: ASCII Art Footer
Create flickering footer:
- ASCII art Trump logo (orange)
- ASCII art "THE TRUMP FILES" text
- Use figlet or https://patorjk.com/software/taag/
- Font: "Standard" or "Big"
- Style: `font-mono text-orange-500`
- Add footer links, copyright

## VISUALIZER REDESIGN (Complete)

**Requirements:**
- Multiple independent charts (NOT single chart builder)
- Each chart type gets own section with own builder
- Separate x-axis and customization controls per chart

**Chart Types to Add:**
1. **Radar Chart:** Show all 8 scoring dimensions for selected entries
2. **Pie Chart:** Category distribution with percentages
3. **Venn Diagram:** Category overlap analysis
4. **Financial Timeline:** Financial costs over time
5. **Relationship Mermaid Diagram:** Connections between entries/people

**Per Chart:**
- Title with explanation
- Highlight stats section (min, max, avg, median)
- Interactive legend
- Tooltips on every datapoint
- Export button (SVG/PNG)

**Cross-Correlation Features:**
- Compare danger vs. financial cost
- Timeline of escalation
- Category clustering
- Phase progression analysis
- Predictive insights from patterns

## TYPOGRAPHY ENHANCEMENTS

**Random Word Formatting:** In paragraphs, randomly apply:
- Bold: `<strong>`
- Larger font: `text-lg` or `text-xl`
- Orange gradient: apply to 1-2 words per paragraph
- Subtle animations: `animate-pulse` or framer-motion

**Example:**
```tsx
<p>
  The Trump Files is a <span className="text-lg font-bold text-orange-500">comprehensive</span> 
  data-driven archive providing <span className="bg-gradient-to-r from-orange-500 to-red-500 
  bg-clip-text text-transparent font-bold">evidence</span> for historical analysis.
</p>
```

Apply sparingly across: hero paragraph, feature descriptions, WTF content

## PROACTIVE DESIGN IMPROVEMENTS

Scan and fix:
1. **Alignment:** Ensure all sections have consistent padding/margins
2. **Proportions:** Text size relative to container
3. **Spacing:** Remove excessive gaps, add breathing room where needed
4. **Animations:** Smooth transitions, no janky effects
5. **Responsive:** Test mobile, tablet, desktop breakpoints
6. **Accessibility:** Contrast ratios, focus states, ARIA labels
7. **Performance:** Lazy load images, code split heavy components

## CONFIGURATION FILES

### `tailwind.config.ts`
```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        heading: ["var(--font-arctic-guardian)"],
        sans: ["var(--font-epilogue)"],
        "arctic-grad": ["var(--font-arctic-grad)"],
        "arctic-laser": ["var(--font-arctic-laser)"],
        "arctic-3d": ["var(--font-arctic-3d)"],
        // ... other Arctic variants
      },
      colors: {
        primary: {
          DEFAULT: "#FF6500",
          foreground: "#ffffff",
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
```

### `components.json`
```json
{
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  },
  "registries": {
    "@magicui": "https://magicui.design/r/{name}.json",
    "@aceternity": "https://ui.aceternity.com/r/{name}.json",
    "@originui": "https://originui.com/r/{name}.json",
    "@shadcn": "https://ui.shadcn.com/r/{name}.json"
  }
}
```

### `.env.local`
```
DATABASE_URL=postgresql://[user]:[password]@[host]/[database]?sslmode=require
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

## MCP SERVERS TO USE

1. **Neon MCP:** Database operations
2. **shadcn MCP:** UI component management
3. **MagicUI MCP:** Advanced components
4. **Playwright MCP:** Visual testing (use frequently!)
5. **Serena MCP:** Context management

## DEVELOPMENT WORKFLOW

1. Create Next.js project with dependencies
2. Set up fonts in `/public/fonts/` and `app/fonts.ts`
3. Configure Tailwind with font families
4. Create type definitions (`types/database.ts`)
5. Set up API routes connecting to Neon
6. Build components (Navigation, TrumpFilesBrand, OrangeHero)
7. Build pages (Homepage, Catalog, Visualizer, WTF, Entry)
8. Apply branding (orange gradients everywhere)
9. Add animations and interactions
10. Implement remaining tasks (#3-#11)
11. Test with Playwright
12. Optimize and deploy

## CRITICAL RULES

1. ✅ NEVER use Supabase - ONLY Neon database
2. ✅ ALL Arctic Guardian fonts MUST have orange gradient
3. ✅ "THE TRUMP FILES" ALWAYS uses 3-font combo
4. ✅ NO data-oid on Three.js components
5. ✅ Replace ALL red with orange
6. ✅ Hero section MUST fit in one viewport
7. ✅ Update PROJECT_JOURNAL.md with microscopic detail
8. ✅ Use Playwright MCP frequently to verify visual state
9. ✅ Batch file operations for efficiency
10. ✅ Work fast, document thoroughly

## SUCCESS CRITERIA

- ✅ Site loads without errors
- ✅ 3D model persists across route changes
- ✅ All text properly styled with orange gradients
- ✅ Catalog filters collapsible
- ✅ Visualizer charts readable (no label overlap)
- ✅ Entry pages display complete data
- ✅ Navigation consistent across pages
- ✅ Responsive on all devices
- ✅ All 11 tasks from NEXT_AI_HANDOFF.md complete
- ✅ Project journal updated with every change

---

**FINAL NOTE:** This is a high-performance, visually stunning web application. Speed is important, but quality and attention to detail are paramount. Every element should have purpose, every animation should be smooth, every piece of data should be accurate. Build something worthy of the 775 entries it showcases.
