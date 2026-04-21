import { kysely } from '@/lib/db'

export type PublicUserLanguage = {
	code: string
	name: string
	nativeName: string
	langLevel: 'basic' | 'conversational' | 'fluent' | 'native'
}

export async function getPublicLanguagesByUserIds(userIds: string[]) {
	const uniqueUserIds = Array.from(new Set(userIds))

	if (uniqueUserIds.length === 0) {
		return new Map<string, PublicUserLanguage[]>()
	}

	const rows = await kysely
		.selectFrom('user_languages as user_language')
		.innerJoin('languages as language', 'language.code', 'user_language.language_code')
		.select([
			'user_language.user_id as userId',
			'language.code as code',
			'language.name as name',
			'language.native_name as nativeName',
			'user_language.lang_level as langLevel',
		])
		.where('user_language.user_id', 'in', uniqueUserIds)
		.orderBy('language.sort_order', 'asc')
		.orderBy('language.name', 'asc')
		.execute()

	const map = new Map<string, PublicUserLanguage[]>()

	for (const row of rows) {
		const languages = map.get(row.userId) ?? []
		languages.push({
			code: row.code,
			name: row.name,
			nativeName: row.nativeName,
			langLevel: row.langLevel as PublicUserLanguage['langLevel'],
		})
		map.set(row.userId, languages)
	}

	return map
}
