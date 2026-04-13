# AGENTS.md — NeuroGig

Configuration for AI coding agents. See also: [.cursor/rules/](.cursor/rules/)

---

## Project

**NeuroGig** — freelance marketplace for generative AI specialists.

- Two-sided marketplace (freelancers, clients)
- Specialization in generative AI
- Hugging Face Spaces demos
- Portfolio & skills verification
- Better Auth (OAuth, cookie sessions)

---

## Tech Stack

| Technology | Version |
|------------|---------|
| Next.js | 16+ (App Router) |
| React | 19.x |
| TypeScript | 5.9+ (strict) |
| PostgreSQL | 18.2.x |
| Kysely | 0.28+ (queries) |
| Knex | 3.x (migrations only) |
| Effector | 23+ |
| Zod | 4+ |
| Tailwind | 4.x |
| shadcn/ui | Radix primitives |

**Key libs:** Better Auth, Vercel Blob, Resend

---

## Commands

```bash
corepack enable
yarn install
yarn dev          # HMR — use during development
yarn lint
yarn type-check
yarn test
```

**Do not** run `yarn build` during agent sessions (disables HMR).

### Database

```bash
yarn db:migrate   # Run migrations
yarn db:test      # Test connection
yarn db:check     # Inspect DB
```

### Database Docs

- Structural schema map: `docs/db/schema.dbml`
- Semantic domain guide: `docs/db/DATABASE.md`
- Canonical SQL examples: `docs/db/queries/`

If a task changes database structure, auth schema usage, ownership, constraints, indexes, enum-like DB values, or canonical join paths, the agent must review and update the relevant DB docs before considering the task complete.

---

## File Organization

- Flat structure; `app/` contains thin route files only (import + re-export)
- `features/` — all business-logic components, imported via `@/features` or `@/features/server`
- `ui/` — all UI primitives, imported via `@/ui` barrel (never `@/ui/shadcn` directly)
- Only top-level barrels are allowed; do not create subfolder `index.ts` files inside feature folders
- Details: [.cursor/rules/file-organization.mdc](.cursor/rules/file-organization.mdc)

## File Structure

```zsh
src/
├── app/               # Thin routes: page.tsx = import + re-export only
│   └── api/           # API route handlers (logic allowed here)
├── features/          # Business-logic components
│   ├── home/
│   ├── dashboard/
│   ├── auth/
│   ├── onboarding/
│   ├── portfolio/
│   ├── freelancer-profile/
│   ├── playground/
│   ├── header.tsx
│   ├── footer.tsx
│   ├── index.ts       # client-safe barrel — import from '@/features'
│   └── server.ts      # server-only barrel — import from '@/features/server'
├── ui/                # UI primitives & design system
│   ├── shadcn/        # raw Radix/shadcn (INTERNAL — use '@/ui' barrel)
│   ├── providers/
│   ├── icons/
│   └── index.ts       # barrel — import from '@/ui'
├── alerts/            # Effector alert system
├── config/            # metadata, mocks
├── lib/               # auth, db, email, swagger, validations
├── stores/            # Effector stores
├── utils/             # pure utilities
└── types/             # shared TypeScript types

.cursor/
├── agents/            # Task-specific agents (see Available Agents)
├── mcp.json           # MCP servers (see table below)
├── rules/             # Project rules (.mdc)
│   ├── file-organization.mdc
│   ├── tech-stack.mdc
│   ├── react-nextjs.mdc
│   ├── tailwind4.mdc
│   ├── api-design.mdc
│   ├── effector.mdc
│   ├── develop.mdc
│   └── ...
└── skills/            # Railway, etc.
```

---

## Code Style

- **TypeScript:** strict mode, no `any`, prefer `type`
- **React:** Server Components by default; see `.cursor/rules/use-client.mdc` for `'use client'` placement rules
- **Tailwind CSS:** prefer Tailwind 4 patterns; see `.cursor/rules/tailwind4.mdc`
- **Page layout:** use `PageShell` presets (`form | content | wide | full`) for route-entry pages and `PageContainer` for inner width caps; see `.cursor/rules/page-shell.mdc`
- **Server Actions** for mutations, Zod for validation
- **Effector** for global state

Details: [.cursor/rules/code-style.mdc](.cursor/rules/code-style.mdc)

## Rule Routing

Use this routing when Cursor rule auto-application is unreliable:

- Reach for `.cursor/rules/effector.mdc` when the task is primarily about model/store architecture, unit naming, `sample()` orchestration, or domain structure.
- Reach for `.cursor/rules/develop.mdc` when the task is primarily about frontend anti-patterns, alert wiring, wrapper usage from `@/ui`, or deciding what logic should stay out of components.
- Base React/Next frontend invariants: `.cursor/rules/react-nextjs.mdc`
- Formatting and naming conventions: `.cursor/rules/code-style.mdc`
- API route and response conventions: `.cursor/rules/api-design.mdc`
- `'use client'` boundary rules: `.cursor/rules/use-client.mdc`
- Effector-specific patterns and syntax: `.cursor/rules/effector.mdc`
- Detailed frontend anti-patterns and examples: `.cursor/rules/develop.mdc`
- Page layout conventions: `.cursor/rules/page-shell.mdc`
- Testing guidance: `.cursor/rules/testing.mdc`
- Database script conventions: `.cursor/rules/db-scripts.mdc`
- Database documentation sync rules: `.cursor/rules/database-docs.mdc`

---

## Security

- Better Auth, session on every protected request
- **proxy** (`src/proxy.ts`) for route protection — not `middleware.ts`
- Zod for all input validation
- Parameterized queries (Kysely.sql)
- No secrets in code, no sensitive data in logs

Details: [.cursor/rules/security.mdc](.cursor/rules/security.mdc)

---

## Testing

- **Vitest** + Testing Library
- Test files: `*.test.ts`, `*.test.tsx`
- AAA pattern, mocks for external deps
- Coverage: aim 80% unit, all API endpoints covered

---

## PR & Commits

### Before commit

1. `yarn lint`
2. `yarn type-check`
3. `yarn test`

### Commit format

```zsh
<type>(<scope>): <description>

[optional body]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

---

## Available Agents

| Agent | Mode | Description |
|-------|------|-------------|
| `code-reviewer` | readonly | Security, performance, maintainability review |
| `test-engineer` | - | Unit, integration, e2e tests |
| `fullstack-dev` | - | Complete feature implementation |
| `api-gateway` | - | Public/private APIs with rate limiting |
| `mcp-builder` | - | MCP server creation |
| `cursor-expert` | readonly | Cursor IDE features, shortcuts, MCP config |

### Using Agents

```markdown
# Automatic delegation
Agent delegates based on description field

# Explicit invocation
/code-reviewer review my changes

# Parallel execution
/code-reviewer and /test-engineer analyze this feature
```

---

## MCP Servers (this project)

| Server | Purpose |
|--------|---------|
| Ref | Documentation search |
| context7 | Up-to-date library docs |
| filesystem | File read/write, search |
| firecrawl | Web scraping |
| github | Issues, PRs, code search |
| memory | Persistent knowledge graph |
| postgres | Direct DB queries |
| shadcn-ui | Component install |
| serena | Codebase analysis |

Config: [.cursor/mcp.json](.cursor/mcp.json)

---

## Workflow

```zsh
DEFINE → DESIGN → BUILD → VERIFY → SHIP
```

## Database Documentation Contract

When a task touches the database, agents and subagents must treat this as part of the implementation checklist:

1. Verify whether `docs/db/schema.dbml` needs structural updates
2. Verify whether `docs/db/DATABASE.md` needs semantic updates
3. Verify whether `docs/db/queries/` needs a new or updated canonical SQL example

Trust live schema and migrations first, then bring DB docs into sync.
