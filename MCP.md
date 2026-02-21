# MCP — Model Context Protocol

MCP connects external tools and data to AI assistants. One server can serve multiple clients (Cursor, Claude, etc.).

📖 **Full guide:** [docs/MCP-GUIDE.md](docs/MCP-GUIDE.md) — installation, servers, assignments

---

## This Project

**Config:** [.cursor/mcp.json](.cursor/mcp.json)

| Server | Purpose |
|--------|---------|
| **Ref** | Documentation search (ref.tools) |
| **context7** | Up-to-date library docs |
| **filesystem** | File read/write, search |
| **firecrawl** | Web scraping, content extraction |
| **github** | Issues, PRs, code search |
| **memory** | Persistent knowledge graph |
| **postgres** | Direct DB queries |
| **shadcn-ui** | Component install, search |
| **serena** | Codebase analysis, refactoring |

---

## Adding MCP

### 1. Find server

- [mcpservers.org](https://mcpservers.org) — official catalog
- [mcp-awesome.com](https://mcp-awesome.com) — curated list

### 2. Add to .cursor/mcp.json

```json
{
  "mcpServers": {
    "server-name": {
      "command": "npx",
      "args": ["-y", "@package/mcp-server"],
      "env": {
        "API_KEY": "${env:API_KEY}"
      },
      "disabled": false
    }
  }
}
```

### 3. Restart Cursor

---

## Security Checklist

Before using an MCP server:

1. **Source** — GitHub stars, last commit, maintainers
2. **npm** — `npm view @package/name` (downloads, deps)
3. **Code** — what data it sends, no hardcoded secrets
4. **Permissions** — minimal required

**Red flags:** closed source, obfuscated code, requests secrets without need

---

## Basic Servers (examples)

| Server | Package | Use |
|--------|---------|-----|
| Filesystem | `@modelcontextprotocol/server-filesystem` | File read/write, search |
| GitHub | `@modelcontextprotocol/server-github` | Issues, PRs, code search |
| Postgres | `@modelcontextprotocol/server-postgres` | Direct DB queries |
| Memory | `@modelcontextprotocol/server-memory` | Persistent context |

---

## From GitHub

```json
{
  "mcpServers": {
    "custom": {
      "command": "npx",
      "args": ["-y", "github:owner/repo#main"]
    }
  }
}
```

---

## Skills

- [skills.sh](https://skills.sh) — Skills repository
- Skills live in `.cursor/skills/` (local) or installed via catalog
