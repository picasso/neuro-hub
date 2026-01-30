import { sql } from 'kysely'
import { kysely } from '../../src/lib/db'
import {
	pluralize,
	printEmpty,
	printError,
	printInfo,
	printListItem,
	printSection,
	printSuccess,
	printText,
	printWarning,
} from '../utils/cli-utils'

async function getAllTables(): Promise<string[]> {
	const result = await sql<{ table_name: string }>`
		SELECT table_name
		FROM information_schema.tables
		WHERE table_schema = 'public'
		AND table_type = 'BASE TABLE'
	`.execute(kysely)

	return result.rows.map((row) => row.table_name)
}

async function dropAllTables(force: boolean = false) {
	const databaseUrl = process.env.DATABASE_URL || ''

	if (!databaseUrl) {
		printEmpty()
		printError('DATABASE_URL environment variable is not set')
		printEmpty()
		process.exit(1)
	}

	if (databaseUrl.includes('localhost') || databaseUrl.includes('127.0.0.1')) {
		printEmpty()
		printError('Safety check: Cannot drop tables on localhost database')
		printText('   Use this script only for remote databases (Railway, etc.)')
		printEmpty()
		process.exit(1)
	}

	printEmpty()
	printSection('Drop All Tables')
	printInfo('Database: ' + (databaseUrl.split('@')[1]?.split('?')[0] || 'unknown'))

	const tables = await getAllTables()

	if (tables.length === 0) {
		printEmpty()
		printSuccess('No tables found. Database is already empty.')
		printEmpty()
		process.exit(0)
	}

	printEmpty()
	printSuccess('Found ' + pluralize(tables.length, 'table'))
	tables.forEach((table) => {
		printListItem(table)
	})

	if (!force) {
		printEmpty()
		printWarning('This will DROP ALL tables and data!')
		printText('   Run with --force to proceed without confirmation')
		printEmpty()
		process.exit(1)
	}

	printEmpty()
	printInfo('Dropping all tables...')

	for (const table of tables) {
		try {
			await kysely.schema.dropTable(table).cascade().execute()
			printText('  ✓ Dropped: ' + table)
		} catch (error) {
			printError('  Failed to drop ' + table + ': ' + error)
		}
	}

	const remainingTables = await getAllTables()

	if (remainingTables.length === 0) {
		printEmpty()
		printSuccess('All tables dropped successfully!')
	} else {
		printEmpty()
		printWarning(pluralize(remainingTables.length, 'table') + ' still remain')
		remainingTables.forEach((table) => {
			printListItem(table)
		})
		printEmpty()
		process.exit(1)
	}

	printEmpty()
	process.exit(0)
}

const force = process.argv.includes('--force')

dropAllTables(force).catch((error) => {
	printEmpty()
	printError('Error: ' + error)
	printEmpty()
	process.exit(1)
})
