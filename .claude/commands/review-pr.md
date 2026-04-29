# Review Pull Request

## Target: $ARGUMENTS

Comprehensive PR review following project standards.

---

## Code quality

- [ ] Follows project conventions (see CLAUDE.md)
- [ ] No unnecessary comments — self-explanatory code
- [ ] Proper separation of concerns (UI / API / DB / state)
- [ ] No `any`, no `var`, no direct state mutation
- [ ] Named exports, `function` declarations (not `FC`)

## Functionality

- [ ] Code does what it's supposed to
- [ ] Edge cases handled
- [ ] Error handling appropriate
- [ ] No obvious bugs or logic errors

## Testing

- [ ] Critical paths have tests
- [ ] Tests use AAA pattern
- [ ] `yarn test` passes
- [ ] `yarn lint` passes
- [ ] `yarn type-check` passes

## Database & API

- [ ] Kysely patterns followed correctly
- [ ] Migrations are reversible (`down` function exists)
- [ ] API responses use `ApiResponse<T>` format
- [ ] OpenAPI/Scalar docs updated if endpoints changed
- [ ] DB docs updated if schema changed (`docs/db/`)

## Security

- [ ] No hardcoded secrets or credentials
- [ ] Input validated with Zod
- [ ] Sensitive data handled properly
- [ ] Auth/authorization checks present

## React / Next.js

- [ ] Server/Client component boundaries correct
- [ ] `'use client'` only where necessary, not on barrel files
- [ ] No `useEffect` for data fetching
- [ ] User feedback through `@/alerts`
- [ ] No direct `@/ui/shadcn/*` imports

## UI conventions

- [ ] `Stack` used instead of layout-only `div`
- [ ] `@/ui` wrappers used (Button, Icon, TS, etc.)
- [ ] No local `TooltipProvider` duplication
- [ ] `cn()` for conditional classes

## Effector

- [ ] No `store.getState()` for orchestration
- [ ] Each `sample()` has a single-line comment
- [ ] Business logic in model files, not components
- [ ] Immer only for complex nested updates

## Project structure

- [ ] `app/**/page.tsx` files are thin (import + re-export only)
- [ ] No subfolder `index.ts` barrels
- [ ] Server-only exports in `features/server.ts`, not `features/index.ts`
