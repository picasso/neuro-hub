# Refactor Code

Systematically refactor code following project rules, step by step with user confirmation.

---

## Step 1: Understand the task

Ask the user:

1. **What needs refactoring?** — which file(s), function, component, or specific lines?
2. **Why?** — performance, readability, rule violations, technical debt, adding new functionality?
3. **Scope and constraints** — can we change public APIs? Backward compatibility needed? Tests to preserve?
4. **Expected outcome** — what should improve? What must stay the same?

**Wait for answers before proceeding.**

---

## Step 2: Analyze current code

After user answers:

1. Read and analyze the target code
2. Find similar patterns in the codebase to understand conventions
3. Identify:
   - Rule violations (see CLAUDE.md)
   - Complexity / readability issues
   - Duplication
   - Performance problems
4. Present findings to user — wait for confirmation to proceed

---

## Step 3: Propose options

**Present 2–3 refactoring options:**

### Option 1: [Name]
**Changes:** list specific changes and affected files  
**Pros:** ...  
**Cons:** ...  
**Risk:** Low / Medium / High

### Option 2: [Name]
[same structure]

**Wait for explicit user choice before proceeding.**

---

## Step 4: Execute step by step

Break the chosen option into small steps. For each step:

1. Describe what will change (show before/after if helpful)
2. Get user approval
3. Make the change
4. Run `yarn type-check` — fix errors before next step
5. **Wait for "OK" before the next step**

One change at a time. If an error occurs, propose 2–3 fixes and wait for choice.

---

## Step 5: Verify

```bash
yarn type-check    # must pass
yarn lint          # must pass
yarn test          # must pass
```

Check circular dependencies if it was a major structural refactor:
```bash
dpdm --no-warning --no-tree './src/**/*.{ts,tsx}'
```

Manual testing: verify affected functionality, check edge cases.

---

## Step 6: Summarize and commit

Show:
- All modified files
- Summary of improvements
- Any breaking changes

If a task touches architecture, ask: "Should ARCHITECTURE-DECISIONS.md be updated?"

**Ask: "Ready to commit?"** and wait for explicit "yes" before committing.

---

## Rules to apply (from CLAUDE.md)

- `type` over `interface`, no `any`, no `enum`
- Functional patterns, no classes
- Early returns
- Named exports, `function` declarations (not `FC`)
- Single-line `//` comments, lowercase
- No `useState` for business data — use Effector
- No `useEffect` for data fetching — use Effector effects or Server Components
- Business logic in `features/` model files, not in React components
- User feedback through `@/alerts`, not `alert()`
- Prefer `Stack` over layout `div`; `@/ui` wrappers over raw markup

---

## Common refactoring patterns

**Extract component:**
```ts
// before: large component with multiple concerns
// after: smaller focused components
```

**Extract Effector model:**
```ts
// before: useState / useEffect for business data
// after: Effector store + effect in model.ts
```

**Extract utility:**
```ts
// before: duplicated logic in multiple places
// after: pure function in src/utils/
```

**Simplify conditionals:**
```ts
// before: nested if/else
// after: early returns and guard clauses
```

---

## Final checklist

- [ ] `yarn type-check` passes
- [ ] `yarn lint` passes
- [ ] `yarn test` passes
- [ ] No `console.log` in production code
- [ ] Manual testing done
- [ ] User approved for commit
