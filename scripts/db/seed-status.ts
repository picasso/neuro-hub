import { readdir } from 'node:fs/promises'
import path from 'node:path'
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
