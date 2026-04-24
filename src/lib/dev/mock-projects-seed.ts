/**
 * Data and helpers for `scripts/db/seed-mock-projects.ts`.
 * Source YAML: `MOCK-PROJECTS.md` (fenced `yaml` block).
 */
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { parse } from 'yaml'
import { loadFreelancerBundles } from './mock-users-seed'

export type MockProjectRow = {
	id: string
	client_id: string
	title: string
	description: string
	category: string
	experience_level: string
	budget_type: string
	budget_min: number
	budget_max: number
	deadline: string
	status: string
}

export type MockProjectSkillRow = {
	project_id: string
	skill_id: string
}

export type MockProjectAttachmentRow = {
	id: string
	project_id: string
	filename: string
	file_url: string
	mime_type: string | null
	file_size_bytes: number | null
}

export type MockApplicationRow = {
	id: string
	project_id: string
	freelancer_id: string
	cover_letter: string
	proposed_price: number
	proposed_deadline: string | null
	status: string
}

type MockProjectsYaml = {
	projects: MockProjectRow[]
	project_skills: MockProjectSkillRow[]
	project_attachments: MockProjectAttachmentRow[]
	applications: MockApplicationRow[]
}

function readMockProjectsYamlBlock(repoRoot: string): MockProjectsYaml {
	const mdPath = resolve(repoRoot, 'MOCK-PROJECTS.md')
	const md = readFileSync(mdPath, 'utf8')
	const m = md.match(/```yaml\n([\s\S]*?)\n```/)
	if (!m || !m[1]) {
		throw new Error('MOCK-PROJECTS.md: no ```yaml ... ``` block found')
	}
	const data = parse(m[1]) as MockProjectsYaml
	if (!data.projects || !Array.isArray(data.projects)) {
		throw new Error('MOCK-PROJECTS.md: expected `projects` array')
	}
	return {
		projects: data.projects,
		project_skills: data.project_skills ?? [],
		project_attachments: data.project_attachments ?? [],
		applications: data.applications ?? [],
	}
}

export function loadMockProjectsBundle(repoRoot: string): MockProjectsYaml {
	return readMockProjectsYamlBlock(repoRoot)
}

export type ExpectedMockProject = { id: string; client_id: string }

export function getExpectedMockProjects(repoRoot = process.cwd()): ExpectedMockProject[] {
	return readMockProjectsYamlBlock(repoRoot).projects.map((p) => ({
		id: p.id,
		client_id: p.client_id,
	}))
}

function skillSetByProjectId(
	bundle: ReturnType<typeof readMockProjectsYamlBlock>,
): Map<string, Set<string>> {
	const m = new Map<string, Set<string>>()
	for (const row of bundle.project_skills) {
		if (!m.has(row.project_id)) {
			m.set(row.project_id, new Set())
		}
		m.get(row.project_id)!.add(row.skill_id)
	}
	return m
}

function userSkillSetByUserId(repoRoot: string, baseUrl: string): Map<string, Set<string>> {
	const m = new Map<string, Set<string>>()
	for (const b of loadFreelancerBundles(repoRoot, baseUrl)) {
		const uid = b.yaml.users.id
		m.set(uid, new Set(b.yaml.user_skills.map((r) => r.skill_id)))
	}
	return m
}

/**
 * Every application’s freelancer_id must share at least one skill_id with the project’s
 * `project_skills` rows.
 */
export function assertApplicationsMatchProjectSkills(repoRoot: string, baseUrl: string): void {
	const bundle = readMockProjectsYamlBlock(repoRoot)
	const byProject = skillSetByProjectId(bundle)
	const flSkill = userSkillSetByUserId(repoRoot, baseUrl)

	for (const app of bundle.applications) {
		const pSkills = byProject.get(app.project_id)
		if (!pSkills || pSkills.size === 0) {
			throw new Error(
				`MOCK-PROJECTS: project ${app.project_id} has no project_skills for application ${app.id}`,
			)
		}
		const fSkills = flSkill.get(app.freelancer_id)
		if (!fSkills) {
			throw new Error(
				`MOCK-PROJECTS: freelancer ${app.freelancer_id} not in MOCK-USERS freelancer bundles`,
			)
		}
		const overlap = [...fSkills].filter((s) => pSkills.has(s))
		if (overlap.length === 0) {
			throw new Error(
				`MOCK-PROJECTS: application ${app.id} — no user_skills overlap with project_skills for ` +
					`freelancer ${app.freelancer_id} on project ${app.project_id}`,
			)
		}
	}
}

/**
 * For seed-status: expected number of application rows in YAML.
 */
export function getExpectedMockProjectApplicationCount(repoRoot = process.cwd()): number {
	return readMockProjectsYamlBlock(repoRoot).applications.length
}
