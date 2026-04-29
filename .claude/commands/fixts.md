# Fix TypeScript Errors

Systematically resolve TypeScript compilation and type errors.

## Steps

### 1. Identify errors

```bash
yarn type-check
```

Note all error locations and messages.

### 2. Categorize errors

- Type mismatches
- Missing properties
- Undefined types / missing imports
- Generic type errors
- Strict mode violations (`any`, non-null assertions)

### 3. Fix priority

- [ ] Import errors first
- [ ] Type definitions and interfaces
- [ ] Function signatures
- [ ] Component props
- [ ] Database / Kysely types

### 4. Fix process

For each error:
1. Identify the root cause
2. Describe the problem
3. Propose 2–3 solutions with pros/cons
4. Wait for user's choice
5. Fix, then re-run `yarn type-check`
6. If the fix doesn't help, discuss with user

### 5. Common fixes

**Kysely / DB types:**
- Check `src/types/` and `src/lib/db/`
- Use Kysely type helpers (`Selectable`, `Insertable`, `Updateable`)

**Component props:**
- Define `type Props = { ... }` (prefer `type` over `interface`)
- Mark optional props with `?`
- Use TypeScript utility types (`Partial`, `Pick`, `Omit`)

**API responses:**
- Check return types match `ApiResponse<T>`
- Validate with Zod schemas, use inferred types (`z.infer<typeof schema>`)

**Imports:**
- Use path aliases: `@/features`, `@/ui`, `@/lib`, `@/utils`
- Verify the export exists in the target file

### 6. Verify

```bash
yarn type-check   # must pass with 0 errors
yarn lint         # must pass with 0 errors
```

---

## TypeScript best practices

- `type` over `interface`
- `unknown` instead of `any` — narrow with type guards
- Avoid `as` casting unless absolutely necessary
- Don't annotate return types when TypeScript can infer them
- No non-null assertion (`!`) unless the invariant is genuinely guaranteed

## If stuck

- Find a similar working pattern in the project
- Check the library's type definitions
- Consider whether the type is actually correct before forcing a cast
