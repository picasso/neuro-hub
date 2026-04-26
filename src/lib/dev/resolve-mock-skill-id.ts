/**
 * YAML mocks use canonical skill UUIDs from `001_skills.ts`. The migration
 * `20260211_010_migrate_skills_id_to_uuid` replaced `skills.id` with random UUIDs, so
 * production often has 33 rows by *name* but not by canonical *id*. Map canonical id →
 * current DB id by id first, then by stable `name` from the catalog.
 */
import { SKILLS } from '../db/seeds/001_skills'
import type { DB } from '@/types/database'
import type { Kysely } from 'kysely'

const CATALOG_BY_CANONICAL_ID = new Map(SKILLS.map((s) => [s.id, s] as [string, typeof s]))

/** Canonical id from `001_skills` → display name, or `null` if not in the catalog. */
export function getCanonicalSkillName(canonicalId: string): string | null {
	return CATALOG_BY_CANONICAL_ID.get(canonicalId)?.name ?? null
}

/**
 * For each canonical `skill_id` from mock YAML, returns the `skills.id` to use in inserts.
 * Missing keys mean the row could not be resolved (assert / throw elsewhere).
 */
export async function buildMockSkillIdResolutionMap(
	kysely: Kysely<DB>,
	yamlSkillIds: Iterable<string>,
): Promise<Map<string, string>> {
	const unique = [...new Set([...yamlSkillIds])]
	const out = new Map<string, string>()
	if (unique.length === 0) {
		return out
	}
	const byIdRows = await kysely
		.selectFrom('skills')
		.select('id')
		.where('id', 'in', unique)
		.execute()
	const found = new Set(byIdRows.map((r) => r.id as string))
	for (const id of unique) {
		if (found.has(id)) {
			out.set(id, id)
		}
	}
	const needName = unique.filter((id) => !out.has(id))
	if (needName.length === 0) {
		return out
	}
	const names: string[] = []
	for (const id of needName) {
		const c = CATALOG_BY_CANONICAL_ID.get(id)
		if (c) {
			names.push(c.name)
		}
	}
	if (names.length === 0) {
		return out
	}
	const byName = await kysely
		.selectFrom('skills')
		.select(['id', 'name'])
		.where('name', 'in', names)
		.execute()
	const nameToId = new Map(byName.map((r) => [r.name, r.id as string]))
	for (const id of needName) {
		const c = CATALOG_BY_CANONICAL_ID.get(id)
		if (!c) {
			continue
		}
		const dbId = nameToId.get(c.name)
		if (dbId) {
			out.set(id, dbId)
		}
	}
	return out
}
