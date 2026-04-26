/**
 * Upsert synthetic mock users (freelancers from MOCK-USERS.md + 5 clients).
 * Prereq: `yarn db:migrate` and `yarn db:seed` (skills + languages).
 *
 * Env: `DATABASE_URL` (required), `NEXT_PUBLIC_APP_URL` (optional compatibility
 * origin for legacy absolute asset URLs; current mock data uses `/mock-users/...`).
 *
 * CLI: `--production` — read `RAILWAY_DATABASE_URL` from `.env.production.local`
 * (overrides local `DATABASE_URL` from `.env`); restore on exit. If the file is
 * missing, uses existing `DATABASE_URL` (see `scripts/utils/production-railway-database-url.ts`).
 *
 * The first import must be `./ensure-mock-seed-db-env` so `DATABASE_URL` is set before
 * `src/lib/db` loads (pool is created at import time).
 */
import './ensure-mock-seed-db-env'
import { hashPassword } from 'better-auth/crypto'
import { sql } from 'kysely'
import { nanoid } from 'nanoid'
import { closeConnection, kysely } from '../../src/lib/db'
import {
	type ClientBundle,
	type FreelancerBundle,
	MOCK_SEED_PASSWORD,
	loadClientBundles,
	loadFreelancerBundles,
} from '../../src/lib/dev/mock-users-seed'
import {
	buildMockSkillIdResolutionMap,
	getCanonicalSkillName,
} from '../../src/lib/dev/resolve-mock-skill-id'
import {
	printDataRow,
	printEmpty,
	printError,
	printInfo,
	printListItem,
	printSection,
	printSuccess,
	promptConfirmation,
} from '../utils/cli-utils'

function formatDatabaseTarget(url: string): string {
	try {
		const u = new URL(url)
		const name = (u.pathname || '').replace(/^\//, '') || u.searchParams.get('database') || ''
		return name ? `${u.hostname} / ${name}` : u.hostname
	} catch {
		return '(unparsed DATABASE_URL)'
	}
}

function isLikelyLocalDatabaseUrl(url: string): boolean {
	try {
		const u = new URL(url)
		return u.hostname === 'localhost' || u.hostname === '127.0.0.1'
	} catch {
		return false
	}
}

function parseArgs() {
	const raw = process.argv.slice(2)
	return {
		force: raw.includes('--force') || process.env.MOCK_SEED_CONFIRM === '1',
	}
}

async function upsertUserAccount(
	passwordHash: string,
	u: {
		id: string
		email: string
		name: string
		role: string
		emailVerified: boolean
		image: string | null
	},
) {
	const now = new Date()
	await kysely
		.insertInto('users')
		.values({
			id: u.id,
			email: u.email,
			name: u.name,
			role: u.role,
			emailVerified: u.emailVerified,
			image: u.image,
			createdAt: now,
			updatedAt: now,
		})
		.onConflict((oc) =>
			oc.column('id').doUpdateSet({
				email: u.email,
				name: u.name,
				role: u.role,
				emailVerified: u.emailVerified,
				image: u.image,
				updatedAt: now,
			}),
		)
		.execute()

	await kysely
		.deleteFrom('accounts')
		.where('userId', '=', u.id)
		.where('providerId', '=', 'credential')
		.execute()

	await kysely
		.insertInto('accounts')
		.values({
			id: nanoid(),
			accountId: u.id,
			providerId: 'credential',
			userId: u.id,
			password: passwordHash,
			createdAt: now,
			updatedAt: now,
		})
		.execute()
}

async function upsertUserProfile(p: {
	id: string
	user_id: string
	name: string | null
	nickname: string
	avatar_url: string | null
	bio: string | null
	company_name: string | null
	company_role: string | null
	location: string | null
}) {
	const now = new Date()
	await kysely
		.insertInto('user_profiles')
		.values({
			id: p.id,
			user_id: p.user_id,
			name: p.name,
			nickname: p.nickname,
			avatar_url: p.avatar_url,
			bio: p.bio,
			company_name: p.company_name,
			company_role: p.company_role,
			location: p.location,
			updated_at: now,
		})
		.onConflict((oc) =>
			oc.column('user_id').doUpdateSet({
				name: p.name,
				nickname: p.nickname,
				avatar_url: p.avatar_url,
				bio: p.bio,
				company_name: p.company_name,
				company_role: p.company_role,
				location: p.location,
				updated_at: now,
			}),
		)
		.execute()
}

async function replaceUserLanguages(
	userId: string,
	rows: { language_code: string; lang_level: string }[],
) {
	await kysely.deleteFrom('user_languages').where('user_id', '=', userId).execute()
	if (rows.length === 0) {
		return
	}
	const now = new Date()
	await kysely
		.insertInto('user_languages')
		.values(
			rows.map((r) => ({
				user_id: userId,
				language_code: r.language_code,
				lang_level: r.lang_level,
				created_at: now,
			})),
		)
		.execute()
}

async function seedFreelancer(
	passwordHash: string,
	bundle: Awaited<ReturnType<typeof loadFreelancerBundles>>[number],
	skillIdMap: ReadonlyMap<string, string>,
) {
	const y = bundle.yaml
	const u = y.users
	const up = y.user_profiles
	const fp = y.freelancer_profiles

	const location = bundle.location
	const nickname = bundle.nickname

	await upsertUserAccount(passwordHash, {
		...u,
		emailVerified: u.emailVerified === true,
		role: 'freelancer',
	})
	await upsertUserProfile({
		...up,
		nickname,
		location,
	})
	await replaceUserLanguages(u.id, bundle.languages)

	const now = new Date()
	await kysely
		.insertInto('freelancer_profiles')
		.values({
			id: fp.id,
			user_id: fp.user_id,
			specialization: fp.specialization,
			hourly_rate: fp.hourly_rate,
			availability: fp.availability,
			experience: fp.experience,
			created_at: now,
			updated_at: now,
		})
		.onConflict((oc) =>
			oc.column('id').doUpdateSet({
				specialization: fp.specialization,
				hourly_rate: fp.hourly_rate,
				availability: fp.availability,
				experience: fp.experience,
				updated_at: now,
			}),
		)
		.execute()

	await kysely.deleteFrom('user_skills').where('user_id', '=', u.id).execute()
	if (y.user_skills.length) {
		await kysely
			.insertInto('user_skills')
			.values(
				y.user_skills.map((r) => {
					const dbSkillId = skillIdMap.get(r.skill_id)
					if (dbSkillId == null) {
						throw new Error('Unresolved skill_id for user_skills insert: ' + r.skill_id)
					}
					return {
						id: r.id,
						user_id: r.user_id,
						skill_id: dbSkillId,
						proficiency_level: r.proficiency_level,
						legacy_skill_id:
							r.legacy_skill_id ?? (dbSkillId === r.skill_id ? null : r.skill_id),
						created_at: now,
					}
				}),
			)
			.execute()
	}

	await kysely.deleteFrom('portfolio_items').where('freelancer_profile_id', '=', fp.id).execute()
	if (y.portfolio_items.length) {
		await kysely
			.insertInto('portfolio_items')
			.values(
				y.portfolio_items.map((r) => ({
					id: r.id,
					freelancer_profile_id: r.freelancer_profile_id,
					title: r.title,
					description: r.description,
					media_url: r.media_url,
					media_type: r.media_type,
					media_width: r.media_width,
					media_height: r.media_height,
					caption: r.caption,
					category: r.category,
					// pg encodes JS arrays as Postgres `{...}` text, not JSON; cast like portfolio POST route.
					tools_used: r.tools_used.length
						? sql`${JSON.stringify(r.tools_used)}::jsonb`
						: null,
					created_at: now,
					updated_at: now,
				})),
			)
			.execute()
	}
}

async function seedClient(
	passwordHash: string,
	bundle: Awaited<ReturnType<typeof loadClientBundles>>[number],
) {
	const y = bundle.yaml
	const u = y.users
	const up = y.user_profiles
	await upsertUserAccount(passwordHash, {
		id: u.id,
		email: u.email,
		name: u.name,
		role: 'client',
		emailVerified: u.emailVerified === true,
		image: u.image,
	})
	await upsertUserProfile({
		id: up.id,
		user_id: up.user_id,
		name: up.name,
		nickname: up.nickname!,
		avatar_url: up.avatar_url,
		bio: up.bio,
		company_name: up.company_name,
		company_role: up.company_role,
		location: up.location ?? null,
	})
	await replaceUserLanguages(u.id, bundle.languages)
}

/**
 * Ensures `languages` exist. Builds canonical mock skill_id → `skills.id` (resolves
 * post-migration random UUIDs via the `001_skills` name catalog when ids differ).
 */
async function assertPrerequisitesAndBuildSkillIdMap(
	bundles: FreelancerBundle[],
	clients: ClientBundle[],
): Promise<Map<string, string>> {
	const skillIds = new Set<string>()
	for (const b of bundles) {
		for (const s of b.yaml.user_skills) {
			skillIds.add(s.skill_id)
		}
	}
	const languageCodes = new Set<string>()
	for (const b of bundles) {
		for (const l of b.languages) {
			languageCodes.add(l.language_code)
		}
	}
	for (const c of clients) {
		for (const l of c.languages) {
			languageCodes.add(l.language_code)
		}
	}
	let skillIdMap = new Map<string, string>()
	if (skillIds.size > 0) {
		const countRow = await kysely
			.selectFrom('skills')
			.select((eb) => eb.fn.countAll<string>().as('count'))
			.executeTakeFirst()
		const totalSkills = Number(countRow?.count ?? 0)

		skillIdMap = await buildMockSkillIdResolutionMap(kysely, skillIds)
		const missing = [...skillIds].filter((id) => !skillIdMap.has(id))
		if (missing.length) {
			const url = process.env.DATABASE_URL || ''
			printEmpty()
			printInfo('This run connects to: ' + formatDatabaseTarget(url))
			printInfo('Table `skills` in that database: ' + String(totalSkills) + ' row(s).')
			if (totalSkills === 0) {
				printEmpty()
				printError(
					'No `skills` rows here — reference seed missing or different database URL. ' +
						'Use the same `DATABASE_URL` you used for `db:seed:status` (see RAILWAY_DATABASE_URL).',
				)
			} else {
				printError('Could not match every mock skill to a row in `skills`.')
				printInfo(
					'Mocks use canonical UUIDs from `001_skills`, but migration 20260211_010 ' +
						'assigned new random UUIDs — name-based resolution should still work if seed names match. ' +
						'For remaining ids: not in 001 catalog, or missing skill *name* in the database.',
				)
			}
			printEmpty()
			printInfo(
				'Unmatched canonical skill_id(s) (up to 15 of ' + String(missing.length) + '):',
			)
			missing.slice(0, 15).forEach((id) => {
				const n = getCanonicalSkillName(id)
				printListItem(n ? id + ' → ' + n : id + ' (not in 001_skills catalog)', 1)
			})
			if (missing.length > 15) {
				printListItem('… and ' + String(missing.length - 15) + ' more', 1)
			}
			printEmpty()
			process.exit(1)
		}
	}
	if (languageCodes.size > 0) {
		const rows = await kysely
			.selectFrom('languages')
			.select('code')
			.where('code', 'in', [...languageCodes])
			.execute()
		const have = new Set(rows.map((r) => r.code as string))
		const missing = [...languageCodes].filter((c) => !have.has(c))
		if (missing.length) {
			printEmpty()
			printError(
				'Missing `languages` rows for mock `user_languages` — base Knex seed is not on this database.',
			)
			missing.forEach((code) => {
				printListItem(code, 1)
			})
			printInfo(
				'Run the reference seed first: `yarn db:seed` (or `scripts/db/seed-production.sh` on production).',
			)
			printEmpty()
			process.exit(1)
		}
	}
	return skillIdMap
}

async function main() {
	const args = parseArgs()
	const databaseUrl = process.env.DATABASE_URL || ''
	const base =
		(process.env.NEXT_PUBLIC_APP_URL && process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, '')) ||
		'http://localhost:3000'

	if (!databaseUrl) {
		printEmpty()
		printError('DATABASE_URL is not set.')
		printInfo('Set it in the environment or .env (see docs/DATABASE-SETUP.md).')
		printEmpty()
		process.exit(1)
	}

	if (!isLikelyLocalDatabaseUrl(databaseUrl) && !args.force) {
		printEmpty()
		printInfo('Target DATABASE_URL is not localhost.')
		const ok = await promptConfirmation('Proceed with mock user upsert?')
		if (!ok) {
			printInfo('Cancelled.')
			printEmpty()
			process.exit(0)
		}
	}

	const repoRoot = process.cwd()
	const passwordHash = await hashPassword(MOCK_SEED_PASSWORD)
	const bundles = loadFreelancerBundles(repoRoot, base)
	const clients = loadClientBundles(repoRoot, base)
	const skillIdMap = await assertPrerequisitesAndBuildSkillIdMap(bundles, clients)

	printEmpty()
	printSection('Mock users seed')
	printDataRow([
		['Asset base (legacy compat)', base],
		['Freelancers', String(bundles.length)],
		['Clients', String(clients.length)],
		[
			'Database host',
			(() => {
				try {
					return new URL(databaseUrl).host
				} catch {
					return '(unparsed)'
				}
			})(),
		],
	])
	printEmpty()

	for (const b of bundles) {
		await seedFreelancer(passwordHash, b, skillIdMap)
		printSuccess('Upserted freelancer ' + b.yaml.users.name)
	}
	for (let i = 0; i < clients.length; i++) {
		const bundle = clients[i]!
		await seedClient(passwordHash, bundle)
		printSuccess('Upserted client ' + bundle.yaml.users.name)
	}

	printEmpty()
	printSuccess('Done. Test password (all mocks): ' + MOCK_SEED_PASSWORD)
	printInfo('See emails and passwords in MOCK-USERS.md in repo docs.')
	printEmpty()

	await closeConnection()
	process.exit(0)
}

function formatPgError(e: unknown): string {
	if (e && typeof e === 'object' && 'code' in e) {
		const p = e as {
			message?: string
			code?: string
			detail?: string
			where?: string
			column?: string
			table?: string
		}
		const parts = [p.message ?? String(e)]
		if (p.detail) {
			parts.push(`detail: ${p.detail}`)
		}
		if (p.where) {
			parts.push(`where: ${p.where}`)
		}
		if (p.code) {
			parts.push(`code: ${p.code}`)
		}
		if (p.table || p.column) {
			parts.push(`table: ${p.table ?? '?'} column: ${p.column ?? '?'}`)
		}
		return parts.join(' | ')
	}
	return String(e)
}

main().catch((e) => {
	printEmpty()
	printError(formatPgError(e))
	printEmpty()
	void closeConnection().finally(() => process.exit(1))
})
