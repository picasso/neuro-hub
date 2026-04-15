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
	printSection,
	printSuccess,
} from '../utils/cli-utils'

async function main() {
	printEmpty()
	printSection('Rebuild Fallback Nicknames')

	const rows = await kysely
		.selectFrom('user_profiles as profile')
		.innerJoin('users as user', 'user.id', 'profile.user_id')
		.select([
			'profile.user_id as userId',
			'profile.nickname as nickname',
			'profile.name as profileName',
			'user.name as userName',
		])
		.execute()

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
