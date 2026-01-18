---
name: Code Style Guide
description: This rule defines your formatting preferences.
---

# Code Implementation Guidelines

Follow these rules when you write code:

- Write concise, technical TypeScript code with accurate examples.
- Use TypeScript for all code; prefer types over interfaces.
- Avoid enums; use Unions instead.
- Use functional and declarative programming patterns; avoid classes.
- Prefer iteration and modularization over code duplication.
- Use descriptive variable names with auxiliary verbs (e.g., isLoading, hasError).
- Use a “on” prefix for event functions like “onClick” for onClick and “onKeyDown” for onKeyDown.
- Favor named exports for components.
- Use early returns whenever possible to make the code more readable.
- Implement accessibility features on elements. For example, a tag should have a tabindex=“0”, aria-label, on:click, and on:keydown, and similar attributes.
- Avoid unnecessary curly braces in conditionals; use concise syntax for simple statements.

## Formatting (enforced by ESLint + Prettier)

- 4 spaces for indentation
- Use tabs
- Single quotes for strings
- No semicolons
- 100 character line limit
- Trailing commas in multi-line structures

## File Naming Conventions

- Code files and folders: kebab-case (user-profile.tsx, use-auth.ts)
- Markdown documentation files: SCREAMING-KEBAB-CASE (README.md, MVP.md, ARCHITECTURE-DECISIONS.md)

## Naming Conventions

- Components: PascalCase (kebab-case for filename user-profile.tsx)
- Hooks: camelCase with 'use' prefix (kebab-case for filename use-auth.ts)
- Utilities: camelCase (kebab-case for filename format-сurrency.ts)
- Types: PascalCase with descriptive suffix (UserCreateInput)
- Constants: SCREAMING_SNAKE_CASE

## Component Structure

Always structure React components in this order:

1. Type definitions
2. Component function
3. Hooks (in order: state, refs, effects)
4. Event handlers
5. Render helpers
6. Return statement

## Import Order

1. React and Next.js
2. Third-party libraries
3. Internal aliases (@/components, @/lib)
4. Relative imports
5. Styles
  