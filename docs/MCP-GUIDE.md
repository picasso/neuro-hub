# MCP.md — Complete Guide to Model Context Protocol

---

## Table of Contents

1. [Introduction to MCP](#introduction-to-mcp)
2. [Installing and Verifying MCP](#installing-and-verifying-mcp)
3. [Basic MCP Servers](#basic-mcp-servers)
4. [AI-oriented MCP](#ai-oriented-mcp)
5. [Specialized MCP](#specialized-mcp)
6. [Creating Custom MCP](#creating-custom-mcp)
7. [MCP Reliability Verification](#mcp-reliability-verification)
8. [Practical Assignments](#practical-assignments)

---

## Introduction to MCP

### What is MCP?

**Model Context Protocol (MCP)** is an open protocol for connecting external tools and data sources to AI assistants. MCP follows the "one server — many clients" principle: one MCP server can be used by different AI applications.

### Architecture

```zsh
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Cursor IDE    │     │   Claude.ai     │     │   Other AI      │
│   (Client)      │     │   (Client)      │     │   (Client)      │
└────────┬────────┘     └────────┬────────┘     └────────┬────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │      MCP Protocol       │
                    └────────────┬────────────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
         │                       │                       │
    ┌────▼────┐             ┌────▼────┐             ┌────▼────┐
    │ MCP     │             │ MCP     │             │ MCP     │
    │ Server  │             │ Server  │             │ Server  │
    │ (Files) │             │ (DB)    │             │ (API)   │
    └─────────┘             └─────────┘             └─────────┘
```

### MCP Components

| Component | Description |
|-----------|-------------|
| **Tools** | Functions that AI can call |
| **Resources** | Data that AI can read |
| **Prompts** | Predefined prompts |
| **Sampling** | AI requests for content generation |

---

## Installing and Verifying MCP

### Method 1: Via npx (recommended)

```bash
# Check MCP server availability
npx -y @modelcontextprotocol/server-filesystem --help

# Install to project (optional)
npm install @modelcontextprotocol/server-filesystem
```

### Method 2: From MCP Catalog

**Catalogs:**
- 🔗 https://mcpservers.org — official catalog
- 🔗 https://mcp-awesome.com — curated list

**Installation steps from catalog:**

1. **Find the needed MCP** in the catalog
2. **Study the documentation** on the MCP page
3. **Check requirements** (Node.js version, dependencies)
4. **Copy the configuration** for Cursor
5. **Add to `.cursor/mcp.json`**

### Method 3: From GitHub Repository

```json
{
  "mcpServers": {
    "custom-mcp": {
      "command": "npx",
      "args": ["-y", "github:username/mcp-server#main"]
    }
  }
}
```

### Configuration in Cursor

**File:** `.cursor/mcp.json`

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

---

## MCP Reliability Verification

### 🔒 Security Checklist

Before using an MCP server, check:

#### 1. Code Source

```bash
# Check GitHub repository
# - Star count (more = better)
# - Last commit (active development)
# - Issues and PRs (responsiveness to problems)
# - Authors (known organizations?)
```

#### 2. npm Package

```bash
# Check package
npm view @modelcontextprotocol/server-name

# Look at:
# - Download count
# - Dependencies (any suspicious ones)
# - Maintainers
# - Provenance (signature exists)
```

#### 3. Server Code

```bash
# Clone and study code
git clone https://github.com/org/mcp-server
cd mcp-server

# Check:
# - What the server does
# - What data it sends
# - No hardcoded secrets
# - Logging of sensitive data
```

#### 4. Permissions

```json
{
  "mcpServers": {
    "limited-server": {
      "command": "npx",
      "args": ["-y", "@server/mcp", "--readonly"],
      "env": {},
      "disabled": false,
      "limits": {
        "maxFileSize": "1MB",
        "allowedPaths": ["/specific/path"]
      }
    }
  }
}
```

### 🚨 Red Flags

| Sign | What to Do |
|------|------------|
| Closed source code | Don't use |
| Many dependents with suspicious names | Check each one |
| Obfuscated code | Don't use |
| Requesting secrets without necessity | Decline |
| Sending data to external servers | Study necessity |

---

## Basic MCP Servers

### 1. Filesystem MCP

**Package:** `@modelcontextprotocol/server-filesystem`

**Description:** Access to project filesystem.

**Tools:**

| Tool | Description |
|------|-------------|
| `read_file` | Read file |
| `write_file` | Write file |
| `list_directory` | List files in directory |
| `search_files` | Search files by pattern |
| `create_directory` | Create directory |
| `move_file` | Move file |
| `get_file_info` | File metadata |

**Configuration:**

```json
{
  "filesystem": {
    "command": "npx",
    "args": [
      "-y",
      "@modelcontextprotocol/server-filesystem",
      "${workspaceFolder}"
    ]
  }
}
```

#### 📝 Assignment 1.1: Project Structure Analysis

**Goal:** Learn to use filesystem MCP for project analysis.

**Input:**

```text
New project with unknown structure
```

**Prompt:**

```text
Using filesystem MCP, analyze the project structure:

1. Display directory tree (first 2 levels)
2. Find all TypeScript files
3. Find all configuration files (*.json, *.yaml, *.toml)
4. Identify main entry points
5. Create a project structure report

Output should be in format:
## Project Structure
[tree]

## Main Files
[list with description]

## Entry Points
[list]
```

**Expected Result:**
- Complete project structure tree
- List of configuration files
- Defined entry points

---

#### 📝 Assignment 1.2: Mass Refactoring

**Goal:** Use filesystem MCP for search and replace.

**Prompt:**

```text
Using filesystem MCP:

1. Find all files with imports from '@/lib/old'
2. Replace them with '@/lib/new'
3. Create a change report with file count
4. Don't modify node_modules and .next

IMPORTANT: First show what you'll change,
get confirmation, then modify.
```

**Bonus Assignment:**

```text
Add automatic backup file creation
for each modified file.
```

---

### 2. GitHub MCP

**Package:** `@modelcontextprotocol/server-github`

**Description:** GitHub API integration.

**Tools:**

| Tool | Description |
|------|-------------|
| `get_repo` | Repository information |
| `list_issues` | List of issues |
| `create_issue` | Create issue |
| `create_pull_request` | Create PR |
| `list_commits` | Commit history |
| `search_code` | Code search |
| `get_file_contents` | File contents |

**Configuration:**

```json
{
  "github": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-github"],
    "env": {
      "GITHUB_TOKEN": "${env:GITHUB_TOKEN}"
    }
  }
}
```

**Requirements:**
- GitHub Personal Access Token
- Scopes: `repo`, `read:org`, `write:discussion`

#### 📝 Assignment 2.1: Repository Analysis

**Prompt:**

```text
Using GitHub MCP:

1. Get repository information [owner/repo]
2. Find last 10 issues with "bug" label
3. Display recent commits
4. Find README file and show contents
5. Create summary report

Output format:
## Repository: [name]
[info]

## Recent Bugs
[issues with links]

## Activity
[commits]
```

---

#### 📝 Assignment 2.2: Creating Issues from Code

**Prompt:**

```text
Using GitHub MCP and filesystem MCP:

1. Scan code for TODO comments
2. For each TODO:
   - Create issue with description
   - Specify file and line
   - Add "todo" label
3. Display list of created issues

Example TODO:
// TODO(auth): Add rate limiting to login endpoint
```

---

### 3. PostgreSQL MCP

**Package:** `@modelcontextprotocol/server-postgres`

**Description:** Direct PostgreSQL interaction.

**Tools:**

| Tool | Description |
|------|-------------|
| `query` | Execute SQL query |
| `list_tables` | List tables |
| `describe_table` | Table structure |
| `get_schema` | Database schema |

**Configuration:**

```json
{
  "postgres": {
    "command": "npx",
    "args": [
      "-y",
      "@modelcontextprotocol/server-postgres",
      "${env:DATABASE_URL}"
    ]
  }
}
```

#### 📝 Assignment 3.1: DB Schema Analysis

**Prompt:**

```text
Using PostgreSQL MCP:

1. Display all tables in database
2. For each table show:
   - Columns with types
   - Foreign keys
   - Indexes
3. Find potential issues:
   - Missing indexes on foreign keys
   - Tables without primary key
   - Unused tables
4. Generate optimization recommendations
```

---

#### 📝 Assignment 3.2: Data Migration Analysis

**Prompt:**

```text
Using PostgreSQL MCP and Prisma schema:

1. Compare Prisma schema with actual DB structure
2. Find differences:
   - New columns in Prisma
   - Removed columns
   - Changed types
3. Generate SQL migration for synchronization
4. Check for breaking changes
```

---

### 4. Memory MCP

**Package:** `@modelcontextprotocol/server-memory`

**Description:** Persistent memory between sessions.

**Tools:**

| Tool | Description |
|------|-------------|
| `store` | Save data |
| `retrieve` | Get data |
| `list_keys` | List keys |
| `delete` | Delete data |

**Use Cases:**
- Remembering user preferences
- Caching analysis results
- Storing project context

#### 📝 Assignment 4: Persistent Context

**Prompt:**

```text
Using Memory MCP:

1. Create structure for storing:
   - Code style preferences
   - Frequently used patterns
   - Component templates

2. Implement functions:
   - save_preference(key, value)
   - get_preference(key)
   - apply_preferences_to_code(code)

3. Test saving and restoration
```

---

## AI-oriented MCP

### 5. Serena MCP

**Package:** `serena` (via uvx)

**Description:** Deep codebase analysis with AI.

**Capabilities:**
- Context-dependent analysis
- Intelligent refactoring
- Documentation generation
- Pattern detection

**Configuration:**

```json
{
  "serena": {
    "command": "uvx",
    "args": [
      "--from",
      "git+https://github.com/oraios/serena",
      "serena",
      "start-mcp-server",
      "--context",
      "ide-assistant"
    ]
  }
}
```

#### 📝 Assignment 5: Architecture Analysis

**Prompt:**

```text
Using Serena MCP:

1. Conduct project architecture analysis:
   - Main modules and their connections
   - Design patterns
   - Extension points

2. Identify problems:
   - Circular dependencies
   - Tightly coupled modules
   - SOLID principle violations

3. Suggest improvements:
   - Refactoring
   - New abstractions
   - Responsibility separation

Output format:
## Architecture Analysis
### Modules
[dependency diagram]

### Problems
[prioritized list]

### Recommendations
[concrete suggestions]
```

---

### 6. Context7 MCP

**Package:** `@context7/mcp-server`

**Description:** Context management for large projects.

**Capabilities:**
- Intelligent information compression
- Context prioritization
- Token budget management

#### 📝 Assignment 6: Context Optimization

**Prompt:**

```text
Using Context7 MCP:

1. Analyze current project context
2. Determine critical and non-critical parts
3. Create compressed version for:
   - New developer (onboarding)
   - Code review session
   - Feature planning

Goal: Fit project description in 2000 tokens
without losing critical information.
```

---

### 7. Web to MCP

**Package:** `@anthropic-ai/web-to-mcp`

**Description:** Web content conversion to MCP format.

**Capabilities:**
- Documentation parsing
- Code example extraction
- Information structuring

#### 📝 Assignment 7: Documentation Import

**Prompt:**

```text
Using Web to MCP:

1. Import React 19 documentation:
   - Server Components
   - Actions
   - Hooks changes

2. Convert to structured format:
   - Concepts with examples
   - API reference
   - Migration guide

3. Create local knowledge base in .cursor/knowledge/
```

---

### 8. Ref MCP

**Package:** `@anthropic-ai/ref-mcp`

**Description:** Reference and dependency analysis.

**Capabilities:**
- Dependency graph
- Usage search
- Change impact

#### 📝 Assignment 8: Impact Analysis

**Prompt:**

```text
Using Ref MCP:

1. Find all usages of validateUser function
2. Build dependency graph
3. Determine impact of changes to this function:
   - Direct dependencies
   - Indirect dependencies
   - Tests that need updating

4. Suggest safe refactoring plan
```

---

## Specialized MCP

### 9. Figma MCP

**URL:** `https://mcp.figma.com/mcp`

**Description:** Figma Design System integration.

**Capabilities:**
- Design token import
- Component generation from designs
- Color, typography synchronization

**Configuration:**

```json
{
  "figma": {
    "url": "https://mcp.figma.com/mcp",
    "headers": {
      "Authorization": "Bearer ${env:FIGMA_ACCESS_TOKEN}"
    }
  }
}
```

#### 📝 Assignment 9: Design Tokens Sync

**Prompt:**

```text
Using Figma MCP:

1. Connect to Figma file [file-id]
2. Extract design tokens:
   - Colors (primary, secondary, semantic)
   - Typography (font sizes, weights, line heights)
   - Spacing (margins, paddings)
   - Border radius

3. Generate:
   - tailwind.config.ts with tokens
   - CSS variables
   - TypeScript types

4. Create Button component based on design spec
```

---

### 10. Magic UI MCP (21st.dev)

**Package:** `@21st-dev/magic`

**Description:** UI component generation.

**Configuration:**

```json
{
  "@21st-dev/magic": {
    "command": "npx",
    "args": ["-y", "@21st-dev/magic@latest"],
    "env": {
      "MAGIC_API_KEY": "${env:MAGIC_API_KEY}"
    }
  }
}
```

#### 📝 Assignment 10: Component Generation

**Prompt:**

```text
Using Magic UI MCP:

1. Generate animated component:
   - Card with hover effect
   - Skeleton loader
   - Toast notifications

2. Requirements:
   - TailwindCSS styles
   - Accessibility (ARIA)
   - Responsive design
   - Dark mode support

3. Write tests for each component
```

---

### 11. Playwright MCP

**Package:** `@playwright/mcp`

**Description:** E2E testing via MCP.

**Configuration:**

```json
{
  "playwright": {
    "command": "npx",
    "args": ["-y", "@playwright/mcp@latest"]
  }
}
```

#### 📝 Assignment 11: E2E Testing

**Prompt:**

```text
Using Playwright MCP:

1. Launch browser and open http://localhost:3000
2. Execute registration scenario:
   - Click "Sign Up"
   - Fill form
   - Submit
   - Check redirect

3. Collect metrics:
   - Page load time
   - DOM size
   - Network requests

4. Save screenshots of each step
```

---

### 12. Chrome DevTools MCP

**Package:** `chrome-devtools-mcp`

**Description:** Debugging via Chrome DevTools.

**Configuration:**

```json
{
  "chrome-devtools": {
    "command": "npx",
    "args": ["-y", "chrome-devtools-mcp@latest"],
    "env": {
      "CHROME_PATH": "${env:CHROME_PATH}"
    }
  }
}
```

#### 📝 Assignment 12: Performance Debugging

**Prompt:**

```text
Using Chrome DevTools MCP:

1. Connect to Chrome
2. Open application
3. Conduct performance profiling:
   - CPU usage
   - Memory leaks
   - Rendering performance

4. Find bottlenecks:
   - Slow functions
   - Layout thrashing
   - Long tasks

5. Suggest optimizations
```

---

### 13. Nx MCP

**Package:** `nx`

**Description:** Monorepo management.

**Configuration:**

```json
{
  "nx-mcp": {
    "command": "npx",
    "args": ["nx", "mcp"]
  }
}
```

#### 📝 Assignment 13: Monorepo Management

**Prompt:**

```text
Using Nx MCP:

1. Analyze monorepo structure
2. Build dependency graph between:
   - Apps
   - Libs

3. Optimize:
   - Find duplicate dependencies
   - Suggest lib splitting
   - Check affected projects

4. Generate new shared library
```

---

## Creating Custom MCP

### MCP Server Structure

```text
my-mcp-server/
├── package.json
├── tsconfig.json
├── src/
│   ├── index.ts          # Entry point
│   ├── tools/            # Tool definitions
│   │   ├── query.ts
│   │   └── mutate.ts
│   └── resources/        # Resource definitions
│       └── schema.ts
└── README.md
```

### Basic Template

```typescript
// src/index.ts
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

const server = new Server(
  { name: 'my-mcp-server', version: '1.0.0' },
  { capabilities: { tools: {}, resources: {} } }
);

// Register tools
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'my_tool',
      description: 'Description of what it does',
      inputSchema: {
        type: 'object',
        properties: {
          param: { type: 'string', description: 'Parameter description' }
        },
        required: ['param']
      }
    }
  ]
}));

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === 'my_tool') {
    const { param } = request.params.arguments;
    // Do something
    return {
      content: [{ type: 'text', text: `Result: ${param}` }]
    };
  }
  throw new Error('Unknown tool');
});

// Start server
const transport = new StdioServerTransport();
await server.connect(transport);
```

### 📝 Assignment: Creating Stripe API MCP

**Goal:** Create an MCP server for Stripe integration.

**Requirements:**

```yaml
name: Stripe MCP Server
tools:
  - create_customer
  - get_customer
  - create_subscription
  - cancel_subscription
  - list_invoices

security:
  - Uses STRIPE_SECRET_KEY
  - Validates all inputs
  - Logs operations
  - Rate limiting
```

**Prompt:**

```text
Create an MCP server for Stripe API:

1. Create project structure
2. Implement tools:
   - create_customer(email, name)
   - get_customer(customer_id)
   - create_subscription(customer_id, price_id)
   - cancel_subscription(subscription_id)
   - list_invoices(customer_id)

3. Add:
   - Input validation with Zod
   - Error handling
   - Logging
   - Rate limiting

4. Write README with installation

5. Publish as npm package
```

---

## Practical Assignments

### 🎯 Comprehensive Assignment: Multi-API MCP

**Goal:** Create an MCP server working with multiple providers.

**Requirements:**

```text
Create MCP for email providers:

Providers:
- SendGrid
- Mailgun  
- Postmark
- AWS SES

Tools:
- send_email(to, subject, body)
- send_template(to, template_id, data)
- get_delivery_status(message_id)
- list_templates()

Configuration:
{
  "provider": "sendgrid",
  "providers": {
    "sendgrid": { "api_key": "...", "from": "..." },
    "mailgun": { "api_key": "...", "domain": "..." }
  }
}
```

**Prompt:**

```text
Create an email MCP server with multiple provider support:

1. Abstract EmailProvider interface
2. Implementations for each provider
3. Provider factory pattern
4. Fallback mechanism
5. Unified API for all providers

Documentation:
- Installation
- Configuration
- API reference
- Error handling
```

---

### 🎯 Assignment: Public vs Private API MCP

**Goal:** Create an MCP for working with public and private API.

**Task:**

```text
Create an MCP server for SaaS platform with two API types:

PUBLIC API (no authentication):
- get_public_products()
- get_product_details(id)
- search_products(query)

PRIVATE API (with authentication):
- get_user_profile()
- update_user_profile(data)
- get_user_orders()
- create_order(items)

Requirements:
- API key for public API
- OAuth for private API
- Rate limiting
- Error handling
- Documentation
```

---

### 🎯 Assignment: AI Protocol Usage

**Goal:** Master AI protocols through MCP.

**Protocols to study:**
1. **Model Context Protocol (MCP)** — context exchange
2. **Agent-to-Agent Protocol** — agent interaction
3. **Tool Use Protocol** — tool invocation

**Prompt:**

```text
Implement a system using AI protocols:

1. MCP Protocol:
   - Create MCP server with tools
   - Connect to Cursor
   - Call tools from prompt

2. Agent-to-Agent:
   - Create two agents
   - Set up communication between them
   - Implement task requiring coordination

3. Tool Use:
   - Define tools with JSON schema
   - Implement their invocation
   - Handle results

Example scenario:
Agent A analyzes code -> MCP tool call ->
Agent B generates tests -> MCP tool call ->
Agent C creates PR
```

---

## MCP and Skills Catalogs

### Official Catalogs

| Resource | URL | Description |
|----------|-----|-------------|
| MCP Servers | https://mcpservers.org | Official MCP catalog |
| MCP Awesome | https://mcp-awesome.com | Curated list |
| Skills.sh | https://skills.sh | Skills repository |
| SkillsMP | https://skillsmp.com | Skills marketplace |

### Installing Skills from Repository

```bash
# From skills.sh
npx skills install @org/skill-name

# From skillsmp.com
npx skillsmp install skill-name
```

### Adding Skill to Project

```bash
# Clone skill
git clone https://github.com/org/skill-repo .cursor/skills/skill-name

# Or create symlink
ln -s ~/skills/my-skill .cursor/skills/my-skill
```
