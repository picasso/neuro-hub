# Code Style & Conventions

## TypeScript
- Strict mode, no explicit `any`
- Prefer `type` imports: `import type { X } from '...'`
- Unused args/vars: prefix with `_`

## Naming
- camelCase for variables/functions
- PascalCase for components/types
- Import order: builtin → external → internal → parent → sibling; alphabetized

## ESLint rules
- prefer-const, no-var, object-shorthand
- effector/* scope rules
- react/no-array-index-key: error
- no-console: warn (allow warn/error)

## Structure
- Use MUI components from ui-theme (theme.ts, feedback.ts, components.ts)
- Effector for state; patronum for helpers
