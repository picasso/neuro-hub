import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable('user_profiles', (table) => {
		table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
		table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE')
		table.string('name', 255)
		table.string('avatar_url', 500)
		table.text('bio')
		table.string('company_name', 255)
		table.string('company_role', 255)
		table.timestamp('created_at').defaultTo(knex.fn.now())
		table.timestamp('updated_at').defaultTo(knex.fn.now())

		table.unique('user_id')
		table.index('user_id')
	})
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTableIfExists('user_profiles')
}
