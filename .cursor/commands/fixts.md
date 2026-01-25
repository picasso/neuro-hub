# Fix TypeScript Errors

## Overview
Systematically resolve TypeScript compilation and type errors.

## Steps

1. **Identify errors**
   - Check terminal output
   - Run: `yarn type-check` (if available)
   - Check IDE error highlights
   - Note all error locations

2. **Categorize errors**
   - Type mismatches
   - Missing properties
   - Undefined types/imports
   - Generic type errors
   - Strict mode violations

3. **Fix priority**
   - [ ] Fix import errors first
   - [ ] Fix type definitions
   - [ ] Fix function signatures
   - [ ] Fix component props
   - [ ] Fix database types

4. **Fix Process**
   - Identify error source
   - Describe the problem and propose 2-3 solution options
   - Wait for user's choice
   - Fix errors
   - Re-run checks and verify
   - If the solution does not help, discuss with user

5. **Common fixes**

   **Database types:**
   - Check `src/types/database.ts`
   - Regenerate if schema changed
   - Use Kysely type helpers

   **Component props:**
   - Define proper interface
   - Mark optional props with `?`
   - Use TypeScript utility types

   **API responses:**
   - Check return types match
   - Use proper NextResponse types
   - Validate with Zod schemas

   **Imports:**
   - Use path aliases: `@/`
   - Check file extensions
   - Verify exports exist

6. **Verify fix**
   - Save file and check errors cleared
   - Run build: `yarn build`
   - Check no new errors introduced
   - Test functionality still works

## TypeScript Best Practices
- [ ] Prefer types over interfaces
- [ ] Use `unknown` instead of `any`
- [ ] Proper null/undefined handling
- [ ] Use type guards when needed
- [ ] Leverage TypeScript inference
- [ ] Don't use `as` casting unless necessary
- [ ] Don't use function return type if the type can be inferred

## Common Patterns in Project
- Database queries return typed results
- API routes use NextRequest/NextResponse
- Zod schemas define validation + types
- Components use proper React `FC` or function syntax
- Server actions properly typed

## If Stuck
- Check similar working code in project
- Review TypeScript docs for specific error
- Check library type definitions
- Consider if type is actually correct
- Discuss with user
