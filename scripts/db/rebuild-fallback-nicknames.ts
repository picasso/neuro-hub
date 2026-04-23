import { kysely } from '../../src/lib/db'
import {
	generateFallbackNickname,
	isLegacyFallbackNickname,
} from '../../src/lib/user-profile/nickname'
import {
	printDataRow,
	printEmpty,
	printError,
	printInfo,
	printListItem,
	printSection,
	printSuccess,
	printUsage,
} from '../utils/cli-utils'

type ProfileNicknameRow = {
	userId: string
	nickname: string | null
	profileName: string | null
	userName: string | null
}

function parseArgs(): { listAll: boolean; showHelp: boolean; unknown: string[] } {
	const raw = process.argv.slice(2)
	const listAll = raw.includes('--list')
	const showHelp = raw.includes('--help') || raw.includes('-h')
	const known = new Set(['--list', '--help', '-h'])
	const unknown = raw.filter((arg) => !known.has(arg))
	return { listAll, showHelp, unknown }
}

async function fetchProfileNicknames(): Promise<ProfileNicknameRow[]> {
	return kysely
		.selectFrom('user_profiles as profile')
		.innerJoin('users as user', 'user.id', 'profile.user_id')
		.select([
			'profile.user_id as userId',
			'profile.nickname as nickname',
			'profile.name as profileName',
			'user.name as userName',
		])
		.execute()
}

async function listAllNicknames() {
	printEmpty()
	printSection('All Current Nicknames')

	const rows = await fetchProfileNicknames()
	const sorted = [...rows].sort((a, b) => {
		const left = a.nickname ?? ''
		const right = b.nickname ?? ''
		return left.localeCompare(right, undefined, { sensitivity: 'base' })
	})

	if (sorted.length === 0) {
		printInfo('No profiles found.')
		printEmpty()
		return
	}

	printSuccess(`Found ${sorted.length} nickname(s)`)
	printEmpty()
	for (const row of sorted) {
		const label = row.nickname ?? '(null)'
		printListItem(`${label} · ${row.userId}`)
	}
	printEmpty()
}

async function main() {
	const { listAll, showHelp, unknown } = parseArgs()

	if (showHelp) {
		printEmpty()
		printUsage([
			'  yarn db:rebuild-fallback-nicknames              # Rebuild legacy fallback nicknames',
			'  yarn db:rebuild-fallback-nicknames --list       # List all current nicknames',
			'  yarn db:rebuild-fallback-nicknames --help       # Show this help',
		])
		printEmpty()
		process.exit(0)
	}

	if (unknown.length > 0) {
		printEmpty()
		printError(`Unknown argument(s): ${unknown.join(', ')}`)
		printEmpty()
		printUsage([
			'  yarn db:rebuild-fallback-nicknames              # Rebuild legacy fallback nicknames',
			'  yarn db:rebuild-fallback-nicknames --list       # List all current nicknames',
		])
		printEmpty()
		process.exit(1)
	}

	if (listAll) {
		await listAllNicknames()
		process.exit(0)
	}

	printEmpty()
	printSection('Rebuild Fallback Nicknames')

	const rows = await fetchProfileNicknames()

	const targets = rows.filter((row) => isLegacyFallbackNickname(row.nickname))

	if (targets.length === 0) {
		printSuccess('No legacy fallback nicknames found.')
		printEmpty()
		process.exit(0)
	}

	printSuccess(`Found ${targets.length} legacy fallback nickname(s) to rebuild`)

	let updatedCount = 0

	for (const row of targets) {
		const nextNickname = generateFallbackNickname(row.profileName ?? row.userName, row.userId)

		if (nextNickname === row.nickname) {
			continue
		}

		await kysely
			.updateTable('user_profiles')
			.set({
				nickname: nextNickname,
				updated_at: new Date(),
			})
			.where('user_id', '=', row.userId)
			.execute()

		updatedCount += 1
		printDataRow([
			['User ID', row.userId],
			['Old', row.nickname],
			['New', nextNickname],
		])
	}

	printEmpty()
	printInfo(
		'This script only updates nicknames matching legacy fallback patterns: ' +
			'^u[0-9a-f]{20}$ or ^user-[a-z0-9]{12}$.',
	)
	printSuccess(`Updated ${updatedCount} nickname(s).`)
	printEmpty()
	process.exit(0)
}

main().catch((error) => {
	printEmpty()
	printError('Error rebuilding fallback nicknames: ' + error)
	printEmpty()
	process.exit(1)
})
