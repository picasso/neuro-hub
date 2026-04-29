# Check Circular Dependencies

Detect and resolve circular dependencies using `dpdm`.

## Steps

### 1. Run check

```bash
dpdm --no-warning --no-tree './src/**/*.{ts,tsx}'
```

Or for a specific path:
```bash
dpdm --no-warning './src/path/to/file.ts'
```

### 2. Analyze results

- Review all detected circular chains
- Check if cycles affect runtime or only types
- Group related circular dependencies

### 3. Categorize by severity

- **Critical** — core business logic, data flows
- **Medium** — utility functions, shared hooks
- **Low** — type-only imports, dev utilities

Present findings and discuss with user.

### 4. Plan resolution

Propose 2–3 options per cycle, wait for user's choice:

- Extract shared types/interfaces to a separate `types.ts`
- Move common logic to a new intermediate module
- Use dependency injection (pass as props instead of importing)
- Use dynamic imports for non-critical paths

### 5. Fix systematically

- Fix one cycle at a time
- Re-run `dpdm` after each fix
- Confirm no new cycles introduced
- Get confirmation before next fix

### 6. Verify

```bash
dpdm --no-warning --no-tree './src/**/*.{ts,tsx}'
yarn type-check
yarn lint
```

---

## Common resolution patterns

**Extract shared types:**
```ts
// before: A imports B, B imports A (types)
// after: both import from shared types.ts
```

**Create intermediate module:**
```ts
// before: ComponentA ↔ ComponentB
// after: ComponentA → shared.ts ← ComponentB
```

**Dependency injection:**
```ts
// pass dependencies as props instead of direct imports
```

**Lazy import:**
```ts
const module = await import('./module')
```

---

## Useful dpdm options

- `--no-warning` — hide warnings, show only errors
- `--no-tree` — skip dependency tree
- `--circular` — show only circular deps
- `--exit-code circular:1` — exit 1 if circular deps found

---

## Checklist

- [ ] Circular dependencies identified and categorized
- [ ] Resolution strategy approved by user
- [ ] Cycles resolved one by one
- [ ] `yarn type-check` passes
- [ ] `yarn lint` passes
- [ ] No new circular dependencies introduced
- [ ] Functionality tested
