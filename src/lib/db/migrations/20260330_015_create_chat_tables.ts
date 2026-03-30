import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
	await knex.raw('CREATE EXTENSION IF NOT EXISTS "pgcrypto"')

	await knex.schema.createTable('conversations', (table) => {
		table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
		table.string('context_type', 50).notNullable()
		table.uuid('context_id').notNullable()
		table
			.text('customer_id')
			.notNullable()
			.references('id')
			.inTable('users')
			.onDelete('CASCADE')
		table
			.text('freelancer_id')
			.notNullable()
			.references('id')
			.inTable('users')
			.onDelete('CASCADE')
		table.text('created_by').notNullable().references('id').inTable('users').onDelete('CASCADE')
		table.timestamp('created_at').defaultTo(knex.fn.now())
		table.timestamp('updated_at').defaultTo(knex.fn.now())

		table.unique(['context_type', 'context_id', 'customer_id', 'freelancer_id'])
		table.index(['customer_id', 'updated_at'])
		table.index(['freelancer_id', 'updated_at'])
		table.index(['context_type', 'context_id'])
	})

	await knex.schema.createTable('conversation_members', (table) => {
		table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
		table
			.uuid('conversation_id')
			.notNullable()
			.references('id')
			.inTable('conversations')
			.onDelete('CASCADE')
		table.text('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE')
		table.string('role', 30).notNullable()
		table.timestamp('created_at').defaultTo(knex.fn.now())

		table.unique(['conversation_id', 'user_id'])
		table.unique(['conversation_id', 'role'])
		table.index(['user_id', 'created_at'])
	})

	await knex.schema.createTable('messages', (table) => {
		table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
		table
			.uuid('conversation_id')
			.notNullable()
			.references('id')
			.inTable('conversations')
			.onDelete('CASCADE')
		table.text('sender_id').notNullable().references('id').inTable('users').onDelete('CASCADE')
		table.text('text').notNullable()
		table.timestamp('created_at').defaultTo(knex.fn.now())

		table.index(['conversation_id', 'created_at'])
		table.index(['conversation_id', 'created_at', 'id'])
		table.index(['sender_id', 'created_at'])
	})

	await knex.schema.createTable('message_reads', (table) => {
		table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
		table
			.uuid('conversation_id')
			.notNullable()
			.references('id')
			.inTable('conversations')
			.onDelete('CASCADE')
		table.text('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE')
		table
			.uuid('last_read_message_id')
			.notNullable()
			.references('id')
			.inTable('messages')
			.onDelete('CASCADE')
		table.timestamp('last_read_message_created_at').notNullable()
		table.timestamp('read_at').notNullable().defaultTo(knex.fn.now())
		table.timestamp('created_at').defaultTo(knex.fn.now())
		table.timestamp('updated_at').defaultTo(knex.fn.now())

		table.unique(['conversation_id', 'user_id'])
		table.index(['user_id', 'updated_at'])
	})
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTableIfExists('message_reads')
	await knex.schema.dropTableIfExists('messages')
	await knex.schema.dropTableIfExists('conversation_members')
	await knex.schema.dropTableIfExists('conversations')
}
