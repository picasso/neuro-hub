import { createHash } from 'node:crypto'
import { customAlphabet } from 'nanoid'
import type { Knex } from 'knex'

const MIGRATION_MAX_NICKNAME_LENGTH = 30
const MIGRATION_STABLE_SUFFIX_LENGTH = 8
const migrationRandomSuffix = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 8)

const MIGRATION_CYRILLIC_TO_LATIN_MAP: Record<string, string> = {
	а: 'a',
	б: 'b',
	в: 'v',
	г: 'g',
	д: 'd',
	е: 'e',
	ё: 'e',
	ж: 'zh',
	з: 'z',
	и: 'i',
	й: 'y',
	к: 'k',
	л: 'l',
	м: 'm',
	н: 'n',
	о: 'o',
	п: 'p',
	р: 'r',
	с: 's',
	т: 't',
	у: 'u',
	ф: 'f',
	х: 'h',
	ц: 'ts',
	ч: 'ch',
	ш: 'sh',
	щ: 'sch',
	ъ: '',
	ы: 'y',
	ь: '',
	э: 'e',
	ю: 'yu',
	я: 'ya',
	є: 'ye',
	і: 'i',
	ї: 'yi',
	ґ: 'g',
}

function transliterateToLatin(value: string): string {
	return Array.from(value)
		.map((char) => MIGRATION_CYRILLIC_TO_LATIN_MAP[char] ?? char)
		.join('')
}

function slugifyNicknameSeed(name: string | null | undefined): string {
	const latinValue = transliterateToLatin((name ?? '').trim().toLowerCase())

	return latinValue
		.normalize('NFKD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
		.replace(/-{2,}/g, '-')
}

function createStableNicknameSuffix(userId: string): string {
	return createHash('sha256')
		.update(userId)
		.digest('hex')
		.slice(0, MIGRATION_STABLE_SUFFIX_LENGTH)
}

function createMigrationFallbackNickname(name: string | null | undefined, userId: string): string {
	const slug = slugifyNicknameSeed(name)

	if (!slug) {
		return `user-${migrationRandomSuffix()}`
	}

	const suffix = createStableNicknameSuffix(userId)
	const maxSlugLength = MIGRATION_MAX_NICKNAME_LENGTH - suffix.length - 1
	const trimmedSlug = slug.slice(0, maxSlugLength).replace(/-+$/g, '')

	if (!trimmedSlug) {
		return `user-${migrationRandomSuffix()}`
	}

	return `${trimmedSlug}-${suffix}`
}

export async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable('languages', (table) => {
		table.string('code', 16).primary()
		table.string('name', 255).notNullable()
		table.string('native_name', 255).notNullable()
		table.integer('sort_order').notNullable().defaultTo(0)
	})

	await knex.schema.alterTable('user_profiles', (table) => {
		table.string('nickname', 32).nullable()
		table.string('location', 255).nullable()
	})

	const profiles = await knex('user_profiles').select(['user_id', 'name']).whereNull('nickname')

	for (const profile of profiles) {
		await knex('user_profiles')
			.where('user_id', profile.user_id)
			.update({
				nickname: createMigrationFallbackNickname(profile.name, profile.user_id),
			})
	}

	await knex.raw('ALTER TABLE user_profiles ALTER COLUMN nickname SET NOT NULL')
	await knex.raw('CREATE UNIQUE INDEX user_profiles_nickname_key ON user_profiles (nickname)')

	await knex.raw(`
		DROP INDEX IF EXISTS user_profiles_search_idx
	`)
	await knex.raw(`
		DROP INDEX IF EXISTS user_profiles_name_trgm_idx
	`)
	await knex.raw(`
		ALTER TABLE user_profiles DROP COLUMN IF EXISTS search_vector
	`)

	await knex.raw(`
		ALTER TABLE user_profiles
		ADD COLUMN search_vector tsvector
		GENERATED ALWAYS AS (
			setweight(to_tsvector('english', coalesce(name, '')), 'A') ||
			setweight(to_tsvector('english', coalesce(nickname, '')), 'A') ||
			setweight(to_tsvector('english', coalesce(location, '')), 'B') ||
			setweight(to_tsvector('english', coalesce(bio, '')), 'B')
		) STORED
	`)

	await knex.raw(`
		CREATE INDEX user_profiles_search_idx
		ON user_profiles
		USING GIN (search_vector)
	`)

	await knex.raw(`
		CREATE INDEX user_profiles_name_trgm_idx
		ON user_profiles
		USING GIN (name gin_trgm_ops)
	`)

	await knex.schema.createTable('user_languages', (table) => {
		table.text('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE')
		table
			.string('language_code', 16)
			.notNullable()
			.references('code')
			.inTable('languages')
			.onDelete('CASCADE')
		table.string('lang_level', 32).notNullable()
		table.timestamp('created_at').defaultTo(knex.fn.now())
		table.primary(['user_id', 'language_code'])
		table.index(['user_id'])
		table.index(['language_code'])
	})

	await knex.raw(`
		ALTER TABLE user_languages
		ADD CONSTRAINT user_languages_lang_level_check
		CHECK (lang_level IN ('basic', 'conversational', 'fluent', 'native'))
	`)
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTableIfExists('user_languages')
	await knex.schema.dropTableIfExists('languages')

	await knex.raw(`
		DROP INDEX IF EXISTS user_profiles_search_idx
	`)
	await knex.raw(`
		DROP INDEX IF EXISTS user_profiles_name_trgm_idx
	`)
	await knex.raw(`
		ALTER TABLE user_profiles DROP COLUMN IF EXISTS search_vector
	`)

	await knex.raw(`
		ALTER TABLE user_profiles
		ADD COLUMN search_vector tsvector
		GENERATED ALWAYS AS (
			setweight(to_tsvector('english', coalesce(name, '')), 'A') ||
			setweight(to_tsvector('english', coalesce(bio, '')), 'B')
		) STORED
	`)

	await knex.raw(`
		CREATE INDEX user_profiles_search_idx
		ON user_profiles
		USING GIN (search_vector)
	`)

	await knex.raw(`
		CREATE INDEX user_profiles_name_trgm_idx
		ON user_profiles
		USING GIN (name gin_trgm_ops)
	`)

	await knex.raw('DROP INDEX IF EXISTS user_profiles_nickname_key')
	await knex.schema.alterTable('user_profiles', (table) => {
		table.dropColumn('nickname')
		table.dropColumn('location')
	})
}
