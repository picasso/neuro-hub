---
name: react-component
description: Generates production-ready React components with TypeScript, TailwindCSS styling, accessibility, and comprehensive tests. Use when creating new React components, UI elements, or when the user asks to build a component, widget, or UI feature.
metadata:
  version: "1.0.0"
  author: picasso
---

# React Component Generator

Create consistent, well-documented React components following project conventions.

## Instructions

### 1. Component Structure

```typescript
// component description

type ComponentNameProps {
  prop1: string  // optional prop description 
  prop2?: number
  className?: string // allow custom className
}

export function ComponentName({
  prop1,
  prop2 = 0,
  className
}: ComponentNameProps) {
  // implementation
}
```

### 2. Styling Guidelines

- Use TailwindCSS classes exclusively
- Support `className` prop for customization
- Use `cn` utility for conditional classes
- Ensure responsive design (mobile-first)
- Include focus and hover states

### 3. Component Types

| Type | Purpose |
|------|---------|
| Presentation | Pure UI, no business logic, highly reusable |
| Container | Manage state, handle data fetching, coordinate children |
| Form | Controlled inputs, Zod validation, error display |

### 4. Accessibility Requirements

- Proper ARIA attributes
- Keyboard navigation support (if feasible)
- Focus management
- Screen reader compatibility

### 5. Testing Requirements

- Render test (smoke test)
- Props validation
- User interaction tests
- Accessibility tests

## Output Files

1. `component-name.tsx` - Component implementation
2. `component-name.test.tsx` - Unit tests

## Example Prompt

```text
Generate a UserCard component that displays:
- User avatar (with fallback)
- User name and email
- Role badge
- Action buttons (edit, delete)

Support loading and error states.
Make it responsive for mobile and desktop.
```
