/**
 * Upsert mock projects, skills, attachments, applications from MOCK-PROJECTS.md.
 * Prereq: `yarn db:seed:mock-users`.
 *
 * Env: `DATABASE_URL` (required), `NEXT_PUBLIC_APP_URL` (optional; used when validating
 * freelancer skill overlap via `loadFreelancerBundles`).
 */
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { closeConnection, kysely } from '../../src/lib/db'
import {
	assertApplicationsMatchProjectSkills,
	loadMockProjectsBundle,
} from '../../src/lib/dev/mock-projects-seed'
import {
	printDataRow,
	printEmpty,
	printError,
	printInfo,
	printSection,
	printSuccess,
	promptConfirmation,
} from '../utils/cli-utils'

function loadDotenvFromCwd() {
	try {
		const p = resolve(process.cwd(), '.env')
		const raw = readFileSync(p, 'utf8')
		for (const line of raw.split('\n')) {
			const t = line.trim()
			if (!t || t.startsWith('#')) {
				continue
			}
			const eq = t.indexOf('=')
			if (eq <= 0) {
				continue
			}
			const key = t.slice(0, eq).trim()
			let v = t.slice(eq + 1).trim()
			if (v.startsWith('"') && v.endsWith('"')) {
				v = v.slice(1, -1).replace(/\\n/g, '\n')
			} else if (v.startsWith("'") && v.endsWith("'")) {
				v = v.slice(1, -1)
			}
			if (!process.env[key]) {
				process.env[key] = v
			}
		}
	} catch {
		// no .env
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

function assertUniqueProjectFreelancerPairs(
	applications: { project_id: string; freelancer_id: string; id: string }[],
) {
	const seen = new Set<string>()
	for (const a of applications) {
		const k = `${a.project_id}\0${a.freelancer_id}`
		if (seen.has(k)) {
			throw new Error(
				`MOCK-PROJECTS: duplicate (project_id, freelancer_id) for application ${a.id}`,
			)
		}
		seen.add(k)
	}
}

async function main() {
	loadDotenvFromCwd()
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
		const ok = await promptConfirmation('Proceed with mock projects upsert?')
		if (!ok) {
			printInfo('Cancelled.')
			printEmpty()
			process.exit(0)
		}
	}

	const repoRoot = process.cwd()
	const bundle = loadMockProjectsBundle(repoRoot)
	assertUniqueProjectFreelancerPairs(bundle.applications)
	assertApplicationsMatchProjectSkills(repoRoot, base)

	const projectIds = bundle.projects.map((p) => p.id)

	printEmpty()
	printSection('Mock projects seed')
	printDataRow([
		['Projects', String(bundle.projects.length)],
		['Project skills', String(bundle.project_skills.length)],
		['Attachments', String(bundle.project_attachments.length)],
		['Applications', String(bundle.applications.length)],
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

	// Remove dependent rows for this id set, then re-insert (cleaner than diffing project_skills).
	if (projectIds.length > 0) {
		await kysely.deleteFrom('applications').where('project_id', 'in', projectIds).execute()
		await kysely
			.deleteFrom('project_attachments')
			.where('project_id', 'in', projectIds)
			.execute()
		await kysely.deleteFrom('project_skills').where('project_id', 'in', projectIds).execute()
	}

	const now = new Date()
	for (const p of bundle.projects) {
		const deadline = new Date(p.deadline)
		const coverUrl = p.cover_url == null || p.cover_url === '' ? null : p.cover_url
		await kysely
			.insertInto('projects')
			.values({
				id: p.id,
				client_id: p.client_id,
				title: p.title,
				description: p.description,
				category: p.category,
				experience_level: p.experience_level,
				budget_type: p.budget_type,
				budget_min: p.budget_min,
				budget_max: p.budget_max,
				deadline,
				status: p.status,
				cover_url: coverUrl,
				created_at: now,
				updated_at: now,
			})
			.onConflict((oc) =>
				oc.column('id').doUpdateSet({
					client_id: p.client_id,
					title: p.title,
					description: p.description,
					category: p.category,
					experience_level: p.experience_level,
					budget_type: p.budget_type,
					budget_min: p.budget_min,
					budget_max: p.budget_max,
					deadline,
					status: p.status,
					cover_url: coverUrl,
					updated_at: now,
				}),
			)
			.execute()
		printSuccess('Upserted project ' + p.title.slice(0, 48) + (p.title.length > 48 ? '…' : ''))
	}

	if (bundle.project_skills.length) {
		await kysely
			.insertInto('project_skills')
			.values(
				bundle.project_skills.map((r) => ({
					project_id: r.project_id,
					skill_id: r.skill_id,
					created_at: now,
				})),
			)
			.execute()
	}

	if (bundle.project_attachments.length) {
		await kysely
			.insertInto('project_attachments')
			.values(
				bundle.project_attachments.map((a) => ({
					id: a.id,
					project_id: a.project_id,
					filename: a.filename,
					file_url: a.file_url,
					mime_type: a.mime_type,
					file_size_bytes: a.file_size_bytes,
					created_at: now,
				})),
			)
			.execute()
	}

	if (bundle.applications.length) {
		await kysely
			.insertInto('applications')
			.values(
				bundle.applications.map((a) => {
					const pd = a.proposed_deadline
					return {
						id: a.id,
						project_id: a.project_id,
						freelancer_id: a.freelancer_id,
						cover_letter: a.cover_letter,
						proposed_price: a.proposed_price,
						proposed_deadline: pd == null || pd === 'null' ? null : new Date(pd),
						status: a.status,
						created_at: now,
						updated_at: now,
					}
				}),
			)
			.execute()
	}

	printEmpty()
	printSuccess('Mock projects seed complete. Source: MOCK-PROJECTS.md')
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
