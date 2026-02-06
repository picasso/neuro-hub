import type { Knex } from 'knex'

const config: { [key: string]: Knex.Config } = {
	development: {
		client: 'postgresql',
		connection: {
			host: 'localhost',
			port: 5432,
			database: 'neurogig',
			user: 'postgres',
			password: 'postgres',
			ssl: false,
		},
		pool: {
			min: 2,
			max: 10,
		},
		migrations: {
			tableName: 'knex_migrations',
			directory: './src/lib/db/migrations',
		},
		seeds: {
			directory: './src/lib/db/seeds',
		},
	},
	production: {
		client: 'postgresql',
		connection: process.env.DATABASE_URL
			? {
					connectionString: process.env.DATABASE_URL,
					ssl: process.env.DATABASE_URL.includes('railway.app')
						? { rejectUnauthorized: false }
						: undefined,
				}
			: undefined,
		pool: {
			min: 2,
			max: 10,
		},
		migrations: {
			tableName: 'knex_migrations',
			directory: './src/lib/db/migrations',
		},
		seeds: {
			directory: './src/lib/db/seeds',
		},
	},
}

export default config
