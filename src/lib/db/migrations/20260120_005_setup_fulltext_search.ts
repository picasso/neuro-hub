import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
	await knex.raw('CREATE EXTENSION IF NOT EXISTS "pg_trgm"')

	await knex.raw(`
		ALTER TABLE user_profiles 
		ADD COLUMN search_vector tsvector 
		GENERATED ALWAYS AS (
			setweight(to_tsvector('english', coalesce(name, '')), 'A') ||
			setweight(to_tsvector('english', coalesce(bio, '')), 'B')
		) STORED
	`)

	await knex.raw(`
		CREATE INDEX user_profiles_search_idx 
		ON user_profiles 
		USING GIN (search_vector)
	`)

	await knex.raw(`
		CREATE INDEX user_profiles_name_trgm_idx 
		ON user_profiles 
		USING GIN (name gin_trgm_ops)
	`)
}

export async function down(knex: Knex): Promise<void> {
	await knex.raw('DROP INDEX IF EXISTS user_profiles_name_trgm_idx')
	await knex.raw('DROP INDEX IF EXISTS user_profiles_search_idx')
	await knex.raw('ALTER TABLE user_profiles DROP COLUMN IF EXISTS search_vector')
}
