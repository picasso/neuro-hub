import pg from 'pg'

const { Pool } = pg

export const pool = new Pool({
	connectionString:
		process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/neurohub',
	max: 20,
	min: 2,
	idleTimeoutMillis: 30000,
	connectionTimeoutMillis: 2000,
})

pool.on('error', (err) => {
	console.error('Unexpected error on idle client', err)
})
