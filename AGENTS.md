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

---

## File Structure

```zsh
.cursor/
├── agents/            # Task-specific agents (see Available Agents)
├── mcp.json           # MCP servers (see table below)
├── rules/             # Project rules (.mdc)
│   ├── tech-stack.mdc
│   ├── react-nextjs.mdc
│   ├── api-design.mdc
│   ├── effector.mdc
│   ├── develop.mdc
│   └── ...
└── skills/            # Railway, etc.
```

---

## Code Style

- **TypeScript:** strict mode, no `any`, prefer `type`
- **React:** Server Components by default, `'use client'` only when needed
- **Server Actions** for mutations, Zod for validation
- **Effector** for global state

Details: [.cursor/rules/code-style.mdc](.cursor/rules/code-style.mdc)

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

- **Jest** + Testing Library
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
