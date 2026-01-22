import knex, { type Knex } from 'knex'
import { pool } from './pool'

const knexConfig: Knex.Config = {
	client: 'pg',
	connection: process.env.DATABASE_URL || {
		host: 'localhost',
		port: 5432,
		database: 'neurohub',
		user: 'postgres',
		password: 'postgres',
	},
	pool: {
		min: 2,
		max: 10,
	},
}

export const db: Knex = knex(knexConfig)

export { kysely } from './kysely'
export { pool } from './pool'

export const testConnection = async (): Promise<boolean> => {
	try {
		await pool.query('SELECT 1')
		return true
	} catch (error) {
		console.error('Database connection failed:', error)
		return false
	}
}

export const closeConnection = async (): Promise<void> => {
	await db.destroy()
	await pool.end()
}

export default db
