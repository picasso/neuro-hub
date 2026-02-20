# SKILLS.md — Complete Guide to Creating Skills

---

## Table of Contents

1. [Introduction to Skills](#introduction-to-skills)
2. [Skill Structure](#skill-structure)
3. [Basic Skills Library](#basic-skills-library)
4. [Step-by-Step Skill Creation](#step-by-step-skill-creation)
5. [Installing Skills from Repositories](#installing-skills-from-repositories)
6. [Verifying Skill Reliability](#verifying-skill-reliability)
7. [Practical Assignments](#practical-assignments)

---

## Introduction to Skills

### What is a Skill?

A **Skill** is a reusable set of instructions, templates, and code examples that enables AI to generate consistent code according to your standards and patterns.

### Why Skills?

| Problem | Solution via Skills |
|---------|---------------------|
| Inconsistent code style | Consistent templates |
| Repeating tasks | Describe once — use many times |
| Boilerplate errors | Verified templates |
| Long onboarding | Skills document approaches |
| Different team approaches | Unified standards |

### When to Create a Skill?

✅ **Create a Skill if:**
- Task repeats 3+ times
- There's an established pattern
- Need to ensure consistency
- Need to document approach

❌ **Don't Create a Skill if:**
- Task is unique
- Pattern isn't established
- Simpler to describe in prompt

---

## Skill Structure

### File Format

```markdown
---
name: Skill Name
description: |
  Brief description of what the skill does.
  Can be multiline.
tags: [tag1, tag2, tag3]
version: 1.0.0
author: Your Name
dependencies:
  - skill: another-skill
    version: ">=1.0.0"
---

# Skill Name

## Purpose
Brief description of the skill's purpose.

## Instructions
Detailed instructions for AI.

## Templates
Code templates.

## Examples
Usage examples.
```

### Required Sections

#### 1. YAML Front Matter

```yaml
---
name: string           # Unique name (required)
description: string    # Description (required)
tags: string[]         # Tags for search
version: string        # Semantic version
author: string         # Author
dependencies: array    # Dependencies on other skills
---
```

#### 2. Purpose

Clear description of what problem the skill solves and when to use it.

#### 3. Instructions

Step-by-step directions for AI on how to generate code.

#### 4. Templates

Ready code templates with placeholders.

#### 5. Examples

Real usage examples with input data and expected results.

### Optional Sections

#### Constraints

```markdown
## Constraints
- Always use TypeScript strict mode
- Never use any
- Required error handling
```

#### Validation

```markdown
## Validation Checklist
- [ ] All props are typed
- [ ] JSDoc comments added
- [ ] ARIA attributes added
- [ ] Loading/error states present
```

#### Anti-patterns

```markdown
## Anti-patterns to Avoid
❌ Don't use useEffect for fetching
❌ Don't store tokens in localStorage
❌ Don't use inline styles
```

---

## Basic Skills Library

### Skill 1: React Component

**File:** `skills/react-component.md`

```markdown
---
name: React Component Generator
description: |
  Generates production-ready React components with TypeScript,
  TailwindCSS, accessibility, and documentation.
tags: [react, typescript, component, frontend]
version: 2.0.0
---

# React Component Generator

## Purpose
Creating consistent React components with full set:
- TypeScript typing
- TailwindCSS styling
- Accessibility (ARIA)
- Loading/Error states
- Documentation (JSDoc)

## When to Use
- Creating new UI components
- Generating form components
- Building layout components
- Creating feature components

## Instructions

### Step 1: Analyze Requirements
Determine component type:
- **Presentation** — UI only, no logic
- **Container** — manages state
- **Form** — form with validation
- **Layout** — page structure

### Step 2: Define Props Interface
```typescript
interface ComponentNameProps {
  /** Main content */
  children: React.ReactNode;
  
  /** Custom classes */
  className?: string;
  
  /** Click handler */
  onClick?: () => void;
  
  /** Loading state */
  isLoading?: boolean;
  
  /** Error state */
  error?: string | null;
}
```

### Step 3: Component Structure

```typescript
/**
 * ComponentName — component description
 * 
 * @param props - Component props
 * @returns JSX element
 * 
 * @example
 * <ComponentName onClick={handleClick}>
 *   Content
 * </ComponentName>
 */
export function ComponentName({
  children,
  className,
  onClick,
  isLoading = false,
  error = null,
}: ComponentNameProps) {
  // Loading state
  if (isLoading) {
    return <ComponentNameSkeleton />;
  }

  // Error state
  if (error) {
    return <ComponentNameError error={error} />;
  }

  // Main render
  return (
    <div
      className={cn('base-classes', className)}
      onClick={onClick}
      role="button"
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          onClick();
        }
      }}
    >
      {children}
    </div>
  );
}
```

### Step 4: Add Variants (if needed)

```typescript
const variants = cva('base-classes', {
  variants: {
    variant: {
      primary: 'bg-blue-500 text-white',
      secondary: 'bg-gray-500 text-white',
      outline: 'border border-gray-500',
    },
    size: {
      sm: 'px-2 py-1 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
});
```

### Step 5: Sub-components

```typescript
function ComponentNameSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-4 bg-gray-200 rounded" />
    </div>
  );
}

function ComponentNameError({ error }: { error: string }) {
  return (
    <div className="text-red-500" role="alert">
      {error}
    </div>
  );
}
```

## Templates

### Presentation Component

```typescript
/**
 * {ComponentName} — {description}
 */
export function {ComponentName}({ children, className }: {ComponentName}Props) {
  return (
    <div className={cn('...', className)}>
      {children}
    </div>
  );
}
```

### Form Component

```typescript
interface {ComponentName}Props {
  onSubmit: (data: {FormData}) => void;
  defaultValues?: Partial<{FormData}>;
}

export function {ComponentName}({ onSubmit, defaultValues }: {ComponentName}Props) {
  const form = useForm<{FormData}>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* form fields */}
      </form>
    </Form>
  );
}
```

## Examples

### Input: Create Button Component

```text
Create a Button component with variants:
- primary, secondary, outline, ghost
- sizes: sm, md, lg
- loading state
- disabled state
- icon support
```

### Output: Button.tsx

```typescript
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-blue-600 text-white hover:bg-blue-700',
        secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
        outline: 'border border-gray-300 hover:bg-gray-50',
        ghost: 'hover:bg-gray-100',
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-base',
        lg: 'h-12 px-6 text-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Button({
  className,
  variant,
  size,
  isLoading,
  leftIcon,
  rightIcon,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
}
```

## Constraints
- Always use TypeScript strict mode
- Add ARIA attributes for interactive elements
- Handle loading and error states
- Use cn() for classes
- Document via JSDoc

## Validation Checklist
- [ ] Props interface defined
- [ ] JSDoc comments added
- [ ] Loading state implemented
- [ ] Error state implemented
- [ ] ARIA attributes for accessibility
- [ ] Keyboard navigation supported
- [ ] Responsive design applied

---

### Skill 2: API Endpoint

**File:** `skills/api-endpoint.md`

```markdown
---
name: API Endpoint Generator
description: |
  Creates Next.js 16 App Router API endpoints with Zod 4 validation,
  authentication, and error handling.
tags: [api, nextjs, backend, rest, typescript]
version: 2.0.0
---

# API Endpoint Generator

## Purpose
Generate production-ready API endpoints with:
- Zod 4 validation
- NextAuth.js v5 authentication
- Unified error handling
- TypeScript typing
- Rate limiting

## Instructions

### Step 1: Define Schemas
```typescript
// schemas.ts
import { z } from 'zod';

export const createPostSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  tags: z.array(z.string()).optional(),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;

export const postResponseSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  tags: z.array(z.string()),
  authorId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type PostResponse = z.infer<typeof postResponseSchema>;
```

### Step 2: Create Route Handler

```typescript
// route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createPostSchema } from './schemas';
import { ZodError } from 'zod';

// Rate limiting
const rateLimiter = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const limit = rateLimiter.get(identifier);
  
  if (!limit || now > limit.resetAt) {
    rateLimiter.set(identifier, { count: 1, resetAt: now + 60000 });
    return true;
  }
  
  if (limit.count >= 10) {
    return false;
  }
  
  limit.count++;
  return true;
}

// POST /api/posts
export async function POST(request: NextRequest) {
  try {
    // 1. Authentication check
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Authentication required' } },
        { status: 401 }
      );
    }

    // 2. Rate limiting
    if (!checkRateLimit(session.user.id)) {
      return NextResponse.json(
        { error: { code: 'RATE_LIMITED', message: 'Too many requests' } },
        { status: 429 }
      );
    }

    // 3. Parse and validate input
    const body = await request.json();
    const validated = createPostSchema.parse(body);

    // 4. Business logic
    const post = await prisma.post.create({
      data: {
        ...validated,
        authorId: session.user.id,
      },
    });

    // 5. Return response
    return NextResponse.json({ data: post }, { status: 201 });
  } catch (error) {
    // Handle different error types
    if (error instanceof ZodError) {
      return NextResponse.json(
        { 
          error: { 
            code: 'VALIDATION_ERROR', 
            message: 'Invalid input',
            details: error.errors 
          } 
        },
        { status: 400 }
      );
    }

    console.error('POST /api/posts error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Something went wrong' } },
      { status: 500 }
    );
  }
}
```

## Security Checklist
- [ ] Authentication check on protected endpoints
- [ ] Authorization check (ownership/role)
- [ ] Input validation via Zod
- [ ] Rate limiting
- [ ] SQL injection protection (Prisma)
- [ ] Error sanitization (don't expose internals)
- [ ] Security event logging

---

## Step-by-Step Skill Creation

### Step 1: Define the Task

**Questions:**
1. What problem does the skill solve?
2. How often does this task repeat?
3. Is there an established pattern?
4. Is consistency needed across developers?

### Step 2: Collect Examples

```bash
# Find examples of good code in the project
# They will become the basis for templates
```

### Step 3: Define Input and Output

```yaml
Input:
  - Component/function description
  - Functionality requirements
  - Constraints

Output:
  - Code files
  - Types
  - Tests (optional)
```

### Step 4: Write Instructions

```markdown
## Instructions

### Step 1: Analysis
1. Read requirements
2. Determine result type
3. Check existing patterns

### Step 2: Generation
1. Create file structure
2. Generate code from template
3. Add types

### Step 3: Validation
1. Check TypeScript types
2. Check style guide compliance
3. Add documentation
```

### Step 5: Create Templates

```markdown
## Templates

### Basic Template
```typescript
// Template code with placeholders
export function {ComponentName}({ ... }: {Props}) {
  // Implementation
}
\```

### Advanced Template
// More complex version
```

### Step 6: Add Examples

```markdown
## Examples

### Example 1: Simple Case
Input: "Create a card component"
Output: [component code]

### Example 2: Complex Case
Input: "Create a form with validation"
Output: [form code with Zod]
```

### Step 7: Define Constraints

```markdown
## Constraints
- Always use TypeScript
- Don't use any
- Add JSDoc comments
- Handle errors
```

### Step 8: Test

```bash
# Create test file
# Run skill through Cursor
# Check result
```

---

## Installing Skills from Repositories

### skills.sh

**URL:** https://skills.sh

**Description:** The official Agent Skills Directory - a registry and CLI tool for discovering and installing skills.

**Installation:**

```bash
# Install a skill
npx skills add org/repo/skill-name

# Example: Install Vercel React best practices
npx skills add vercel-labs/agent-skills/vercel-react-best-practices

# Example: Install frontend-design from Anthropic
npx skills add anthropics/skills/frontend-design
```

**Search skills:**
Browse the directory at https://skills.sh or use the leaderboard to find popular skills.

### skillsmp.com (Discovery Catalog)

**URL:** https://skillsmp.com

**Description:** Agent Skills Marketplace is a discovery catalog that aggregates 227,000+ skills from GitHub. Use it to find skills, then install them using the `skills` CLI or manual clone.

**Installation:**
SkillsMP is for discovery only. To install a skill found there:

1. Browse https://skillsmp.com to find a skill
2. Note the GitHub repository (e.g., `anthropics/skills`)
3. Install using skills CLI or manual clone:

```bash
# Method 1: Using skills CLI (recommended)
npx skills add org/repo/skill-name

# Method 2: Manual clone from GitHub
git clone https://github.com/org/skill-repo.git temp-skill
cp temp-skill/skill.md .cursor/skills/skill-name.md
rm -rf temp-skill
```

---

## Verifying Skill Reliability

### 🔒 Checklist

#### 1. Source
- [ ] Official organization repository
- [ ] Known author
- [ ] Active maintenance

#### 2. Skill Code
- [ ] Clear instructions
- [ ] Secure templates
- [ ] No hardcoded secrets
- [ ] Input validation

#### 3. Dependencies
- [ ] Minimal dependencies
- [ ] Verified packages
- [ ] No conflicts

#### 4. Documentation
- [ ] Clear description
- [ ] Usage examples
- [ ] Constraints specified

### 🚨 Red Flags

| Sign | Action |
|------|--------|
| Obfuscated code | Don't use |
| External HTTP requests | Check necessity |
| Hardcoded URLs | Replace with configurable |
| Requesting secrets | Decline |

---

## Practical Assignments

### 🎯 Assignment 1: Creating Form Skill

**Goal:** Create a skill for generating forms with validation.

**Requirements:**

```yaml
name: Form Generator
description: Generate React forms with React Hook Form and Zod

features:
  - Automatic schema generation from description
  - Different field types (text, email, select, checkbox)
  - Client-side and server-side validation
  - Error display
  - Loading state
```

**Prompt for creation:**

```text
Create a skill for generating forms:

1. Define skill file structure
2. Create instructions for AI:
   - Analyze requirements
   - Generate Zod schema
   - Create React Hook Form component
   - Add styling

3. Create templates for:
   - Text input
   - Email input
   - Select
   - Checkbox
   - Radio group
   - Date picker

4. Add usage examples

5. Define constraints:
   - Always use Zod
   - Accessibility
   - Responsive design
```

---

### 🎯 Assignment 2: Creating Migration Skill

**Goal:** Skill for migrating code between versions.

**Prompt:**

```text
Create a skill for React component migration:

Migrations:
1. Class component -> Function component
2. JavaScript -> TypeScript
3. Redux -> Zustand
4. Component styles -> TailwindCSS
5. React 18 -> React 19

For each migration:
- Analyze source code
- Determine patterns
- Generate new code
- Test
```

---

### 🎯 Assignment 3: Creating Testing Skill

**Goal:** Skill for generating tests.

**Prompt:**

```text
Create a skill for test generation:

Test types:
1. Unit tests (Vitest)
2. Integration tests (Testing Library)
3. E2E tests (Playwright)
4. Security tests
5. Performance tests

Templates:
- AAA pattern
- BDD style
- Factory pattern for data
- Mock patterns
```

---

### 🎯 Assignment 4: Installing Skills from Repositories

**Goal:** Learn to install and verify skills.

**Task:**

```text
1. Find skill in skills.sh for:
   - React components
   - API endpoints
   - Prisma models

2. Verify each skill:
   - Source
   - Code
   - Documentation

3. Install valid skills

4. Test on real task

5. Document results
```

---

### 🎯 Assignment 5: Creating Custom API Skill

**Goal:** Create a skill for custom API pattern.

**Requirements:**

```yaml
name: Custom API Skill
features:
  - Public API endpoints (no auth)
  - Private API endpoints (with auth)
  - Rate limiting
  - API versioning
  - OpenAPI documentation
```

**Prompt:**

```text
Create a skill for API with public/private separation:

Public API:
- No authentication required
- Rate limited per IP
- Versioned (/api/v1/)
- OpenAPI documented

Private API:
- Authentication required
- Role-based authorization
- Rate limited per user
- Audit logging

Instructions:
1. Determine endpoint type
2. Create route handler
3. Add middleware
4. Generate documentation
```

---
