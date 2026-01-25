import { Kysely, PostgresDialect } from 'kysely'
import { pool } from './pool'
import type { DB } from '@/types/database'

const dialect = new PostgresDialect({
	pool,
})

export const kysely = new Kysely<DB>({
	dialect,
})
