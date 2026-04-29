# Search Codebase First

Before implementing new functionality, thoroughly search the codebase for similar patterns and reusable code.

## Search strategy

### 1. Search for similar features

- Use grep/Glob for exact text or symbols
- Browse similar API patterns, components, validation schemas
- Search for similar functionality in `features/`, `ui/`, `lib/`

### 2. Key directories to check

- Business logic: `src/features/`
- API routes: `src/app/api/`
- DB queries: `src/lib/db/`
- Utilities: `src/utils/`
- Shared types: `src/types/`
- Validations: `src/lib/validations/`
- UI primitives: `src/ui/`
- Stores: `src/stores/`

### 3. Questions to answer

- Does similar functionality already exist?
- Can existing code be extended rather than duplicated?
- What patterns are used in the project?
- What libraries are already configured?

Present findings: what was found, how to reuse it, pros and cons of each approach. Wait for user's choice.

### 4. Before implementing

- [ ] Searched for similar features
- [ ] Checked existing patterns
- [ ] Identified reusable code
- [ ] Confirmed no duplication
- [ ] User confirmed the approach

---

## Common search patterns

```bash
# find a component
grep -r "export.*ComponentName" src/

# find API usage
grep -r "api/endpoint" src/

# find a type
grep -r "type UserX" src/types/

# find validation schema
grep -r "z.object" src/lib/validations/
```
