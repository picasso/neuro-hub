import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable('sessions', (table) => {
		table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
		table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE')
		table.string('token', 500).notNullable().unique()
		table.timestamp('expires_at').notNullable()
		table.timestamp('created_at').defaultTo(knex.fn.now())

		table.index('user_id')
		table.index('token')
		table.index('expires_at')
	})
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTableIfExists('sessions')
}
