import { createHash } from 'node:crypto'
import { customAlphabet } from 'nanoid'

const FALLBACK_RANDOM_SUFFIX = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 8)
const MAX_NICKNAME_LENGTH = 30
const STABLE_SUFFIX_LENGTH = 8
const LEGACY_HASHED_NICKNAME = /^u[a-f0-9]{20}$/i
const LEGACY_RANDOM_NICKNAME = /^user-[a-z0-9]{12}$/i

const CYRILLIC_TO_LATIN_MAP: Record<string, string> = {
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
}

function transliterateToLatin(value: string): string {
	return Array.from(value)
		.map((char) => CYRILLIC_TO_LATIN_MAP[char] ?? char)
		.join('')
}

export function slugifyNicknameSeed(name: string | null | undefined): string {
	const latinValue = transliterateToLatin((name ?? '').trim().toLowerCase())

	return latinValue
		.normalize('NFKD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
		.replace(/-{2,}/g, '-')
}

function createStableNicknameSuffix(userId: string, length = STABLE_SUFFIX_LENGTH): string {
	return createHash('sha256').update(userId).digest('hex').slice(0, length)
}

export function isLegacyFallbackNickname(nickname: string | null | undefined): boolean {
	if (!nickname) return false

	return LEGACY_HASHED_NICKNAME.test(nickname) || LEGACY_RANDOM_NICKNAME.test(nickname)
}

export function generateFallbackNickname(name: string | null | undefined, userId: string): string {
	const slug = slugifyNicknameSeed(name)

	if (!slug) {
		return `user-${FALLBACK_RANDOM_SUFFIX()}`
	}

	const suffix = createStableNicknameSuffix(userId)
	const maxSlugLength = MAX_NICKNAME_LENGTH - suffix.length - 1
	const trimmedSlug = slug.slice(0, maxSlugLength).replace(/-+$/g, '')

	if (!trimmedSlug) {
		return `user-${FALLBACK_RANDOM_SUFFIX()}`
	}

	return `${trimmedSlug}-${suffix}`
}
