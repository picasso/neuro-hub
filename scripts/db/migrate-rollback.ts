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
		printSection('Migration Rollback')
		printInfo('Using environment: ' + environment)

		const [completedBefore, pendingBefore] = await db.migrate.list()

		printPendingMigrations('Status Before', pendingBefore)
		printInfo('Completed ' + pluralize(completedBefore.length, 'migration') + '.')

		if (completedBefore.length === 0) {
			printEmpty()
			printSuccess('No applied migrations to roll back.')
			printEmpty()
			process.exit(0)
		}

		printEmpty()
		printSection('Rolling Back')
		const [batchNumber, rolledBack] = await db.migrate.rollback()

		if (rolledBack.length === 0) {
			printSuccess('Nothing was rolled back.')
		} else {
			printSuccess(
				'Rolled back ' +
					pluralize(rolledBack.length, 'migration') +
					' from batch ' +
					batchNumber +
					'.',
			)
			rolledBack.forEach((migration: string) => {
				printListItem(migration)
			})
		}

		const [completedAfter, pendingAfter] = await db.migrate.list()

		printPendingMigrations('Status After', pendingAfter)
		printInfo('Completed ' + pluralize(completedAfter.length, 'migration') + '.')

		printEmpty()
		process.exit(0)
	} catch (error) {
		printEmpty()
		printError('Rollback failed: ' + String(error))
		printEmpty()
		process.exit(1)
	} finally {
		await db.destroy()
	}
}

main()
