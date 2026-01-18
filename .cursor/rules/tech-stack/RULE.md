---
name: Tech Stack
description: This rule sets context about what the project's Tech Stack.
---

# Tech Stack

Ignore commented items!

## Build & Development

- Base build system: Vite 7+ (not for Next.js projects, only for regular React)
- Package manager: Yarn Classic 1.x
- Runtime: Node.js 24 LTS
- Use Docker as multi-stage containerization with Nginx

## Frontend

- Framework: Next.js 16+ (App Router)
- Language: TypeScript 5.9+ (strict mode)
- UI components: Material UI 7.3+
- Styling: @emotion/react 11+
- State: Effector 23+

## Backend

- Runtime: Node.js 24 LTS
- API: Next.js API Routes (RESTful) with OpenAPI/Swagger documentation
- Database: PostgreSQL 16 with Knex.js SQL query builder
- Authentication: Better Auth with cookie-based sessions
<!-- - Cache: Redis for session storage and rate limiting -->
<!-- - Queue: BullMQ for background jobs -->

## Infrastructure

- Hosting: Vercel (Frontend) + Railway (Database)
- CDN: Cloudflare for static assets
- Monitoring: Sentry for errors, Axiom for logs
- CI/CD: GitHub Actions

## Key Dependencies

- better-auth for authentication and authorization
<!-- - stripe@14 for payments -->
<!-- - resend for transactional emails -->
<!-- - uploadthing for file uploads -->
