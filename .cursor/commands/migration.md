# Create Database Migration

## Overview
Create a new Kysely migration file with proper naming and structure.

## Steps
1. **Determine migration purpose**
   - What tables/columns are being added/modified?
   - What is the rollback strategy?
   - Are there any data transformations needed?
   - Get confirmation from the user

2. **Create migration file**
   - Use timestamp prefix: `YYYYMMDD_NNN_description.ts`
   - Place in `src/lib/db/migrations/`
   - Follow existing migration patterns

3. **Implement migration**
   - Write `up` function with forward migration
   - Write `down` function with rollback logic
   - Use Kysely schema builder methods
   - Add proper types and constraints
   - Show which files were created and wait for explicit confirmation

4. **Test migration**
   - Run migration: `yarn migrate:latest`
   - Verify database schema
   - Test rollback: `yarn migrate:down`
   - Verify data integrity
   - Explain implementation and wait for explicit confirmation

## Migration Template Structure
- [ ] Import necessary Kysely types
- [ ] Export async `up` function
- [ ] Export async `down` function
- [ ] Use transaction if needed
- [ ] Add comments for complex logic
- [ ] Test both up and down migrations

## Example Reference
Check existing migrations in `src/lib/db/migrations/` for patterns and conventions.
