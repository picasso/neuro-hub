# Setup New Feature

## Overview
Systematically set up a new feature following project architecture and conventions.

## Planning Phase

1. **Define requirements**
   - Remember the project rules
   - What problem does this solve?
   - Who are the users?
   - What are acceptance criteria?
   - Any dependencies on other features?
   - Describe what you plan to do and wait for explicit confirmation

2. **Search existing code**
   - Similar features in codebase?
   - Reusable components?
   - Existing API patterns?
   - Related database tables?
   - Describe what you plan to do and wait for explicit confirmation

3. **Plan architecture**
   - Which layers affected? (UI/API/DB)
   - Database changes needed?
   - New components or extend existing?
   - Authentication/authorization needed?
   - Propose 2-3 solution options
   - Wait for user's choice

## Implementation Structure

1. **Database layer** (if needed)
   - Remember `code-style` and `anti-patterns` rules
   - Create migration: Use `/create-migration`
   - Update types in `src/types/database.ts`
   - Add seed data if needed
   - Test migration up/down
   - Show which files were created and wait for explicit confirmation

2. **API layer** (if needed)
   - Remember `code-style` and `next-js` rules
   - Create API route: Use `/add-api-endpoint`
   - Add validation schemas
   - Implement business logic
   - Add Swagger docs
   - Test documentation with user

3. **Components layer**
   - Remember `code-style`, `next-js` and `effector` rules
   - Plan component structure
   - Reuse existing UI components
   - Follow Material-UI patterns
   - Keep files under 300 lines
   - Show which files were created and wait for explicit confirmation

4. **Integration**
   - Connect frontend to API
   - Add proper error handling
   - Add loading states
   - Test user flows
   - Test in dev environment if needed
   - Get confirmation from the user

## File Organization

```zsh
For feature "user-projects":

Database:
- src/lib/db/migrations/YYYYMMDD-NNN-create-projects-table.ts

API:
- src/app/api/projects/route.ts
- src/app/api/projects/[id]/route.ts

Validation:
- src/lib/validations/project.ts

Types:
- Update src/types/database.ts

Components:
- src/components/features/projects/project-card.tsx
- src/components/features/projects/project-list.tsx
- src/components/forms/project-form.tsx

Pages:
- src/app/projects/page.tsx
- src/app/projects/[id]/page.tsx
```

## Development Checklist
- [ ] Requirements clear
- [ ] Similar code searched
- [ ] Architecture planned
- [ ] Database migration created (if needed)
- [ ] API endpoints implemented (if needed)
- [ ] Validation schemas added
- [ ] Stores and effects created (if needed)
- [ ] Components created
- [ ] Integration tested
- [ ] Tests written for critical paths
- [ ] No TypeScript errors
- [ ] Linter passes
- [ ] Logs checked for errors

## Testing Strategy
- [ ] Manual testing of happy path
- [ ] Test error cases
- [ ] Test edge cases
- [ ] Test authentication/authorization
- [ ] Cross-browser testing (if UI)
- [ ] Responsive design (if UI)

## Before PR
- Run: `/tests`
- Run: `/dlogs`
- Run: `/pr`
