import type { Knex } from 'knex'

/**
 * Migrate domain IDs to UUID:
 * - skills.id: TEXT (nanoid) -> UUID
 * - user_skills.skill_id: TEXT -> UUID (re-mapped to new skills UUIDs)
 *
 * Notes:
 * - Better Auth core tables keep TEXT ids (users/sessions/accounts/verifications).
 * - This migration assumes PostgreSQL.
 */
export async function up(knex: Knex): Promise<void> {
	// gen_random_uuid() is provided by pgcrypto
	await knex.raw('CREATE EXTENSION IF NOT EXISTS "pgcrypto"')

	// 1) Add UUID column to skills and populate
	await knex.schema.alterTable('skills', (table) => {
		table.uuid('new_id').nullable()
	})

	await knex.raw(`
		UPDATE skills
		SET new_id = gen_random_uuid()
		WHERE new_id IS NULL
	`)

	// 2) Add new UUID column to user_skills and populate via join
	await knex.schema.alterTable('user_skills', (table) => {
		table.uuid('new_skill_id').nullable()
	})

	await knex.raw(`
		UPDATE user_skills us
		SET new_skill_id = s.new_id
		FROM skills s
		WHERE us.skill_id = s.id
	`)

	// Sanity check: ensure every user_skills row was mapped
	const unmapped = await knex<{ count: string }>('user_skills')
		.whereNull('new_skill_id')
		.count<{ count: string }>('* as count')
		.first()

	if (unmapped && Number(unmapped.count) > 0) {
		throw new Error(
			`Skills UUID migration failed: ${unmapped.count} user_skills rows could not be mapped`,
		)
	}

	// 3) Drop FKs/constraints, swap columns, recreate constraints
	// Knex-generated constraint names are predictable, but we keep drops resilient.
	await knex.raw('ALTER TABLE user_skills DROP CONSTRAINT IF EXISTS user_skills_skill_id_foreign')
	await knex.raw(
		'ALTER TABLE user_skills DROP CONSTRAINT IF EXISTS user_skills_user_id_skill_id_unique',
	)

	// Drop indexes on old skill_id (will be recreated)
	await knex.raw('DROP INDEX IF EXISTS user_skills_skill_id_index')

	// skills PK
	await knex.raw('ALTER TABLE skills DROP CONSTRAINT IF EXISTS skills_pkey')

	// Preserve old ids for potential rollback/debugging
	await knex.schema.alterTable('skills', (table) => {
		table.renameColumn('id', 'legacy_id')
	})
	await knex.raw('ALTER TABLE skills ALTER COLUMN legacy_id DROP NOT NULL')

	// Replace skills.id with new_id
	await knex.schema.alterTable('skills', (table) => {
		table.renameColumn('new_id', 'id')
	})

	// Make skills.id NOT NULL + PK
	await knex.raw('ALTER TABLE skills ALTER COLUMN id SET NOT NULL')
	await knex.raw('ALTER TABLE skills ADD CONSTRAINT skills_pkey PRIMARY KEY (id)')

	// Preserve old ids in user_skills for potential rollback/debugging
	await knex.schema.alterTable('user_skills', (table) => {
		table.renameColumn('skill_id', 'legacy_skill_id')
	})
	await knex.schema.alterTable('user_skills', (table) => {
		table.renameColumn('new_skill_id', 'skill_id')
	})

	await knex.raw('ALTER TABLE user_skills ALTER COLUMN skill_id SET NOT NULL')
	// legacy_skill_id should not block inserts
	await knex.raw('ALTER TABLE user_skills ALTER COLUMN legacy_skill_id DROP NOT NULL')

	// Recreate FK + indexes + unique constraint
	await knex.raw(`
		ALTER TABLE user_skills
		ADD CONSTRAINT user_skills_skill_id_foreign
		FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
	`)
	await knex.raw(`
		ALTER TABLE user_skills
		ADD CONSTRAINT user_skills_user_id_skill_id_unique
		UNIQUE (user_id, skill_id)
	`)
	await knex.raw('CREATE INDEX user_skills_skill_id_index ON user_skills (skill_id)')
}

export async function down(knex: Knex): Promise<void> {
	// Rollback to legacy TEXT ids using preserved legacy columns.
	await knex.raw('ALTER TABLE user_skills DROP CONSTRAINT IF EXISTS user_skills_skill_id_foreign')
	await knex.raw(
		'ALTER TABLE user_skills DROP CONSTRAINT IF EXISTS user_skills_user_id_skill_id_unique',
	)
	await knex.raw('DROP INDEX IF EXISTS user_skills_skill_id_index')
	await knex.raw('ALTER TABLE skills DROP CONSTRAINT IF EXISTS skills_pkey')

	// Restore skills.id (text) from legacy_id
	await knex.schema.alterTable('skills', (table) => {
		table.renameColumn('id', 'new_id')
	})
	await knex.schema.alterTable('skills', (table) => {
		table.renameColumn('legacy_id', 'id')
	})
	await knex.raw('ALTER TABLE skills ALTER COLUMN id SET NOT NULL')
	await knex.raw('ALTER TABLE skills ADD CONSTRAINT skills_pkey PRIMARY KEY (id)')

	// Restore user_skills.skill_id (text) from legacy_skill_id
	await knex.schema.alterTable('user_skills', (table) => {
		table.renameColumn('skill_id', 'new_skill_id')
	})
	await knex.schema.alterTable('user_skills', (table) => {
		table.renameColumn('legacy_skill_id', 'skill_id')
	})
	await knex.raw('ALTER TABLE user_skills ALTER COLUMN skill_id SET NOT NULL')

	// Recreate legacy FK + indexes + unique constraint
	await knex.raw(`
		ALTER TABLE user_skills
		ADD CONSTRAINT user_skills_skill_id_foreign
		FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
	`)
	await knex.raw(`
		ALTER TABLE user_skills
		ADD CONSTRAINT user_skills_user_id_skill_id_unique
		UNIQUE (user_id, skill_id)
	`)
	await knex.raw('CREATE INDEX user_skills_skill_id_index ON user_skills (skill_id)')

	// Drop temporary columns introduced by the migration
	await knex.schema.alterTable('user_skills', (table) => {
		table.dropColumn('new_skill_id')
	})
	await knex.schema.alterTable('skills', (table) => {
		table.dropColumn('new_id')
	})
}
