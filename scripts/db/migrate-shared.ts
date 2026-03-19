import knexfile from '../../knexfile'
import {
	pluralize,
	printEmpty,
	printListItem,
	printSection,
	printSuccess,
	printWarning,
} from '../utils/cli-utils'
import type { Knex } from 'knex'

export function getEnvironment(): string {
	return process.env.KNEX_ENV ?? process.env.NODE_ENV ?? 'development'
}

export function getKnexConfig(environment: string): Knex.Config {
	const config = knexfile[environment]

	if (!config) {
		throw new Error('Unknown Knex environment: ' + environment)
	}

	return config
}

function getMigrationName(migration: unknown): string {
	if (typeof migration === 'string') {
		return migration
	}

	if (
		typeof migration === 'object' &&
		migration !== null &&
		'name' in migration &&
		typeof migration.name === 'string'
	) {
		return migration.name
	}

	return String(migration)
}

export function printPendingMigrations(title: string, migrations: unknown[]) {
	printEmpty()
	printSection(title)

	if (migrations.length === 0) {
		printSuccess('No pending migrations.')
		return
	}

	printWarning('Found ' + pluralize(migrations.length, 'pending migration', true) + '.')
	migrations.forEach((migration) => {
		printListItem(getMigrationName(migration))
	})
}
