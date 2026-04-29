# neuro-hub — Claude Instructions

## Project

**NeuroGig** — freelance marketplace for generative AI specialists.
Two-sided marketplace (freelancers + clients), Hugging Face Spaces demos, portfolio & skills verification, Better Auth (OAuth, cookie sessions).

---

## Commands

```bash
corepack enable
yarn install
yarn dev          # HMR — use during development
yarn lint
yarn type-check
yarn test
```

**Do not run `yarn build` during sessions** — it disables HMR.

### Database

```bash
yarn db:migrate   # run migrations
yarn db:test      # test connection
yarn db:check     # inspect DB
```

---

## Tech Stack

- **Next.js 16+** (App Router), React 19.2.x (Server Components priority)
- **TypeScript 5.9+** (strict mode)
- **Tailwind CSS 4+**, shadcn/ui (Radix UI primitives), lucide-react
- **Effector 23+** for global state
- **Kysely 0.28+** for DB queries, **Knex.js 3+** for migrations only
- **Zod 4+** for validation, **Better Auth** for authentication
- **PostgreSQL 18.2.x**, Node.js 24 LTS, Yarn 4.x (via Corepack)
- Hosting: Vercel + Railway; CDN: Cloudflare; CI: GitHub Actions

---

## Workflow Rules

### Plan before implementing

Always propose a plan before making changes — describe what will be done, list files that will change, and wait for confirmation before starting.

### Committing

Never commit without explicit approval. Show what was done, ask "Ready to commit?", wait for "yes".

### When something doesn't work

Don't fix automatically. Describe the problem, propose 2–3 options with pros/cons, implement only the chosen one.

### Documentation updates

Do NOT propose or request documentation updates automatically. Update `*.md` files only on direct instruction.

**Exception — DB docs (no separate instruction needed once the DB task is confirmed):** If a task changes DB structure (migrations, auth schema, columns, indexes, foreign keys, enum values, canonical join paths), you MUST check and update:
- `docs/db/schema.dbml`
- `docs/db/DATABASE.md`
- `docs/db/queries/*.sql` (when canonical read models or join paths change)

If a task touches architecture or the development plan, ask: "Should ARCHITECTURE-DECISIONS.md or DEVELOPMENT-PLAN.md be updated?"

If the user defers something — offer to add it to `TODO.md`.

---

## Project Structure

```zsh
src/
├── app/          # Next.js App Router — thin route files only (import + re-export)
│   ├── api/      # Route handlers
│   └── layout.tsx
├── features/     # Business-logic components
│   ├── index.ts  # Client-safe barrel — import via @/features
│   └── server.ts # Server-only barrel — import via @/features/server
├── ui/           # Reusable UI primitives
│   ├── shadcn/   # Raw shadcn/Radix components (INTERNAL — never import directly)
│   ├── icons/    # Custom SVG icons
│   ├── providers/
│   └── index.ts  # Public barrel — always import via @/ui
├── alerts/       # Effector-based alert/feedback system
├── config/       # Metadata, mocks, constants
├── lib/          # auth, db, email, swagger, validations
├── stores/       # Effector stores
├── utils/        # Pure utilities (no side effects)
└── types/        # Shared TypeScript types
```

**Key rules:**
- `app/**/page.tsx` — import + re-export only, no JSX or logic
- Business logic lives in `features/`, never in `app/page.tsx`
- Server-only exports (using `next/headers`, `@/lib/db`) go in `features/server.ts`, never in `features/index.ts`
- No subfolder `index.ts` barrels — only `features/index.ts`, `features/server.ts`, `ui/index.ts`
- Prefer flat folders; create subfolders only for 5+ related files forming a distinct domain
- When grouping files in a subfolder, use a named grouping file (e.g. `icons.tsx`) instead of `index.ts`

---

## Code Style

- **TypeScript** everywhere; prefer `type` over `interface`; no `enum` — use union types
- No `any` — use `unknown` and narrow
- No `var` — use `const`/`let`
- Functional and declarative patterns; no classes
- Early returns to reduce nesting
- Descriptive names with auxiliary verbs: `isLoading`, `hasError`
- Event handler props prefixed with `on`: `onClick`, `onKeyDown`
- Named exports for all components
- React components as `function` declarations, not `FC`
- **Single-line comments only**, starting with lowercase; no JSDoc or block comments (`/** */`) in app code
- No deprecated React event aliases like `FormEvent`; prefer `ComponentPropsWithoutRef<'form'>['onSubmit']`

**Formatting (ESLint + Prettier):**
- Tabs for indentation, single quotes, no semicolons
- 100-character line limit, trailing commas in multi-line structures

**File naming:**
- Code files and folders: `kebab-case` (`user-profile.tsx`, `use-auth.ts`)
- Markdown docs: `SCREAMING-KEBAB-CASE` (`README.md`, `ARCHITECTURE-DECISIONS.md`)

**Naming conventions:**
- Components: `PascalCase` (file: `user-profile.tsx`)
- Hooks: `camelCase` with `use` prefix (file: `use-auth.ts`)
- Utilities: `camelCase` (file: `format-currency.ts`)
- Types: `PascalCase` with descriptive suffix (`UserCreateInput`)
- Constants: `SCREAMING_SNAKE_CASE` (`MAX_RETRIES`)

**Component structure order:**
1. Type definitions
2. Component function
3. Hooks (state → refs → effects)
4. Event handlers
5. Render helpers
6. Return statement

**Import order** (no empty lines between groups — `'newlines-between': 'never'`):
1. `builtin` (node:fs, node:path)
2. `external` (next, react, lodash)
3. `internal` (@/ui, @/features, @/lib, @/utils)
4. `parent` (../)
5. `sibling` (./)
6. `index`
7. `type`

**Tailwind — use `cn()` from `@/utils` for conditional class merging:**

```tsx
<div className={cn('flex items-center gap-2', isActive && 'bg-primary text-primary-foreground')}>
```

Use shadcn/ui CSS variables for colors (`bg-primary`, `text-foreground`, `border-border`).

---

## Imports & Barrel Rules

```tsx
// ✅ Always use top-level barrels
import { Button, Icon, TS } from '@/ui'
import { HomePage } from '@/features'
import { DashboardPage } from '@/features/server'

// ❌ Never import from shadcn directly
import { Button } from '@/ui/shadcn/button'

// ❌ Never import from @/features sub-paths
import { something } from '@/features/auth/login-form'
```

---

## API Design

- URL nouns in plural: `/api/v1/resources`
- Proper HTTP methods and status codes
- Use `requestJson()` from `src/lib/api-client.ts` for client-side requests with `ApiResponse<T>`
  - Pass payloads via `json`, not manual `body: JSON.stringify(...)` + `content-type` header
  - Use `normalizeJson` for generic cleanup (omit empty strings/nulls/arrays); it already trims strings — no extra `trim()` needed
  - Keep field-specific transforms inline (`value.trim() || null`, number parsing, etc.)

**Response format:**

```ts
// success
{ "data": { ... }, "meta": { "page": 1, "total": 100 } }

// error
{ "error": { "code": "VALIDATION_ERROR", "message": "...", "details": [...] } }
```

**Status codes:** 200 OK · 201 Created · 204 No Content · 400 Bad Request · 401 Unauthorized · 403 Forbidden · 404 Not Found · 409 Conflict · 422 Unprocessable · 429 Rate Limited · 500 Server Error

---

## React / Next.js

- Default to **Server Components**; add `'use client'` only when needed
- `proxy.ts` (not `middleware.ts`) for route protection: `src/proxy.ts`, exports `proxy(request)`
- Validate input with Zod in Server Actions; return unified Result type
- User-visible feedback (success/warning/error) always through `@/alerts`, never `alert()` or ad-hoc toasts

### `'use client'` decision:

```zsh
Does the file use hooks or browser APIs at module scope?
  NO  → no directive needed
  YES → Is it exported through a barrel (index.ts)?
          YES → add 'use client' at line 1
          NO  → Is it ONLY imported from files that already have 'use client'?
                  YES → no directive needed (internal module)
                  NO  → add 'use client' at line 1
```

If adding `'use client'` causes "Props must be serializable" warning → remove the component from the barrel, import via relative path from its client parent.

**Client boundary re-export pattern when component must stay public:**

```ts
// component.tsx — no 'use client', full implementation
export function MyComponent({ onChange }: Props) { ... }

// component-client.tsx — 'use client', re-export only
'use client'
export * from './component'

// ui/index.ts — imports from the -client file
export { MyComponent } from './component-client'
```

### State by type:

| Type | Use |
|------|-----|
| Server data | Server Components, Suspense |
| Global/business | Effector |
| URL state | searchParams |
| Local UI | useState / useReducer |

---

## Effector

- No `store.getState()` for runtime orchestration — use `sample()`, `attach()`
- Name all units; match variable name to unit name
- Create a watched domain per feature in `src/lib/logger/watched.ts`, import as `...Domain as domain`
- Prefer many small stores over one large Redux-style object
- `.map()` for simple derivations, `combine()` for multi-store derived state
- `.on()` for direct store updates only — no side effects or business logic in `.on()`
- `sample()` for business logic, routing, transformations, cross-store orchestration
- **Add a single-line comment above every `sample()` explaining what it does**
- Keep domain logic in model files, not in React components
- Use Immer only for complex nested updates — not for primitives/trivial changes
- Provide reset events and cleanup flows for long-lived feature state

**Model file structure:**
1. Units (events, stores)
2. Effects
3. Derived stores
4. `sample()` connections
5. Helper functions

**Event naming:** `updatedProfile`, `resetProfile`, `toggleInProgress`, `partiallyFilled`

**Anti-patterns:** one large store · anonymous units · business logic in `.on()` · `getState()` orchestration · overusing Immer for primitives

---

## Immer

Use for: arrays of objects, nested structures, multiple mutations in one pass, conditional updates.

Do NOT use for: primitive values (numbers, strings, booleans), simple toggles.

**Critical — never reassign the `draft` parameter itself:**

```ts
// ❌ breaks Immer
produce(state, (draft) => { draft = { ... } })

// ✅ mutate draft properties
produce(state, (draft) => { draft.field = value })

// ✅ return new value to replace state entirely
produce(state, () => ({ field: value }))
```

---

## Tailwind 4

- Prefer `gap-*` over `space-x-*` / `space-y-*` for flex/grid layouts
- Slash opacity syntax: `bg-black/50`, not `bg-opacity-*`
- Specify `border-*`, `ring-*` colors explicitly — don't rely on v3 defaults
- Use `outline-hidden` instead of `outline-none` for accessibility
- `@utility` for custom utilities instead of `@layer utilities`
- Arbitrary values with CSS vars: `bg-(--brand-color)` (v4 syntax)

---

## Shared UI System

- Use `Button`, `Icon`, `TS`, `Stack` and other wrappers from `@/ui`
- Never scatter direct `lucide-react` imports in app code when `Icon` wrapper fits
- `Stack` as default primitive for generic layout (flex, gap, alignment)
- Use raw `div` only for non-layout purposes (overflow wrapper, positioning layer, semantic shell)
- No local `TooltipProvider` in leaf components — a global one is already mounted
- `PageShell` for route-entry page layout; presets: `form | content | wide | full`
  - `PageContainer` for inner width caps inside sections

---

## Security

- Validate ALL input with Zod 4 on the server, even if client validation exists
- Check session on every request to protected resources (via `src/proxy.ts`)
- Never raw SQL without parameterized queries when using `Kysely.sql`
- Never `dangerouslySetInnerHTML` without DOMPurify sanitization
- Never store tokens in localStorage — use cookies
- Never log passwords, tokens, or PII
- Never commit `.env` files; secrets via `process.env` only
- Rate limiting: 5 login attempts / 15 min; 100 API requests / min

---

## Testing

- **Vitest** + Testing Library; test files: `*.test.ts`, `*.test.tsx`
- Unit tests: 80% minimum coverage
- Integration tests: all API endpoints
- E2E: critical user flows
- AAA pattern (Arrange–Act–Assert), describe/it structure
- Mocks for external dependencies, factories for test data

**Pre-commit checklist:**
- `yarn lint` — 0 errors
- `yarn type-check` — 0 errors
- `yarn test` — all passing
- No secrets in code
- No `console.log` in production code

---

## Database Documentation Contract

When a task changes DB structure (migrations, auth tables, columns, indexes, constraints, foreign keys, ownership rules, enum values, canonical join paths), update:

- `docs/db/schema.dbml` — structural map (tables, columns, keys, indexes)
- `docs/db/DATABASE.md` — semantic map (purpose, invariants, lifecycle, query conventions)
- `docs/db/queries/*.sql` — when canonical read models or join paths change

Trust live schema and migrations first; update docs to match, not the other way around.

---

## Database Scripts (`scripts/`)

TypeScript scripts use `scripts/utils/cli-utils.ts`; bash scripts source `scripts/utils/shell-utils.sh`. Never use `console.log` or `chalk` directly.

**TypeScript output helpers:** `printEmpty`, `printSection`, `printSuccess`, `printError`, `printInfo`, `printWarning`, `printDimText`, `printDataRow`, `printListItem`, `printText`, `printUsage`, `promptConfirmation`, `pluralize`

**Spacing rules:** `printEmpty()` before script start, before each section, before prompts, after cancellation, before `process.exit()`

**Always support `--force` flag** to skip confirmations on destructive operations.

---

## Utility Preference

Before writing a new helper, check: existing `@/utils` helpers → lodash named exports (`capitalize`, `groupBy`, `uniqBy`, `pick`, `omit`, `debounce`, etc.) → other configured libraries.

Write a custom helper only when no existing utility covers the case, the logic is domain-specific, or the native expression is clearly simpler.

---

## Commits & PRs

**Commit format:** `<type>(<scope>): <description>`

Types: `feat` · `fix` · `docs` · `style` · `refactor` · `test` · `chore`

**PR language split:**
- Title, headings, checklist items → English
- Body, summary, change descriptions, testing details, notes → Russian
- Verify this split before showing a draft or running `gh pr create`

---

## Forbidden Practices

- `eval()`, `Function()` with user input
- `innerHTML` without sanitization
- Storing passwords in plain text
- Committing `.env` files
- Disabling TypeScript strict mode
- Disabling ESLint rules without justification
- Direct SQL without parameters
- Exposing internal errors in API responses
- Hardcoded API URLs
- Storing tokens in localStorage
- `any` type (use `unknown` and narrow)
- `var`
- Direct state mutation
- Index as React key for dynamic lists
- `useEffect` for data fetching (use Effector or Server Components)
- `@/ui/shadcn/*` direct imports — use `@/ui` barrel
- `@/features/*` sub-path imports — use `@/features` or `@/features/server`
- Server-only exports in `features/index.ts` — use `features/server.ts`
- Business logic in `app/page.tsx`
- `'use client'` in barrel files (`index.ts`)
- Internal sub-components (receiving callback props from parent) in barrel exports
- `getServerSideProps` or `pages/` directory (legacy)
- `styled-components`, `@emotion`, MUI `sx`
- `moment.js` (use Day.js or native Intl)
- Completing implementation without TypeScript and ESLint error checks
