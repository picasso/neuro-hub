import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
	await knex.schema.alterTable('projects', (table) => {
		table.text('cover_url')
	})
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.alterTable('projects', (table) => {
		table.dropColumn('cover_url')
	})
}
