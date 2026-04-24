import { readdir } from 'node:fs/promises'
import path from 'node:path'
import knex from 'knex'
import { getExpectedMockUsers } from '../../src/lib/dev/mock-users-seed'
import {
	pluralize,
	printEmpty,
	printError,
	printInfo,
	printListItem,
	printSection,
	printSuccess,
	printWarning,
} from '../utils/cli-utils'
import { getEnvironment, getKnexConfig } from './migrate-shared'

const SEEDS_DIR = path.join(process.cwd(), 'src/lib/db/seeds')
const SEED_FILE_PATTERN = /^\d+_.*\.[tj]s$/

async function listSeedFilesInOrder(): Promise<string[]> {
	const entries = await readdir(SEEDS_DIR)
	return entries
		.filter((f) => SEED_FILE_PATTERN.test(f))
		.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
}

async function main() {
	const environment = getEnvironment()
	const db = knex(getKnexConfig(environment))

	try {
		printEmpty()
		printSection('Seed Status')
		printInfo('Using environment: ' + environment)

		const files = await listSeedFilesInOrder()
		printEmpty()
		printSection('Seed files (run order)')
		if (files.length === 0) {
			printInfo('No seed files found in ' + SEEDS_DIR)
		} else {
			printSuccess(pluralize(files.length, 'seed file') + ' registered with Knex.')
			files.forEach((f) => printListItem(f))
		}

		const sRows = (await db('skills').count('* as count')) as { count: string }[]
		const lRows = (await db('languages').count('* as count')) as { count: string }[]
		const skillsN = Number(sRows[0]?.count ?? 0)
		const languagesN = Number(lRows[0]?.count ?? 0)

		printEmpty()
		printSection('Reference data in database')
		printDataCounts(skillsN, languagesN)

		const expectedMock = getExpectedMockUsers()
		const mockIds = expectedMock.map((e) => e.id)
		const foundMockRows =
			mockIds.length === 0
				? []
				: ((await db('users').select('id').whereIn('id', mockIds)) as { id: string }[])
		const presentMockIds = new Set(foundMockRows.map((r) => r.id))
		const missingMock = expectedMock.filter((e) => !presentMockIds.has(e.id))
		const flN = expectedMock.filter((e) => e.group === 'freelancer').length
		const clN = expectedMock.filter((e) => e.group === 'client').length

		printEmpty()
		printSection('Mock users (synthetic)')
		if (expectedMock.length === 0) {
			printInfo('No mock user definitions; nothing to check.')
		} else {
			printInfo(
				'Expected: ' +
					pluralize(expectedMock.length, 'user') +
					' (' +
					pluralize(flN, 'freelancer') +
					', ' +
					pluralize(clN, 'client') +
					').',
			)
			if (missingMock.length === 0) {
				printSuccess(
					'All ' +
						pluralize(presentMockIds.size, 'mock user') +
						' present in the database.',
				)
			} else {
				printWarning(
					pluralize(presentMockIds.size, 'user') +
						' in the database, ' +
						pluralize(missingMock.length, 'user') +
						' missing.',
				)
				if (missingMock.length !== expectedMock.length) {
					missingMock.forEach((m) => {
						printListItem(m.id + ' (' + m.group + ')')
					})
				}
				printEmpty()
				printInfo('Run: yarn db:seed:mock-users')
			}
		}

		printEmpty()
		printInfo('Knex does not persist which seeds last ran. Counts show current table state.')
		printEmpty()
	} finally {
		await db.destroy()
	}
}

function printDataCounts(skills: number, languages: number) {
	printSuccess('skills:     ' + pluralize(skills, 'row'))
	printSuccess('languages:  ' + pluralize(languages, 'row'))
}

main()
	.then(() => {
		process.exit(0)
	})
	.catch((error) => {
		printEmpty()
		printError('Unexpected error: ' + String(error))
		printEmpty()
		process.exit(1)
	})
