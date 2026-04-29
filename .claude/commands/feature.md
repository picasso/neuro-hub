# Setup New Feature

Systematically implement a new feature following project architecture and conventions.

## Phase 1: Plan

### 1. Define requirements
- What problem does this solve?
- Who are the users?
- Acceptance criteria?
- Dependencies on other features?

Describe what you plan to do and wait for confirmation.

### 2. Search existing code (run `/explore` first)
- Similar features?
- Reusable components or hooks?
- Existing API patterns?
- Related database tables?

### 3. Plan architecture
- Which layers are affected? (UI / API / DB)
- Database changes needed?
- New components or extend existing?
- Auth/authorization needed?

Propose 2–3 options, wait for user's choice.

### 4. Branch (optional)
Ask if a new branch is needed and suggest a name. Wait for confirmation before creating it.

---

## Phase 2: Implementation

### DB layer (if needed)
- Create migration: use `/migration`
- Update types in `src/types/`
- Add seed data if needed
- Test migration up and down

Show created files and wait for confirmation.

### API layer (if needed)
- Create route: use `/api-endpoint`
- Add Zod validation schemas
- Implement business logic
- Add OpenAPI/Scalar docs

### UI / Components layer
- Plan component structure
- Reuse existing UI from `@/ui`
- Global state via Effector (`src/stores/` or feature model file)
- Named exports, function declarations, no `FC`
- Keep files focused (one responsibility)

Show created files and wait for confirmation.

### Integration
- Connect frontend to API
- Add error handling through `@/alerts`
- Add loading states via Effector `pending`
- Test user flows

Get confirmation from user before proceeding to next phase.

---

## File organization example (feature "projects")

```
DB:
  src/lib/db/migrations/YYYYMMDD_NNN_create_projects_table.ts

API:
  src/app/api/projects/route.ts
  src/app/api/projects/[id]/route.ts

Validation:
  src/lib/validations/project.ts

Feature:
  src/features/projects/project-card.tsx
  src/features/projects/project-list.tsx
  src/features/projects/project-form.tsx
  src/features/projects/model.ts        ← Effector store

Page (thin):
  src/app/projects/page.tsx             ← import + re-export only
```

---

## Development checklist

- [ ] Requirements clear and confirmed
- [ ] Codebase searched for similar code
- [ ] Architecture planned and approved
- [ ] DB migration created and tested (if needed)
- [ ] API endpoints implemented (if needed)
- [ ] Zod validation schemas added
- [ ] Effector stores/effects created (if needed)
- [ ] Components created and integrated
- [ ] Feedback routed through `@/alerts`
- [ ] `yarn type-check` passes
- [ ] `yarn lint` passes
- [ ] `yarn test` passes
- [ ] No `console.log` in production code
- [ ] Manually tested (happy path + error cases)

## Before PR

Run `/tests`, then `/dlogs`, then `/pr`.
