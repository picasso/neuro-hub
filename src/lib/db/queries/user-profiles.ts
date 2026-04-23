import { kysely } from '@/lib/db'
import { generateFallbackNickname } from '@/lib/user-profile/nickname'

export type UserProfileLanguageOption = {
	code: string
	name: string
	nativeName: string
}

export async function ensureUserProfileRow(userId: string): Promise<void> {
	const user = await kysely
		.selectFrom('users')
		.select(['id', 'name'])
		.where('id', '=', userId)
		.executeTakeFirst()

	if (!user) {
		throw new Error('User not found while ensuring profile row')
	}

	const row = await kysely
		.selectFrom('user_profiles')
		.select('user_id')
		.where('user_id', '=', userId)
		.executeTakeFirst()

	if (row) return

	let attempt = 0
	while (attempt < 8) {
		attempt += 1
		try {
			await kysely
				.insertInto('user_profiles')
				.values({
					id: userId,
					user_id: userId,
					nickname: generateFallbackNickname(user.name, userId),
					updated_at: new Date(),
				})
				.execute()
			return
		} catch (error) {
			if ((error as { code?: string })?.code === '23505') continue
			throw error
		}
	}

	throw new Error('Could not allocate a unique nickname')
}

export async function listUserProfileLanguages(): Promise<UserProfileLanguageOption[]> {
	const rows = await kysely
		.selectFrom('languages')
		.select(['code', 'name', 'native_name as nativeName'])
		.orderBy('sort_order', 'asc')
		.orderBy('name', 'asc')
		.execute()

	return rows.map((row) => ({
		code: row.code,
		name: row.name,
		nativeName: row.nativeName,
	}))
}

export async function isNicknameAvailableForUser(
	userId: string,
	nickname: string,
): Promise<boolean> {
	const row = await kysely
		.selectFrom('user_profiles')
		.select('user_id')
		.where('nickname', '=', nickname.toLowerCase())
		.executeTakeFirst()

	return !row || row.user_id === userId
}
