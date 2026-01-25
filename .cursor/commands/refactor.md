# Refactor Code

## Overview
Systematic code refactoring following project rules with step-by-step execution and testing.

## CRITICAL
It is better to give answers in Russian if possible.

## STEP 1: Review Project Rules

Before starting, review key rules:

### Code Style Rules
- TypeScript, prefer types over interfaces
- No enums, use Unions
- Functional and declarative patterns, avoid classes
- Descriptive variable names (isLoading, hasError)
- Early returns for readability
- Named exports for components (except Next.js pages/layouts)
- Single-line comments, lowercase
- 4 spaces indentation, tabs, single quotes, no semicolons
- 100 character line limit
- Files under 300 lines

### Architecture Rules
- Feature-based organization in `components/features/`
- Database queries through `lib/db/`
- Business logic in `server/services/`, not API routes
- Shared types in `types/`
- Components: `ui/`, `forms/`, `features/`
- Styles and css in `ui-theme/`

### Anti-Patterns to Avoid
- ❌ `any` type (use `unknown`)
- ❌ Disable ESLint without justification
- ❌ Mutate state directly
- ❌ Index as React key
- ❌ `useEffect` for data fetching (use Effector)
- ❌ Create objects/arrays in render (use useMemo)

### Import Order (auto-sorted by ESLint)
1. builtin (Node.js)
2. external (npm packages)
3. internal (@/ aliases)
4. parent (../)
5. sibling (./)
6. index
7. type
**NO empty lines between groups**

## STEP 2: Understand Current Code

**Ask user these questions:**

1. **What code needs refactoring?**
   - Which file(s)?
   - Which function/component?
   - Specific lines or entire file?

2. **Why refactor?**
   - Performance issue?
   - Readability/maintainability?
   - Rule violations?
   - Add new functionality?
   - Technical debt?

3. **Scope and constraints?**
   - Can we change API/interfaces?
   - Must maintain backward compatibility?
   - Are there tests to preserve?
   - Time/risk constraints?

4. **Expected outcome?**
   - What should be improved?
   - What must stay the same?
   - Any specific patterns to use?

**Wait for user's answers before proceeding**
This is important!

## STEP 3: Analyze Current Code

After user answers:

1. **Read and analyze target code**
   - Identify issues and violations
   - Check dependencies
   - Review related files
   - Find similar patterns in codebase

2. **Document findings**
   - List rule violations
   - Note complexity issues
   - Identify duplication
   - Spot performance problems

3. **Present analysis to user**
   - Show what you found
   - Explain severity of each issue
   - Wait for confirmation to proceed

## STEP 4: Propose Refactoring Plan

**Present 2-3 refactoring options:**

### Option 1: [Name]
**Changes:**
- List specific changes
- Files affected

**Pros:**
- Benefit 1
- Benefit 2

**Cons:**
- Downside 1
- Downside 2

**Risk level:** Low/Medium/High

### Option 2: [Name]
[Same structure]

### Option 3: [Name]
[Same structure]

**Ask user to choose an option**
**Wait for explicit confirmation**

## STEP 5: Execute Refactoring Step-by-Step

For chosen option, break down into small steps:

### Step 5.1: [First change]
- Describe what will be changed
- Show before/after code snippets
- Get user approval
- Make the change
- Verify no TypeScript errors
- **Wait for "OK" before next step**

### Step 5.2: [Second change]
[Same process]

### Step 5.3: [Continue...]
[Keep breaking down until complete]

**Important:**
- One change at a time
- Check TypeScript after each step
- Check linter after each step
- Get confirmation before next step
- If error occurs, propose 2-3 fixes

## STEP 6: Test Results

After all changes complete:

1. **Run type check**
   - Execute: `yarn type-check`
   - Show results
   - Fix any errors if found

2. **Run linter**
   - Execute: `yarn lint:ci`
   - Show results
   - Fix violations if found

3. **Check circular dependencies** (if major refactor)
   - Execute: `dpdm --no-warning --no-tree './src/**/*.{ts,tsx}'`
   - Show results
   - Fix if circular deps introduced

4. **Run tests**
   - Execute: `yarn test`
   - Show results
   - Fix failing tests or update if logic changed

5. **Check logs**
   - Browser console (if UI component)
   - Server logs (if API/backend)
   - Look for runtime errors
   - Verify no warnings

6. **Manual testing**
   - Test affected functionality
   - Verify behavior unchanged (or improved)
   - Check edge cases
   - Get user confirmation

## STEP 7: Review and Document

1. **Summary of changes**
   - List all modified files
   - Summarize improvements
   - Note any breaking changes

2. **Ask about documentation**
   - Should we update `ARCHITECTURE-DECISIONS.md`?
   - Update component/function docs?
   - Add comments for complex logic?

3. **Verify against rules**
   - [ ] Follows code style rules
   - [ ] Follows architecture rules
   - [ ] No anti-patterns
   - [ ] Imports properly ordered
   - [ ] Files under 300 lines
   - [ ] TypeScript errors resolved
   - [ ] Linter passes
   - [ ] Tests pass
   - [ ] Logs clean

## STEP 8: Prepare for Commit

**Ask user:**
"Refactoring complete. Changes:
- [List files modified]
- [Summary of improvements]

Ready to commit?"

Wait for explicit "yes" before committing!

## Refactoring Checklist

Before each change:
- [ ] Reviewed relevant project rules
- [ ] Understood current code
- [ ] Asked clarifying questions
- [ ] Proposed multiple options
- [ ] Got user approval for plan
- [ ] Making changes step-by-step
- [ ] Getting confirmation after each step
- [ ] Testing after each change
- [ ] Verified no regressions

After completion:
- [ ] Type check passes
- [ ] Linter passes
- [ ] Tests pass
- [ ] Logs clean
- [ ] Manual testing done
- [ ] Documentation updated
- [ ] User approved for commit

## Common Refactoring Patterns

### Extract Component/Functionality

```typescript
// before: large component or functionality with multiple concerns
// after: split into smaller focused functionality or components
```

### Extract Hook

```typescript
// before: logic inside component
// after: custom hook with clear interface
```

### Extract Utility

```typescript
// before: duplicated logic in multiple places
// after: pure function in utils/
```

### Move to Store (Effector)

```typescript
// before: useState and useEffect for data
// after: Effector store with effects
```

### Simplify Conditionals

```typescript
// before: nested if/else
// after: early returns, guard clauses
```

**Remember: Small steps, constant verification, user confirmation**
important!
