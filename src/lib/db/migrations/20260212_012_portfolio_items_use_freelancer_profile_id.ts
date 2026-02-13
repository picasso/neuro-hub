import type { Knex } from 'knex'

/**
 * Bring `portfolio_items` into alignment with ADR (domain resources use UUIDs).
 *
 * Canonical schema:
 * - portfolio_items.freelancer_profile_id (uuid, NOT NULL, FK -> freelancer_profiles.id)
 * - portfolio_items.user_id should NOT be used for ownership/association.
 *
 * This migration is intentionally defensive:
 * - If legacy `user_id` exists, we backfill `freelancer_profile_id` via freelancer_profiles.user_id.
 * - Works both for fresh DBs (after older migration 011) and existing DBs.
 */
export async function up(knex: Knex): Promise<void> {
	// 1) Ensure column exists
	const hasProfileId = await knex.schema.hasColumn('portfolio_items', 'freelancer_profile_id')
	if (!hasProfileId) {
		await knex.schema.alterTable('portfolio_items', (table) => {
			table.uuid('freelancer_profile_id')
		})
	}

	// 2) If legacy user_id exists, backfill
	const hasUserId = await knex.schema.hasColumn('portfolio_items', 'user_id')
	if (hasUserId) {
		await knex.raw(`
			UPDATE portfolio_items pi
			SET freelancer_profile_id = fp.id
			FROM freelancer_profiles fp
			WHERE fp.user_id = pi.user_id
			  AND pi.freelancer_profile_id IS NULL
		`)
	}

	// 3) Make freelancer_profile_id NOT NULL (fail fast if bad data)
	const nullCountRes = await knex.raw<{ rows: Array<{ count: string }> }>(`
		SELECT COUNT(*)::text as count
		FROM portfolio_items
		WHERE freelancer_profile_id IS NULL
	`)
	const nullCount = Number(nullCountRes.rows?.[0]?.count ?? 0)
	if (nullCount > 0) {
		throw new Error(
			`Migration 20260212_012: portfolio_items.freelancer_profile_id has ${nullCount} NULL rows; ` +
				`cannot set NOT NULL. (If this is dev, you can clear DB and rerun migrations.)`,
		)
	}

	// Alter to NOT NULL (safe now)
	await knex.schema.alterTable('portfolio_items', (table) => {
		table.uuid('freelancer_profile_id').notNullable().alter()
	})

	// 4) Add FK + index (idempotent)
	await knex.raw(`
		DO $$
		BEGIN
			ALTER TABLE portfolio_items
				ADD CONSTRAINT portfolio_items_freelancer_profile_id_foreign
				FOREIGN KEY (freelancer_profile_id)
				REFERENCES freelancer_profiles(id)
				ON DELETE CASCADE;
		EXCEPTION
			WHEN duplicate_object THEN
				NULL;
		END $$;
	`)

	await knex.raw(`
		CREATE INDEX IF NOT EXISTS portfolio_items_freelancer_profile_id_index
		ON portfolio_items (freelancer_profile_id)
	`)

	// 5) Remove legacy user_id if present
	if (hasUserId) {
		// Drop FK/idx if they exist (names match Knex defaults)
		await knex.raw(
			`ALTER TABLE portfolio_items DROP CONSTRAINT IF EXISTS portfolio_items_user_id_foreign`,
		)
		await knex.raw(`DROP INDEX IF EXISTS portfolio_items_user_id_index`)

		await knex.schema.alterTable('portfolio_items', (table) => {
			table.dropColumn('user_id')
		})
	}
}

export async function down(knex: Knex): Promise<void> {
	// Reintroduce user_id column (best-effort rollback).
	const hasUserId = await knex.schema.hasColumn('portfolio_items', 'user_id')
	if (!hasUserId) {
		await knex.schema.alterTable('portfolio_items', (table) => {
			table.text('user_id')
		})
	}

	// Backfill user_id from freelancer_profiles if possible.
	await knex.raw(`
		UPDATE portfolio_items pi
		SET user_id = fp.user_id
		FROM freelancer_profiles fp
		WHERE fp.id = pi.freelancer_profile_id
		  AND pi.user_id IS NULL
	`)

	// Keep freelancer_profile_id as-is (rollback does not drop canonical column).
}
