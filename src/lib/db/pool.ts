import pg from 'pg'

const { Pool } = pg

const isRailway = process.env.DATABASE_URL?.includes('railway.app')

export const pool = new Pool({
	connectionString:
		process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/neurohub',
	max: 20,
	min: 2,
	idleTimeoutMillis: 30000,
	connectionTimeoutMillis: 2000,
	ssl: isRailway
		? {
				rejectUnauthorized: false,
			}
		: undefined,
})

pool.on('error', (err) => {
	console.error('Unexpected error on idle client', err)
})
