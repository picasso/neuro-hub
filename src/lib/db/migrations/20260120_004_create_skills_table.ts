import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable('skills', (table) => {
		table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
		table.string('name', 100).notNullable().unique()
		table.enum('category', [
			'text_generation',
			'image_generation',
			'video_generation',
			'audio_generation',
			'programming',
			'consulting',
		])
		table.timestamp('created_at').defaultTo(knex.fn.now())

		table.index('category')
	})

	await knex.schema.createTable('user_skills', (table) => {
		table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
		table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE')
		table.uuid('skill_id').notNullable().references('id').inTable('skills').onDelete('CASCADE')
		table.enum('proficiency_level', ['beginner', 'intermediate', 'advanced', 'expert'])
		table.timestamp('created_at').defaultTo(knex.fn.now())

		table.unique(['user_id', 'skill_id'])
		table.index('user_id')
		table.index('skill_id')
	})
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTableIfExists('user_skills')
	await knex.schema.dropTableIfExists('skills')
}
