import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
	await knex.schema.alterTable('users', (table) => {
		table.string('name', 255).nullable()
		table.string('image', 500).nullable()
		table.timestamp('email_verified_at').nullable()
	})

	await knex.raw(`
		UPDATE users
		SET email_verified_at = CASE
			WHEN email_verified = true THEN created_at
			ELSE NULL
		END
	`)

	await knex.schema.createTable('account', (table) => {
		table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
		table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE')
		table.string('account_id', 255).notNullable()
		table.string('provider_id', 255).notNullable()
		table.string('access_token', 1000).nullable()
		table.string('refresh_token', 1000).nullable()
		table.timestamp('expires_at').nullable()
		table.string('password', 255).nullable()
		table.timestamp('created_at').defaultTo(knex.fn.now())
		table.timestamp('updated_at').defaultTo(knex.fn.now())

		table.index('user_id')
		table.index(['provider_id', 'account_id'])
		table.unique(['provider_id', 'account_id'])
	})

	await knex.raw(`
		INSERT INTO account (user_id, account_id, provider_id, password)
		SELECT id, email, 'credential', password_hash
		FROM users
		WHERE password_hash IS NOT NULL
	`)

	await knex.schema.alterTable('sessions', (table) => {
		table.dropColumn('token')
		table.string('ip_address', 45).nullable()
		table.text('user_agent').nullable()
	})

	await knex.schema.createTable('verification', (table) => {
		table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
		table.string('identifier', 255).notNullable()
		table.string('value', 255).notNullable()
		table.timestamp('expires_at').notNullable()
		table.timestamp('created_at').defaultTo(knex.fn.now())

		table.index('identifier')
		table.index(['identifier', 'value'])
	})
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTableIfExists('verification')

	await knex.schema.alterTable('sessions', (table) => {
		table.string('token', 500).notNullable().unique()
		table.dropColumn('ip_address')
		table.dropColumn('user_agent')
	})

	await knex.schema.dropTableIfExists('account')

	await knex.schema.alterTable('users', (table) => {
		table.dropColumn('name')
		table.dropColumn('image')
		table.dropColumn('email_verified_at')
	})
}
