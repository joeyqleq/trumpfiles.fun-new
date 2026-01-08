# Suggested Commands for The Trump Files Project

## Development Commands

### Run Development Server
```bash
npm run dev
```
- Starts Next.js dev server on http://localhost:3000
- Hot reload enabled
- Uses cross-env for environment variables

### Build for Production
```bash
npm run build
```
- Creates optimized production build in `.next/` directory
- TypeScript compilation
- Next.js route optimization

### Start Production Server
```bash
npm run start
```
- Runs production server from `.next/` directory
- Requires `npm run build` first

### Linting
```bash
npm run lint
```
- Runs ESLint on codebase
- Uses Next.js ESLint configuration

### Type Checking
```bash
npx tsc --noEmit
```
- Type checks without generating files
- Useful for CI/CD validation

## Database Commands

### Neon Database Access
- Use Neon MCP tools for database operations
- Project ID: `orange-block-53737929`
- Database: `neondb`
- Branch: `br-muddy-bonus-aalybvz7` (production)
- Primary view: `ai_complete_trump_data` (~775 entries)

## Utility Commands (Darwin/macOS)

### File Operations
- `ls -la` - List files with details
- `find . -name "*.tsx"` - Find files by pattern
- `grep -r "pattern" app/` - Search in directory
- `cat filename` - View file contents

### Git Operations
- Standard git commands work normally
- `.gitignore` configured for Next.js + Node.js

## Testing & Verification

### Playwright Browser Testing
- Use Playwright MCP tools to verify visual state
- Navigate, screenshot, test interactions
- Critical for validating UI changes

### Component Library Management

#### shadcn/ui Components
```bash
npx shadcn@latest add [component-name]
```

#### MagicUI Components
- Use MagicUI MCP server to get component code
- Components from: magic-ui.design registry

## Environment Variables

### Required (.env.local)
- `DATABASE_URL` - Neon PostgreSQL connection string
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk auth (optional)
- `CLERK_SECRET_KEY` - Clerk secret (optional)
- `RESEND_API_KEY` - Email service (optional)

### Never Commit
- `.env.local` is in `.gitignore`
- Keep secrets secure
