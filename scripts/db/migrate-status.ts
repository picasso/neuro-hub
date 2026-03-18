import knex from 'knex'
import { pluralize, printEmpty, printError, printInfo, printSection } from '../utils/cli-utils'
import { getEnvironment, getKnexConfig, printPendingMigrations } from './migrate-shared'

async function main() {
	const environment = getEnvironment()
	const db = knex(getKnexConfig(environment))

	try {
		printEmpty()
		printSection('Migration Status')
		printInfo('Using environment: ' + environment)

		const [completed, pending] = await db.migrate.list()

		printPendingMigrations('Pending Migrations', pending)

		printEmpty()
		printSection('Completed Migrations')
		printInfo('Completed ' + pluralize(completed.length, 'migration') + '.')
		completed.forEach((migration: { name: string }) => {
			printInfo(migration.name)
		})

		printEmpty()
		process.exit(0)
	} catch (error) {
		printEmpty()
		printError('Failed to read migration status: ' + String(error))
		printEmpty()
		process.exit(1)
	} finally {
		await db.destroy()
	}
}

main()
