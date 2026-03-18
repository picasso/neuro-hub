import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
	await knex.raw('CREATE EXTENSION IF NOT EXISTS "pgcrypto"')

	await knex.schema.createTable('projects', (table) => {
		table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
		table.text('client_id').notNullable().references('id').inTable('users').onDelete('CASCADE')
		table.string('title', 255).notNullable()
		table.text('description').notNullable()
		table.string('category', 100).notNullable()
		table.string('experience_level', 50).notNullable()
		table.string('budget_type', 20).notNullable()
		table.integer('budget_min').notNullable()
		table.integer('budget_max').notNullable()
		table.timestamp('deadline').notNullable()
		table.string('status', 30).notNullable().defaultTo('draft')
		table.timestamp('created_at').defaultTo(knex.fn.now())
		table.timestamp('updated_at').defaultTo(knex.fn.now())

		table.index('client_id')
		table.index('category')
		table.index('experience_level')
		table.index('deadline')
		table.index(['status', 'created_at'])
	})

	await knex.schema.createTable('project_skills', (table) => {
		table
			.uuid('project_id')
			.notNullable()
			.references('id')
			.inTable('projects')
			.onDelete('CASCADE')
		table.uuid('skill_id').notNullable().references('id').inTable('skills').onDelete('CASCADE')
		table.timestamp('created_at').defaultTo(knex.fn.now())

		table.primary(['project_id', 'skill_id'])
		table.index('skill_id')
	})

	await knex.schema.createTable('project_attachments', (table) => {
		table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
		table
			.uuid('project_id')
			.notNullable()
			.references('id')
			.inTable('projects')
			.onDelete('CASCADE')
		table.string('filename', 255).notNullable()
		table.text('file_url').notNullable()
		table.string('mime_type', 100)
		table.integer('file_size_bytes')
		table.timestamp('created_at').defaultTo(knex.fn.now())

		table.index('project_id')
	})

	await knex.schema.createTable('applications', (table) => {
		table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
		table
			.uuid('project_id')
			.notNullable()
			.references('id')
			.inTable('projects')
			.onDelete('CASCADE')
		table
			.text('freelancer_id')
			.notNullable()
			.references('id')
			.inTable('users')
			.onDelete('CASCADE')
		table.text('cover_letter').notNullable()
		table.integer('proposed_price').notNullable()
		table.timestamp('proposed_deadline')
		table.string('status', 30).notNullable().defaultTo('submitted')
		table.timestamp('created_at').defaultTo(knex.fn.now())
		table.timestamp('updated_at').defaultTo(knex.fn.now())

		table.unique(['project_id', 'freelancer_id'])
		table.index('freelancer_id')
		table.index(['project_id', 'status'])
		table.index(['freelancer_id', 'created_at'])
	})
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTableIfExists('applications')
	await knex.schema.dropTableIfExists('project_attachments')
	await knex.schema.dropTableIfExists('project_skills')
	await knex.schema.dropTableIfExists('projects')
}
