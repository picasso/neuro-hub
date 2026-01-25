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
