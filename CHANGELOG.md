# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
- Landing page components (hero, benefits, showcase, FAQ sections)
- Material UI theme configuration with custom colors
- Material UI Link integration with Next.js Link
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

[0.1.5]: https://github.com/picasso/neuro-hub/compare/v0.1.4...v0.1.5
[0.1.4]: https://github.com/picasso/neuro-hub/compare/v0.1.0...v0.1.4
[0.1.0]: https://github.com/picasso/neuro-hub/releases/tag/v0.1.0
