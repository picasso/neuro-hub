# Codebase Structure

```zsh
src/
  app/          - Next.js App Router (routes, layout)
  components/   - React components
    ui/         - base UI (buttons, links, portfolio, footer)
    ui-theme/   - MUI theme (theme.ts, components.ts, feedback.ts)
    features/   - feature-specific (home, hero-section)
  lib/          - db, auth, logger, utils
  server/       - API handlers
  stores/       - Effector stores
  config/       - app config
  middleware/   - Next.js middleware
  types/        - TypeScript types
```

Key: Use `@/` path alias for imports from src.
