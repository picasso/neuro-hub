import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable('users', (table) => {
		table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
		table.string('email', 255).notNullable().unique()
		table.string('password_hash', 255)
		table.enum('role', ['freelancer', 'client']).notNullable()
		table.boolean('email_verified').defaultTo(false)
		table.timestamp('created_at').defaultTo(knex.fn.now())
		table.timestamp('updated_at').defaultTo(knex.fn.now())

		table.index('email')
		table.index('role')
	})

	await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTableIfExists('users')
}
