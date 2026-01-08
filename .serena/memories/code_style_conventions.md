# Code Style & Conventions - The Trump Files

## TypeScript Standards

- **Strict Mode**: Enabled in `tsconfig.json`
- **Type Safety**: All components typed, no `any` types
- **Interfaces**: Preferred over types for object shapes
- **Export**: Named exports preferred

## File Naming

- **Components**: PascalCase (e.g., `TrumpFilesBrand.tsx`)
- **Pages**: lowercase with hyphens (e.g., `page.tsx`, Next.js convention)
- **Utils**: camelCase (e.g., `utils.ts`)
- **Types**: camelCase (e.g., `database.ts`)

## Component Structure

```typescript
// 1. Imports (external first, then internal)
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// 2. Interfaces/Types
interface ComponentProps {
  className?: string;
  // ...
}

// 3. Constants
const CONSTANT_NAME = "value";

// 4. Component
export const Component = ({ className }: ComponentProps) => {
  // Hooks
  // State
  // Effects
  // Handlers
  
  return (
    // JSX
  );
};
```

## Naming Conventions

- **Components**: PascalCase
- **Functions**: camelCase
- **Constants**: UPPER_SNAKE_CASE
- **Variables**: camelCase
- **CSS Classes**: Use Tailwind utilities, `cn()` for conditional classes

## Branding Constants

**CRITICAL**: Always use the orange gradient constant:

```typescript
const ORANGE_GRADIENT = "bg-gradient-to-r from-orange-500 via-orange-400 to-red-500 bg-clip-text text-transparent";
```

## Font Usage

- **Headings**: Always Arctic Guardian with orange gradient
- **Body**: Epilogue (via `font-sans` class)
- **"THE TRUMP FILES"**: Must use 3-font combo:
  - `font-arctic-grad` for "THE"
  - `font-arctic-laser italic` for "TRUMP"
  - `font-arctic-3d` for "FILES"

## CSS Patterns

### Glass Card Effect
```typescript
className="backdrop-blur-lg bg-white/5 border border-white/10"
```

### Orange Gradient Text
```typescript
className="bg-gradient-to-r from-orange-500 via-orange-400 to-red-500 bg-clip-text text-transparent"
```

### Container Patterns
```typescript
className="container mx-auto px-4"
```

## Import Aliases

- `@/components` - Component directory
- `@/lib` - Utility functions
- `@/types` - TypeScript types
- `@/app` - App directory

## React Patterns

- **Server Components**: Default (no "use client")
- **Client Components**: Explicit "use client" directive
- **Dynamic Imports**: Use for heavy components (3D, charts)
- **Framer Motion**: Use for animations

## Database Patterns

- **Type Safety**: Use `AICompleteTrumpData` interface
- **API Routes**: Use Neon pool for queries
- **Error Handling**: Always try/catch with proper error responses

## Documentation Requirements

**CRITICAL**: After EVERY change:
1. Update `PROJECT_JOURNAL.md` with:
   - What was changed
   - Files modified
   - Why the change was made
   - Session token usage
   - Status of related tasks

## Code Comments

- **Complex Logic**: Explain WHY, not WHAT
- **Database Queries**: Brief comment about purpose
- **Non-Obvious Patterns**: Document reasoning

## Error Handling

- **API Routes**: Return proper HTTP status codes
- **Components**: Handle loading/error states
- **Database**: Always wrap in try/catch

## Performance

- **Lazy Loading**: Use for 3D models, heavy components
- **Pagination**: Use for large data sets (50 per page)
- **Memoization**: Use React.memo, useMemo when appropriate
- **Image Optimization**: Use Next.js Image component
