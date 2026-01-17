---
name: Architecture
description: This rule sets the project structure.
---

# Architecture

## Directory Structure

Feature-Based Structure: Components organized by business domain rather than technical type.

src/
├── app/ # Next.js App Router pages
│ ├── (auth)/ # Authentication routes (grouped)
│ ├── (dashboard)/ # Protected dashboard routes
│ ├── api/ # API routes
│ └── layout.tsx # Root layout
├── components/
│ ├── ui/ # Simple, common ui components
│ ├── forms/ # Form components
│ └── features/ # Feature-specific components
├── lib/
│ ├── db/ # Database client and queries
│ ├── auth/ # Authentication utilities
│ └── *** # Any more complex functionality
├── server/
│ ├── routers/ # tRPC routers
│ └── services/ # Business logic services
├── utils/ # Pure utility functions, no side effects, don't depend on external services
└── types/ # Shared TypeScript types

## Key Patterns

- Feature-based organization within components/features/
- All database queries go through lib/db/
- Business logic lives in server/services/, not in API routes
- Shared types are defined once in types/ and imported everywhere
