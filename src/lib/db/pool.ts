import pg, { type Pool as PgPool } from 'pg'

const { Pool } = pg

const connectionString = process.env.DATABASE_URL ?? ''
const isRailway = connectionString.includes('railway.app')
const isLocalhost = connectionString.includes('localhost') || !connectionString

declare global {
	var __neuroGigPgPool: PgPool | undefined
}

function getPoolConfig(): pg.PoolConfig {
	const defaultMax = process.env.NODE_ENV === 'production' ? 10 : 5
	const max = Number(process.env.PG_POOL_MAX ?? defaultMax)

	// `min > 0` + hot reload in Next.js dev can quickly exhaust DB connections.
	const min = 0

	return isLocalhost
		? {
				host: 'localhost',
				port: 5433,
				database: 'neurogig',
				user: 'postgres',
				password: 'postgres',
				max,
				min,
				idleTimeoutMillis: 30_000,
				connectionTimeoutMillis: 2_000,
				allowExitOnIdle: true,
				ssl: false,
			}
		: {
				connectionString,
				max,
				min,
				idleTimeoutMillis: 30_000,
				connectionTimeoutMillis: 2_000,
				allowExitOnIdle: true,
				ssl: isRailway
					? {
							rejectUnauthorized: false,
						}
					: undefined,
			}
}

const globalPool = globalThis.__neuroGigPgPool

export const pool: PgPool = globalPool ?? new Pool(getPoolConfig())

// in Next.js dev mode modules can be re-evaluated; keep a single pool.
if (process.env.NODE_ENV !== 'production' && !globalPool) {
	globalThis.__neuroGigPgPool = pool
}

pool.on('error', (err) => {
	console.error('Unexpected error on idle client', err)
})
