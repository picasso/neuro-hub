import { Kysely, PostgresDialect } from 'kysely'
import pg from 'pg'
import type { DB } from '@/types/database'

const { Pool } = pg

const dialect = new PostgresDialect({
	pool: new Pool({
		connectionString: process.env.DATABASE_URL,
		host: process.env.DATABASE_URL ? undefined : 'localhost',
		port: process.env.DATABASE_URL ? undefined : 5432,
		database: process.env.DATABASE_URL ? undefined : 'neurohub',
		user: process.env.DATABASE_URL ? undefined : 'postgres',
		password: process.env.DATABASE_URL ? undefined : 'postgres',
		max: 10,
		min: 2,
	}),
})

export const kysely = new Kysely<DB>({
	dialect,
})
