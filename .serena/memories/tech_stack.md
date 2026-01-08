# Tech Stack - The Trump Files

## Framework & Core

- **Next.js 16** - App Router, React Server Components, TypeScript
- **React 19.2.0** - Latest React version
- **TypeScript 5.9.3** - Strict mode enabled
- **Node.js 20+** - Runtime environment

## Styling & UI

- **Tailwind CSS v4** - Utility-first CSS framework
- **tailwindcss-animate** - Animation utilities
- **Framer Motion 12.23.24** - React animation library
- **Radix UI** - Unstyled, accessible component primitives
- **shadcn/ui** - Component library built on Radix
- **MagicUI** - Advanced animated components
- **Aceternity UI** - Additional UI components

## Database

- **Neon PostgreSQL** - Serverless PostgreSQL database
- **@neondatabase/serverless** - Connection library
- **Primary View**: `ai_complete_trump_data` (~775 entries)
- **Tables**: `trump_entries`, `trump_individual_scores`, etc.

## 3D Graphics

- **React Three Fiber 9.4.0** - React renderer for Three.js
- **@react-three/drei 10.7.6** - Useful helpers
- **Three.js 0.180.0** - 3D graphics library
- **Model**: `orange_hero.glb` (3D orange head)

## Data Visualization

- **D3.js 7.9.0** - Custom chart rendering
- **Recharts 3.3.0** - React charting library
- **venn.js 0.2.20** - Venn diagram support

## Forms & Validation

- **React Hook Form 7.65.0** - Form management
- **Zod 4.1.12** - Schema validation
- **@hookform/resolvers 5.2.2** - Zod integration

## Authentication (Optional)

- **Clerk 6.34.0** - Authentication service
- Used for admin/protected routes

## Utilities

- **clsx** - Conditional class names
- **tailwind-merge** - Merge Tailwind classes
- **class-variance-authority** - Component variants
- **lucide-react** - Icon library

## Fonts

- **Arctic Guardian** - Custom heading fonts (multiple variants)
  - Grad, 3D, Laser, Gradient Italic, etc.
- **Epilogue** - Body text font (sans-serif)

## Development Tools

- **ESLint 9** - Code linting
- **TypeScript** - Type checking
- **cross-env** - Cross-platform env vars
- **shadcn CLI** - Component management

## MCP Servers (Available)

- **Serena** - Context management & code analysis
- **Neon** - Database operations
- **MagicUI** - Component library access
- **Playwright** - Browser automation/testing
- **shadcn** - Component registry
