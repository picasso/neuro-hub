/**
 * Data and helpers for `scripts/db/seed-mock-users.ts`.
 * Source YAML: `MOCK-USERS.md` (fenced `yaml` block).
 */
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { parse } from 'yaml'

// compatibility base for legacy absolute localhost asset URLs.
// current mock data uses relative public paths like `/mock-users/...`.
const LEGACY_LOCALHOST_ASSET_BASE = 'http://localhost:3000'

export const MOCK_SEED_PASSWORD = 'mock1234' as const

/** Readable local parts → `local@yahoo.com`; nicknames stay route-safe with hyphenated slugs. */
export const FREELANCER_IDENTITY: Record<string, { emailLocal: string; nickname: string }> = {
	mock_ai_fl_01: { emailLocal: 'mira.chen', nickname: 'mira-chen' },
	mock_ai_fl_02: { emailLocal: 'jordan.okoro', nickname: 'jordan-okoro' },
	mock_ai_fl_03: { emailLocal: 'elena.vasquez', nickname: 'elena-vasquez' },
	mock_ai_fl_04: { emailLocal: 'choi.yujin', nickname: 'choi-yujin' },
	mock_ai_fl_05: { emailLocal: 'nina.kowalski', nickname: 'nina-kowalski' },
	mock_ai_fl_06: { emailLocal: 'theo.marin', nickname: 'theo-marin' },
	mock_ai_fl_07: { emailLocal: 'riley.brooks', nickname: 'riley-brooks' },
	mock_ai_fl_08: { emailLocal: 'faris.alfarsi', nickname: 'faris-al-farsi' },
	mock_ai_fl_09: { emailLocal: 'nora.kelly', nickname: 'nora-kelly' },
	mock_ai_fl_10: { emailLocal: 'arman.rahman', nickname: 'arman-rahman' },
	mock_ai_fl_11: { emailLocal: 'lea.schmidt', nickname: 'lea-schmidt' },
	mock_ai_fl_12: { emailLocal: 'camila.rios', nickname: 'camila-rios' },
	mock_ai_fl_13: { emailLocal: 'mila.volkov', nickname: 'mila-volkov' },
	mock_ai_fl_14: { emailLocal: 'hannah.ng', nickname: 'hannah-ng' },
	mock_ai_fl_15: { emailLocal: 'alex.rivera', nickname: 'alex-rivera' },
}

/** ~80%: both location and languages. Exceptions: 13 no location, 14 no languages, 15 neither. */
const FREELANCER_LOCATIONS: Record<string, string | null> = {
	mock_ai_fl_01: 'San Francisco, CA',
	mock_ai_fl_02: 'Berlin, Germany',
	mock_ai_fl_03: 'Barcelona, Spain',
	mock_ai_fl_04: 'London, UK',
	mock_ai_fl_05: 'Warsaw, Poland',
	mock_ai_fl_06: 'Los Angeles, CA',
	mock_ai_fl_07: 'Toronto, Canada',
	mock_ai_fl_08: 'Dubai, UAE',
	mock_ai_fl_09: 'Sydney, Australia',
	mock_ai_fl_10: 'Singapore',
	mock_ai_fl_11: 'Amsterdam, Netherlands',
	mock_ai_fl_12: 'Mexico City, Mexico',
	mock_ai_fl_13: null,
	mock_ai_fl_14: 'Austin, TX',
	mock_ai_fl_15: null,
}

type LangRow = {
	language_code: string
	lang_level: 'basic' | 'conversational' | 'fluent' | 'native'
}

type MockUserYamlBlock = {
	users: {
		id: string
		email: string
		name: string
		role: string
		emailVerified: boolean | string
		image: string
	}
	user_profiles: {
		id: string
		user_id: string
		name: string
		nickname?: string
		avatar_url: string
		bio: string | null
		company_name: string | null
		company_role: string | null
		location?: string | null
	}
	freelancer_profiles?: {
		id: string
		user_id: string
		specialization: string
		hourly_rate: number
		availability: string
		experience: string
	} | null
	user_languages?: LangRow[]
	user_skills?: Array<{
		id: string
		user_id: string
		skill_id: string
		proficiency_level: string
		legacy_skill_id: string | null
	}>
	portfolio_items?: Array<{
		id: string
		freelancer_profile_id: string
		title: string
		description: string
		media_url: string
		media_type: string
		media_width: number
		media_height: number
		caption: string | null
		category: string
		tools_used: string[]
	}>
}

function freelancerLanguages(userId: string): LangRow[] {
	if (userId === 'mock_ai_fl_14' || userId === 'mock_ai_fl_15') {
		return []
	}
	if (userId === 'mock_ai_fl_13') {
		return [
			{ language_code: 'en', lang_level: 'fluent' },
			{ language_code: 'ru', lang_level: 'native' },
		]
	}
	return [
		{ language_code: 'en', lang_level: 'fluent' },
		{ language_code: 'de', lang_level: 'conversational' },
	]
}

export type ExpectedMockUser = {
	id: string
	group: 'freelancer' | 'client'
}

function readMockUserRows(repoRoot: string): MockUserYamlBlock[] {
	const mdPath = resolve(repoRoot, 'MOCK-USERS.md')
	const md = readFileSync(mdPath, 'utf8')
	const m = md.match(/```yaml\n([\s\S]*?)\n```/)
	if (!m || !m[1]) {
		throw new Error('MOCK-USERS.md: no ```yaml ... ``` block found')
	}
	const data = parse(m[1]) as { users: MockUserYamlBlock[] }
	const rows = data.users
	if (!Array.isArray(rows) || rows.length === 0) {
		throw new Error('MOCK-USERS.md: expected users: array with at least one block')
	}
	return rows
}

/** IDs used by `scripts/db/seed-mock-users.ts` and `scripts/db/seed-status.ts`. */
export function getExpectedMockUsers(repoRoot = process.cwd()): ExpectedMockUser[] {
	return readMockUserRows(repoRoot).map((row) => ({
		id: row.users.id,
		group: row.users.role === 'client' ? 'client' : 'freelancer',
	}))
}

function stripBasePrefix(url: string, basePrefix: string): string {
	if (url.startsWith(basePrefix)) {
		return url.slice(basePrefix.length)
	}
	return url
}

function normalizeAssetPath(pathOrUrl: string, base: string): string {
	const normalizedBase = base.replace(/\/$/, '')
	if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
		const legacyBase = LEGACY_LOCALHOST_ASSET_BASE.replace(/\/$/, '')
		if (pathOrUrl.startsWith(legacyBase)) {
			return normalizedBase + pathOrUrl.slice(legacyBase.length)
		}
		return pathOrUrl
	}
	if (pathOrUrl.startsWith('/')) {
		return pathOrUrl
	}
	return normalizedBase + '/' + pathOrUrl
}

export type FreelancerBundle = {
	yaml: MockUserYamlBlock & {
		user_profiles: MockUserYamlBlock['user_profiles'] & { nickname: string }
		freelancer_profiles: NonNullable<MockUserYamlBlock['freelancer_profiles']>
		user_skills: NonNullable<MockUserYamlBlock['user_skills']>
		portfolio_items: NonNullable<MockUserYamlBlock['portfolio_items']>
	}
	email: string
	nickname: string
	location: string | null
	languages: LangRow[]
}

export type ClientBundle = {
	yaml: MockUserYamlBlock & {
		user_profiles: MockUserYamlBlock['user_profiles'] & { nickname: string }
		user_languages: NonNullable<MockUserYamlBlock['user_languages']>
	}
	languages: LangRow[]
}

function coerceBool(v: boolean | string): boolean {
	if (typeof v === 'string') {
		return v === 'true' || v === '1'
	}
	return v
}

function normalizeMockUserRow(row: MockUserYamlBlock, baseUrl: string): MockUserYamlBlock {
	return {
		...row,
		users: {
			...row.users,
			emailVerified: coerceBool(row.users.emailVerified),
			image: normalizeAssetPath(row.users.image, baseUrl),
		},
		user_profiles: {
			...row.user_profiles,
			avatar_url: normalizeAssetPath(row.user_profiles.avatar_url, baseUrl),
		},
		freelancer_profiles: row.freelancer_profiles ? { ...row.freelancer_profiles } : null,
		user_languages: row.user_languages?.map((row) => ({ ...row })) ?? [],
		user_skills: row.user_skills?.map((row) => ({ ...row })) ?? [],
		portfolio_items:
			row.portfolio_items?.map((row) => ({
				...row,
				media_url: normalizeAssetPath(row.media_url, baseUrl),
			})) ?? [],
	}
}

// Read `MOCK-USERS.md` from repo root and normalize asset paths plus derived
// email/nickname/location metadata for freelancer rows.
export function loadFreelancerBundles(repoRoot: string, baseUrl: string): FreelancerBundle[] {
	return readMockUserRows(repoRoot)
		.filter((row) => row.users.role === 'freelancer')
		.map((row) => {
			const id = row.users.id
			const idn = FREELANCER_IDENTITY[id]
			if (!idn) {
				throw new Error(`Add FREELANCER_IDENTITY entry for ${id}`)
			}
			const email = `${idn.emailLocal}@yahoo.com`
			const normalized = normalizeMockUserRow(row, baseUrl)
			if (!normalized.freelancer_profiles) {
				throw new Error(`MOCK-USERS.md: freelancer ${id} is missing freelancer_profiles`)
			}
			const b: FreelancerBundle = {
				yaml: {
					...normalized,
					users: {
						...normalized.users,
						email,
					},
					user_profiles: {
						...normalized.user_profiles,
						nickname: idn.nickname,
					},
					freelancer_profiles: normalized.freelancer_profiles,
					user_skills: normalized.user_skills ?? [],
					portfolio_items: normalized.portfolio_items ?? [],
				},
				email,
				nickname: idn.nickname,
				location: Object.prototype.hasOwnProperty.call(FREELANCER_LOCATIONS, id)
					? FREELANCER_LOCATIONS[id]!
					: null,
				languages: freelancerLanguages(id),
			}
			return b
		})
}

export function loadClientBundles(repoRoot: string, baseUrl: string): ClientBundle[] {
	return readMockUserRows(repoRoot)
		.filter((row) => row.users.role === 'client')
		.map((row) => {
			const normalized = normalizeMockUserRow(row, baseUrl)
			if (!normalized.user_profiles.nickname) {
				throw new Error(
					`MOCK-USERS.md: client ${row.users.id} is missing user_profiles.nickname`,
				)
			}
			return {
				yaml: {
					...normalized,
					user_profiles: {
						...normalized.user_profiles,
						nickname: normalized.user_profiles.nickname,
					},
					user_languages: normalized.user_languages ?? [],
				},
				languages: normalized.user_languages ?? [],
			}
		})
}

/**
 * Expose for documentation / introspection: derive a relative public asset path
 * from a legacy localhost URL.
 */
export function publicAssetPathFromLegacyUrl(url: string): string {
	return stripBasePrefix(url, LEGACY_LOCALHOST_ASSET_BASE)
}
