import type { Knex } from 'knex'

const LANGUAGES = [
	{ code: 'en', name: 'English', native_name: 'English', sort_order: 10 },
	{ code: 'ru', name: 'Russian', native_name: 'Русский', sort_order: 20 },
	{ code: 'uk', name: 'Ukrainian', native_name: 'Українська', sort_order: 30 },
	{ code: 'de', name: 'German', native_name: 'Deutsch', sort_order: 40 },
	{ code: 'fr', name: 'French', native_name: 'Français', sort_order: 50 },
	{ code: 'es', name: 'Spanish', native_name: 'Español', sort_order: 60 },
	{ code: 'it', name: 'Italian', native_name: 'Italiano', sort_order: 70 },
	{ code: 'pt', name: 'Portuguese', native_name: 'Português', sort_order: 80 },
	{ code: 'pl', name: 'Polish', native_name: 'Polski', sort_order: 90 },
	{ code: 'nl', name: 'Dutch', native_name: 'Nederlands', sort_order: 100 },
	{ code: 'tr', name: 'Turkish', native_name: 'Türkçe', sort_order: 110 },
	{ code: 'ar', name: 'Arabic', native_name: 'العربية', sort_order: 120 },
	{ code: 'zh', name: 'Chinese', native_name: '中文', sort_order: 130 },
	{ code: 'ja', name: 'Japanese', native_name: '日本語', sort_order: 140 },
	{ code: 'ko', name: 'Korean', native_name: '한국어', sort_order: 150 },
] as const

export async function seed(knex: Knex): Promise<void> {
	for (const row of LANGUAGES) {
		await knex('languages').insert(row).onConflict('code').merge({
			name: row.name,
			native_name: row.native_name,
			sort_order: row.sort_order,
		})
	}
}
