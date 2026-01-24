# Check Circular Dependencies

## Overview
Detect and resolve circular dependencies in the codebase using dpdm.

## Steps

1. **Run circular dependency check**
   - Execute: `dpdm --no-warning --no-tree './src/**/*.{ts,tsx}'`
   - Or specific path: `dpdm --no-warning './src/path/to/file.ts'`
   - Check for "Circular dependencies" in output

2. **Analyze results**
   - Review all detected circular chains
   - Identify most critical cycles (core modules)
   - Check if cycles affect runtime or only types
   - Group related circular dependencies

3. **Categorize by severity**
   - **Critical**: Core business logic, data flows
   - **Medium**: Utility functions, shared hooks
   - **Low**: Type-only imports, dev utilities
   - Discuss findings with user

4. **Plan resolution strategy**
   - Extract shared interfaces/types to separate file
   - Move common logic to new intermediate module
   - Use dependency injection pattern
   - Consider lazy imports for non-critical paths
   - Present 2-3 solution options to user
   - Wait for user's choice

5. **Fix systematically**
   - Start with most critical cycles
   - Fix one circular dependency at a time
   - Re-run dpdm after each fix
   - Ensure no new cycles introduced
   - Get confirmation from user before next fix

6. **Verify resolution**
   - Run: `dpdm --no-warning --no-tree './src/**/*.{ts,tsx}'`
   - Check: `yarn type-check`
   - Check: `yarn lint:ci`
   - Test affected functionality
   - Confirm no runtime issues

## Common Resolution Patterns

### Extract shared types

```typescript
// before: A imports B, B imports A (types)
// after: Create types.ts, both import from types.ts
```

### Create intermediate module

```typescript
// before: ComponentA ↔ ComponentB
// after: ComponentA → shared.ts ← ComponentB
```

### Use dependency injection

```typescript
// pass dependencies as props instead of direct imports
```

### Lazy imports

```typescript
// use dynamic imports for non-critical paths
const module = await import('./module');
```

## Useful dpdm Options
- `--no-warning` - Hide warnings, show only errors
- `--no-tree` - Skip dependency tree output
- `--circular` - Only show circular dependencies
- `--context path` - Set root directory context
- `--transform` - Transform code before analysis
- `--exit-code circular:1` - Exit with code 1 if circular deps found

## Check Specific Areas
- Core modules: `dpdm './src/lib/**/*.ts'`
- Components: `dpdm './src/components/**/*.tsx'`
- API routes: `dpdm './src/app/api/**/*.ts'`
- Single file: `dpdm './src/path/to/file.ts'`

## Checklist
- [ ] Circular dependencies identified
- [ ] Severity assessed
- [ ] Resolution strategy planned
- [ ] User approved approach
- [ ] Cycles resolved one by one
- [ ] Type checking passes
- [ ] Linter passes
- [ ] No new circular dependencies
- [ ] Functionality tested

## Prevention
- Review imports during code review
- Keep module boundaries clear
- Avoid bidirectional dependencies
- Use barrel exports carefully
- Consider architecture before coding
