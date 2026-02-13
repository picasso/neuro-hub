import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
	await knex.raw('CREATE EXTENSION IF NOT EXISTS "pgcrypto"')

	await knex.schema.createTable('freelancer_profiles', (table) => {
		table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
		table.text('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE')

		table.string('specialization', 255)
		table.integer('hourly_rate')
		table.string('availability', 100)
		table.text('experience')

		table.timestamp('created_at').defaultTo(knex.fn.now())
		table.timestamp('updated_at').defaultTo(knex.fn.now())

		table.unique('user_id')
		table.index('user_id')
	})

	await knex.schema.createTable('portfolio_items', (table) => {
		table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))

		table
			.uuid('freelancer_profile_id')
			.notNullable()
			.references('id')
			.inTable('freelancer_profiles')
			.onDelete('CASCADE')

		table.string('title', 255).notNullable()
		table.text('description')

		// stored as absolute URL (e.g. Vercel Blob public URL)
		table.text('media_url').notNullable()
		table.string('media_type', 50)
		table.string('category', 100)

		// list of tools used (flexible structure)
		table.jsonb('tools_used')

		table.timestamp('created_at').defaultTo(knex.fn.now())
		table.timestamp('updated_at').defaultTo(knex.fn.now())

		table.index('freelancer_profile_id')
		table.index('category')
	})
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTableIfExists('portfolio_items')
	await knex.schema.dropTableIfExists('freelancer_profiles')
}
