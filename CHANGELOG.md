# Changelog

All notable changes to this project will be documented in this file.

## [0.5.1] - 2026-04-23

### Added

- Shared authenticated header state across marketing and account layouts, including profile avatar data and realtime unread message counters
- Phase 2 of the account profile editor, including inline editing, improved avatar flows, skills editing, and additional profile fields such as location, bio, and languages
- `AvatarEditor` and related uploader improvements for avatar-specific editing flows
- Public freelancer profile enhancements, including nickname-based URLs and richer profile presentation
- New and expanded account-facing UI building blocks, including `ProjectCard`, improved `ApplicationCard`, breadcrumbs, `StackSpan`, and `PersonCard`
- Mock freelancer profiles and portfolio assets for development and UI validation
- Database reference documentation and synchronization contract notes

### Changed

- Standardized API client request helpers and error handling
- Refined chat and auth flows to align requests with the current origin and improve timestamp presentation in conversations
- Improved shared UI primitives and wrappers, including `Card`, `Badge`, `Tooltip`, `Slider`, `TextField`, `FieldWrapper`, `IconButton`, and avatar presentation
- Simplified pre-commit checks by removing the project-wide TypeScript run from `lint-staged`
- Updated application-related copy and pluralization across project and account views

### Fixed

- Realtime unread synchronization in chat so header and sidebar badges clear reliably during conversation transitions
- Chat composer keyboard submission and related interaction edge cases
- `ApplicationCard`, project card, `TextField`, and form wrapper follow-up issues
- `cyrillicValidator` and `sprintf` helper behavior

## [0.5.0] - 2026-04-08

### Added
- End-to-end chat foundation with database schema, query helpers, service layer, validations, and REST API routes for conversations, messages, read state, and Ably token access
- Realtime chat state management with Effector stores for conversations, messages, unread counters, and synchronization helpers
- New chat UI primitives and feature screens for conversation lists, message threads, composers, toolbars, and account chat pages
- Project-to-chat integration, including starting conversations from project applications and an account applications view
- Vitest-based test setup and focused coverage for chat adapters, validations, store helpers, cursor utilities, and account context behavior

### Changed
- Refined account layout and sidebar behavior to support the new chat and applications flows
- Improved shared UI wrappers, playground demos, icons, skeletons, tabs, cards, and portfolio-related components used by the new chat experience
- Updated internal plans, architecture notes, and project rules to reflect the delivered chat foundation and related frontend conventions

### Fixed
- Realtime unread and read-state synchronization issues in chat flows
- Message rendering and scrolling behavior, including Safari-specific styling follow-ups
- Sleep utility handling for negative millisecond values

## [0.4.3] - 2026-03-19

### Added
- Freelancer project marketplace MVP with a public projects directory, project cards, a project details page, and application submission flow
- Account project creation flow for clients with project validation, publishing, and skill selection
- Projects and applications database layer with migrations, query helpers, and API endpoints for listing, creating, updating, deleting, applying, and withdrawing applications
- Validation coverage for project directory, project payloads, attachments, and application payloads

### Changed
- Updated `DEVELOPMENT-PLAN.md` to mark completed work for Stage 4.1, 4.2, and the delivered UI parts of 4.3
- Improved database migration scripts and CLI guidance for the new projects/applications schema
- Refined shared UI wrappers and supporting primitives used by the marketplace flow, including `Badge`, `Card`, `Empty`, icons, and related playground demos

### Fixed
- Markdown text rendering inside paragraph contexts to avoid invalid nested `<p>` markup
- Small account and UI follow-up issues discovered while integrating the marketplace and project creation flows

## [0.4.1] - 2026-03-17

### Added
- PR language format rule to keep pull request headings and checklists in English while keeping descriptive content in Russian
- Additional post-migration shadcn/ui wrappers and primitives: `Card`, `Breadcrumb`, `Collapsible`, `Sidebar`, `Sheet`, `Skeleton`, and `DropdownMenu`
- `freelancers` page for browsing freelancer profiles

### Changed
- Migrated the project from Yarn Classic to Yarn 4 with Corepack-managed installs
- Updated CI and deployment workflows to use `yarn install --immutable`
- Hardened Husky hooks and database scripts to run Yarn through Corepack-compatible commands
- Updated project documentation and internal rules to reflect the new package manager workflow
- Refined the UI layer after the main shadcn migration with follow-up wrapper improvements
- Updated alerts documentation to reflect shadcn/ui-based components and the current alert behavior
- Stabilized Vercel Yarn 4 deployments by using a committed release binary via `yarnPath` instead of `ENABLE_EXPERIMENTAL_COREPACK`

### Removed
- Unused Next.js application Docker runtime setup, keeping Docker Compose only for local PostgreSQL

## [0.4.0] - 2026-03-09

### Added
- shadcn/ui component system (Radix UI primitives + Tailwind CSS 4)
- New `ui/` barrel with full set of reusable primitives:
  Button, Icon, IconButton, Link, Stack, TextStyled, FileUploader,
  Separator, Badge, Avatar, Dialog, Tooltip, Card, and more
- Custom alert system rebuilt on shadcn/ui (Sonner stays for toasts)
- Custom Stepper component (onboarding progress) using Tailwind
- `use-client` boundary pattern for barrel-exported client components

### Changed
- Full migration from Material UI to shadcn/ui across all features:
  header, footer, home sections, onboarding wizard (6 steps),
  auth pages, freelancer profile, portfolio editor and viewer, dashboard
- Styling fully ported to Tailwind CSS 4; `sx` prop usage eliminated
- `ui-theme/` directory and MUI theme providers removed

### Removed
- `@mui/material`, `@mui/icons-material`, `@mui/lab` dependencies
- `@emotion/react`, `@emotion/styled` dependencies
- `src/ui-theme/` directory (MUI theme — Phase 4 cleanup complete)
- `src/ui/providers/theme-registry.tsx` and `font-provider.tsx`
- Playground legacy MUI demo page (`playground-old/`)

## [0.3.4] - 2026-02-18

### Added
- MUI Link `color="contrast"` for dark backgrounds (footer)
- FileUploader component and playground
- DB health alert and safe get-session in dev
- ESLint effector plugin configs

### Changed
- Portfolio viewer: single state machine ($phase) instead of multiple stores
- Alerts: store-driven progress, custom styles and icons
- Theme: new tokens and component styling

### Fixed
- simpleMarkdown: defaults handling
- Better Auth: migration order, Postgres connection limit in dev

## [0.3.3] - 2026-02-13

### Added
- Freelancer profile (Stage 3):
  - Public profile page `/freelancers/[profileId]` with skills and portfolio gallery
  - Portfolio items CRUD with direct uploads to Vercel Blob
  - Dashboard `/dashboard` for editing freelancer profile and portfolio
  - API endpoints for freelancers, portfolio, and blob upload token exchange

### Changed
- Updated DEVELOPMENT-PLAN.md: marked Stage 3.1–3.3 tasks as completed (HF/reviews remain pending)

### Fixed
- Portfolio `tools_used` persistence for `jsonb` column
- Role handling on sign-up: client users are created with `role=client` and do not get freelancer profiles

## [0.2.5] - 2026-02-06

### Added
- Alert and notification system:
  - Sonner integration for toast notifications
  - Custom 'progress' severity with theme support
  - Overlay mode for modal-like alerts
  - Comprehensive documentation with usage examples
- Onboarding wizard for user registration:
  - Multi-step form with role selection (freelancer/client)
  - Profile information steps (credentials, details, skills)
  - Email verification step
  - Progress bar and step navigation
  - Form validation with Zod schemas
  - Error handling with alert notifications
- UI Components:
  - Icon component with asset management and default colors
  - Button component with variants and sizes
  - TextStyled component for typography
- Development infrastructure:
  - Debug logger system with conditional logging
  - Development Playground for component demonstrations
  - Markdown utility with MUI theme support
  - Unit tests for utility functions (Jest)
- Database:
  - Skills table migration (id, name, category)
  - User skills table with proficiency levels
  - Seed data for AI/ML skills (GPT-4, Midjourney, etc.)
- Architecture Decision #17: Development Playground

### Changed
- Updated DEVELOPMENT-PLAN.md with completed stages 0.4, 2.3, 2.4, 2.5
- Updated ARCHITECTURE-DECISIONS.md with Development Playground decision

## [0.2.2] - 2026-01-25

### Added
- Vercel deployment configuration and documentation:
  - `vercel.json` - minimal configuration with security headers
  - `docs/VERCEL-SETUP.md` - comprehensive deployment guide (450+ lines)
  - `docs/VERCEL-QUICKSTART.md` - quick start guide for rapid deployment
- Complete Vercel deployment instructions with environment variables setup
- Custom domain configuration guide with DNS setup
- Monitoring and analytics setup (Vercel Analytics, Speed Insights)
- Troubleshooting guide for common deployment issues

### Changed
- Updated README.md with deployment section for Vercel and Railway
- Updated DEVELOPMENT-PLAN.md: marked Vercel deployment tasks as complete
- Enhanced documentation structure with deployment guides

## [0.2.1] - 2026-01-25

### Added
- Landing page for NeuroHub platform with modern design
- Hero section with call-to-action buttons
- Platform benefits showcase section
- Project case studies block with project cards
- Interactive FAQ section with accordion
- Footer with contact information and social media links
- SEO optimization: meta tags and Open Graph markup
- Mobile responsive design for all public pages

### Changed
- Created layout structure for public pages
- Updated routing structure for homepage

## [0.1.5] - 2026-01-25

### Added
- GitHub Actions workflow for automatic Railway PostgreSQL migrations on push to main
- Database management scripts for Railway operations:
  - `export-data.sh` - export data from local PostgreSQL database
  - `import-data.sh` - import data to Railway with safety checks
  - `migrate-production.sh` - run production migrations with backups
  - `backup-railway.sh` - create Railway database backups
- Comprehensive Railway PostgreSQL documentation:
  - `docs/RAILWAY-SETUP.md` - detailed setup guide (376 lines)
  - `docs/RAILWAY-QUICKSTART.md` - quick start guide (147 lines)
  - `scripts/db/README.md` - database scripts documentation
- Package.json commands for Railway database operations:
  - `db:migrate:production` - safe production migrations
  - `db:export` - export local database
  - `db:import` - import to Railway
  - `db:backup:railway` - backup Railway database
- Railway PostgreSQL SSL certificate configuration with auto-detection
- Architecture decision #13: Railway PostgreSQL SSL handling

### Changed
- Removed `knexfile.ts` from ESLint ignores to enable linting
- Updated package.json version to 0.1.5
- SSL configuration now managed in code (`pool.ts` and `knexfile.ts`)

### Fixed
- Railway PostgreSQL SSL certificate verification error (SELF_SIGNED_CERT_IN_CHAIN)
- Automatic SSL configuration for Railway connections (domain-based detection)

## [0.1.4] - 2026-01-24

### Added
- Effector state management setup

### Changed
- Improved project structure and component organization
- Updated documentation and development plan

## [0.1.0] - 2026-01-18

### Added
- Initial project setup with Next.js 16 and TypeScript
- PostgreSQL 16 database with Knex.js migrations
- Better Auth integration for authentication
- Kysely for type-safe database queries
- Material UI 7 for UI components
- Docker Compose for local development
- Basic API endpoints structure
- OpenAPI documentation with Scalar
- Database migrations for users, profiles, sessions, and skills
- Comprehensive project documentation

[0.4.1]: https://github.com/picasso/neuro-hub/compare/v0.4.0...v0.4.1
[0.5.0]: https://github.com/picasso/neuro-hub/compare/v0.4.3...v0.5.0
[0.4.0]: https://github.com/picasso/neuro-hub/compare/v0.3.4...v0.4.0
[0.3.4]: https://github.com/picasso/neuro-hub/compare/v0.3.3...v0.3.4
[0.3.3]: https://github.com/picasso/neuro-hub/compare/v0.2.5...v0.3.3
[0.2.5]: https://github.com/picasso/neuro-hub/compare/v0.2.2...v0.2.5
[0.2.2]: https://github.com/picasso/neuro-hub/compare/v0.2.1...v0.2.2
[0.2.1]: https://github.com/picasso/neuro-hub/compare/v0.1.5...v0.2.1
[0.1.5]: https://github.com/picasso/neuro-hub/compare/v0.1.4...v0.1.5
[0.1.4]: https://github.com/picasso/neuro-hub/compare/v0.1.0...v0.1.4
[0.1.0]: https://github.com/picasso/neuro-hub/releases/tag/v0.1.0

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
