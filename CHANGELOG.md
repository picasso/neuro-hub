# Changelog

All notable changes to this project will be documented in this file.

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

[0.2.5]: https://github.com/picasso/neuro-hub/compare/v0.2.2...v0.2.5
[0.3.3]: https://github.com/picasso/neuro-hub/compare/v0.2.5...v0.3.3
[0.2.2]: https://github.com/picasso/neuro-hub/compare/v0.2.1...v0.2.2
[0.2.1]: https://github.com/picasso/neuro-hub/compare/v0.1.5...v0.2.1
[0.1.5]: https://github.com/picasso/neuro-hub/compare/v0.1.4...v0.1.5
[0.1.4]: https://github.com/picasso/neuro-hub/compare/v0.1.0...v0.1.4
[0.1.0]: https://github.com/picasso/neuro-hub/releases/tag/v0.1.0

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
