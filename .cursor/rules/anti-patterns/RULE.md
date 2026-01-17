---
name: Things to Avoid
description: This rule explicitly lists anti-patterns.
---

# Things to Avoid

## Never Do

- ❌ Use `any` type (use `unknown` and narrow)
- ❌ Disable ESLint rules without justification
- ❌ Use `var` (use `const` or `let`)
- ❌ Mutate state directly
- ❌ Use index as React key for dynamic lists
- ❌ Store sensitive data in localStorage
- ❌ Use synchronous file operations in API routes

## Deprecated Patterns (Legacy Code Only)

- `getServerSideProps` - use Server Components instead
- `pages/` directory - we've fully migrated to App Router
- `styled-components` - use `@emotion` instead
- `moment.js` - use `Day.js` or native Intl API

## Performance Anti-patterns

- Avoid `useEffect` for data fetching (use Effector stores or effects)
- Don't create objects/arrays in render (use useMemo)
- Never fetch in client components when server fetch is possible
