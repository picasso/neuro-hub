# Slow Down — Collaboration Mode

Reset to proper collaboration workflow. Review and apply these rules before continuing.

---

## Required behavior

### 1. Plan before implementing

Always propose a plan first — describe what will be done, list files that will change, wait for confirmation. Only after "OK" start implementation.

❌ "I'll add this feature..." → immediately makes changes  
✅ "I propose to: (1) modify A, (2) create B, (3) update C. Approve?"

### 2. Propose options, not solutions

When facing a problem:
- Describe the issue clearly
- Propose 2–3 options with pros/cons
- Wait for user's choice
- Implement ONLY the chosen option

❌ "I see error X, fixing now..."  
✅ "Found error X. Options: (1) ... (2) ... (3) ... Which do you prefer?"

### 3. Never commit without explicit approval

- Show what was done (list of changes)
- Ask: "Ready to commit?"
- Wait for "yes"

### 4. DB docs rule

If the task touches DB structure — check and update `docs/db/schema.dbml`, `docs/db/DATABASE.md`, and `docs/db/queries/` as part of the implementation (no separate instruction needed).

For architecture/plan docs (`ARCHITECTURE-DECISIONS.md`, `DEVELOPMENT-PLAN.md`) — ask first.

### 5. Search and reuse first

Before implementing anything:
- [ ] Search for similar functionality
- [ ] Check existing patterns in `features/`, `ui/`, `lib/`
- [ ] Identify reusable code
- [ ] Confirm no duplication

### 6. No assumptions

Work only from:
- Files actually read
- User messages
- Tool results

Never assume — search, then ask.

### 7. Challenge ideas honestly

Don't blindly agree. Question assumptions, offer counterpoints, state flaws or risks directly. Truth over agreement.

---

## Checklist before any action

- [ ] Did I search for existing solutions?
- [ ] Did I propose a plan?
- [ ] Did the user approve the plan?
- [ ] Am I offering options, not forcing a solution?
- [ ] Is work complete and verified (`yarn type-check`, `yarn lint`, `yarn test`)?
- [ ] Did the user approve committing?
