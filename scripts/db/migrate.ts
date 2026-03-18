import knex from 'knex'
import {
	pluralize,
	printEmpty,
	printError,
	printInfo,
	printListItem,
	printSection,
	printSuccess,
} from '../utils/cli-utils'
import { getEnvironment, getKnexConfig, printPendingMigrations } from './migrate-shared'

async function main() {
	const environment = getEnvironment()
	const db = knex(getKnexConfig(environment))

	try {
		printEmpty()
		printSection('Database Migrations')
		printInfo('Using environment: ' + environment)

		const [completedBefore, pendingBefore] = await db.migrate.list()

		printPendingMigrations('Status Before', pendingBefore)
		printInfo('Completed ' + pluralize(completedBefore.length, 'migration') + '.')

		if (pendingBefore.length === 0) {
			printEmpty()
			printSuccess('Database is already up to date.')
			printEmpty()
			process.exit(0)
		}

		printEmpty()
		printSection('Running Migrations')
		const [batchNumber, completedNow] = await db.migrate.latest()

		printSuccess(
			'Applied ' +
				pluralize(completedNow.length, 'migration') +
				' in batch ' +
				batchNumber +
				'.',
		)
		completedNow.forEach((migration: string) => {
			printListItem(migration)
		})

		const [completedAfter, pendingAfter] = await db.migrate.list()

		printPendingMigrations('Status After', pendingAfter)
		printInfo('Completed ' + pluralize(completedAfter.length, 'migration') + '.')

		printEmpty()
		process.exit(0)
	} catch (error) {
		printEmpty()
		printError('Migration failed: ' + String(error))
		printEmpty()
		process.exit(1)
	} finally {
		await db.destroy()
	}
}

main()
