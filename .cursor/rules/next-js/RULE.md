---
name: Next.js Conventions
description: Important Next.js file conventions and patterns to follow
---

# Next.js File Conventions

## CRITICAL: Deprecated Conventions

### ❌ NEVER use `middleware.ts`

Next.js has deprecated the `middleware.ts` file convention.

**Use `proxy.ts` instead with the `proxy()` function:**

```typescript
// ✅ CORRECT: src/proxy.ts
export async function proxy(request: NextRequest) {
  // your middleware logic
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)',],
}
```

```typescript
// ❌ WRONG: src/middleware.ts
export async function middleware(request: NextRequest) {
  // this will trigger deprecation warning
  return NextResponse.next()
}
```

### Key Points

- The file MUST be named `proxy.ts` (not `middleware.ts`)
- The exported function MUST be named `proxy` (not `middleware`)
- Location: `src/proxy.ts` at the root of your `src` directory
- Use the same `matcher` configuration as before
- All middleware logic (auth, rate limiting, headers) goes here

### Common Use Cases in proxy.ts

1. Authentication checks and redirects
2. Rate limiting
3. Security headers (CSP, CORS, etc.)
4. Request/response logging
5. Path-based routing logic

## Other Next.js Best Practices

### App Router Structure

- Use App Router (not Pages Router)
- API routes: `src/app/api/[route]/route.ts`
- Pages: `src/app/[route]/page.tsx`
- Layouts: `src/app/layout.tsx`

### Server Components by Default

- All components are Server Components unless marked with `'use client'`
- Only add `'use client'` when you need:
  - React hooks (useState, useEffect, etc.)
  - Browser APIs
  - Event handlers
  - Client-side state management (Effector stores)

### ✅ MUI Grid v7: Use NEW syntax

**CRITICAL:** Material-UI Grid v7 uses NEW syntax without `item` prop.

```typescript
// ✅ CORRECT: MUI v7 Grid syntax
import Grid from '@mui/material/Grid'
<Grid size={{ xs: 12, md: 6 }}>...</Grid>

// ❌ WRONG: Old syntax with item prop (deprecated)
<Grid item xs={12} md={6}>...</Grid>
```

**Key points:**
- Import from `@mui/material/Grid`
- DO NOT use `item` prop (all Grids are items by default)
- Use `size={{ xs: 12, md: 6 }}` object syntax (NOT direct props)
- Container: `<Grid container spacing={3}>`
- Items: `<Grid size={{ xs: 12, sm: 6 }}>`

## Module Exports: Index Files Pattern

### ✅ ALWAYS use `index.ts` files for folder exports

Every folder that contains reusable code (components, utils, hooks, etc.) MUST have an `index.ts` file that serves as the public API of that module.

**Why:**
- Encapsulation: control what's exposed from a module
- Clean imports: `import { Button } from '@/components/ui'` instead of `import { Button } from '@/components/ui/Button'`
- Refactoring safety: internal file structure changes don't affect external imports
- Tree-shaking: easier for bundlers to optimize unused exports

### Structure

```typescript
// ✅ CORRECT: src/components/ui/index.ts
export { Button } from './Button'
export { Link } from './Link'
export { LinkBehaviour } from './LinkBehaviour'
// Only export what should be used externally

// ✅ CORRECT: External imports
import { Button, Link } from '@/components/ui'

// ❌ WRONG: Direct file imports from outside the folder
import { Button } from '@/components/ui/Button'
```

### Rules

1. **Every module folder MUST have `index.ts`**
   - `src/components/ui/index.ts`
   - `src/components/ui-theme/index.ts`
   - `src/lib/auth/index.ts`
   - `src/lib/db/index.ts`
   - etc.

2. **Keep index files clean**
   - Remove unused exports immediately
   - Only export what's needed by external consumers
   - Internal helpers should NOT be exported

3. **All external imports go through index**
   - Imports from other folders MUST use the index
   - Within the same folder, direct imports are allowed

4. **Exception: Next.js special files**
   - `page.tsx`, `layout.tsx`, `route.ts` don't need index files
   - Next.js handles these automatically

### Examples

```typescript
// ✅ CORRECT: src/lib/db/index.ts
export { db } from './kysely'
export { pool } from './pool'
export type { Database } from './types'
// Internal helper 'createConnection' is NOT exported

// ✅ CORRECT: Usage from another module
import { db, pool } from '@/lib/db'

// ❌ WRONG: Bypassing the index
import { db } from '@/lib/db/kysely'
```

### Maintenance

- When adding new exports: update the index
- When removing code: clean up the index
- Regularly audit index files for unused exports
- Use IDE "Find References" to check if exports are used
