import { includes } from 'lodash'
import pg from 'pg'

const { Pool } = pg

const connectionString = process.env.DATABASE_URL
const isRailway = includes(connectionString, 'railway.app')
const isLocalhost = includes(connectionString, 'localhost') || !connectionString

export const pool = new Pool(
	isLocalhost
		? {
				host: 'localhost',
				port: 5433,
				database: 'neurogig',
				user: 'postgres',
				password: 'postgres',
				max: 20,
				min: 2,
				idleTimeoutMillis: 30000,
				connectionTimeoutMillis: 2000,
				ssl: false,
			}
		: {
				connectionString,
				max: 20,
				min: 2,
				idleTimeoutMillis: 30000,
				connectionTimeoutMillis: 2000,
				ssl: isRailway
					? {
							rejectUnauthorized: false,
						}
					: undefined,
			},
)

pool.on('error', (err) => {
	console.error('Unexpected error on idle client', err)
})
