import knex, { type Knex } from 'knex'

const knexConfig: Knex.Config = {
	client: 'pg',
	connection: process.env.DATABASE_URL || {
		host: 'localhost',
		port: 5433,
		database: 'neurogig',
		user: 'postgres',
		password: 'postgres',
	},
	pool: {
		min: 0,
		max: Number(process.env.KNEX_POOL_MAX ?? 5),
	},
}

// Knex is only needed for scripts/migrations.
// Keep it out of `@/lib/db` runtime entry to avoid opening extra pools in Next.js.
export const db: Knex = knex(knexConfig)

export async function closeKnexConnection(): Promise<void> {
	await db.destroy()
}
