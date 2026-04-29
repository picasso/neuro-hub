# Create Database Migration

Create a new Kysely migration with proper naming, structure, and rollback logic.

## Steps

### 1. Plan migration
- What tables/columns are being added or modified?
- What is the rollback strategy?
- Any data transformations or backfills needed?

Describe the plan and wait for confirmation.

### 2. Create migration file

- Naming: `YYYYMMDD_NNN_description.ts`
- Location: `src/lib/db/migrations/`
- Follow existing migration patterns in that directory

### 3. Implement

- Write `up` function — forward migration
- Write `down` function — full rollback
- Use Kysely schema builder (`schema.createTable`, `schema.alterTable`, etc.)
- Add proper types, constraints, indexes, foreign keys

Show created files and wait for confirmation.

### 4. Test migration

```bash
yarn db:migrate      # run migration forward
yarn db:check        # inspect schema
```

Test rollback if the project exposes a rollback command. Verify data integrity after both directions.

Explain implementation and wait for confirmation.

---

## Migration structure

```ts
import { Kysely } from 'kysely'

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createTable('example')
    .addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(db.fn('gen_random_uuid')))
    .addColumn('created_at', 'timestamptz', (col) => col.notNull().defaultTo('now()'))
    .execute()
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropTable('example').execute()
}
```

---

## Checklist

- [ ] Migration file named correctly (`YYYYMMDD_NNN_description.ts`)
- [ ] `up` function implements the forward change
- [ ] `down` function fully reverses it
- [ ] Constraints, indexes, foreign keys added where needed
- [ ] Migration runs without errors
- [ ] DB docs updated if required (see CLAUDE.md — Database Documentation Contract)
- [ ] `yarn type-check` passes
