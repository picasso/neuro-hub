import type { FreelancerDirectoryQueryInput } from '@/lib/validations/freelancer-directory'
import type { FreelancerProfiles } from '@/types/database'
import type { Selectable } from 'kysely'
import { kysely } from '@/lib/db'

type FreelancerProfileRow = Selectable<FreelancerProfiles>

export type PublicFreelancerProfile = {
	userId: string
	freelancerProfileId: string
	userProfile: {
		name: string | null
		avatarUrl: string | null
		bio: string | null
	} | null
	freelancer: {
		specialization: string | null
		hourlyRate: number | null
		availability: string | null
		experience: string | null
	}
	skills: Array<{
		skillId: string
		proficiencyLevel: string | null
		skill: {
			id: string
			name: string
			category: string | null
		}
	}>
	portfolio: Array<{
		id: string
		title: string
		description: string | null
		mediaUrl: string
		mediaType: string | null
		mediaWidth: number | null
		mediaHeight: number | null
		caption: string | null
		category: string | null
		toolsUsed: unknown
		createdAt: Date | null
		updatedAt: Date | null
	}>
}

export type PublicFreelancerGridItem = {
	freelancerProfileId: string
	href: string
	name: string | null
	avatarUrl: string | null
	specialization: string | null
	bioSnippet: string | null
	hourlyRate: number | null
	availability: string | null
	topSkills: Array<{
		id: string
		name: string
		category: string | null
		proficiencyLevel: string | null
	}>
	skillCategories: string[]
	portfolioCount: number
	latestPortfolioItem: {
		id: string
		title: string
		mediaUrl: string
		mediaType: string | null
		category: string | null
	} | null
}

export type ListPublicFreelancersResult = {
	items: PublicFreelancerGridItem[]
	page: number
	pageSize: number
	total: number
	hasMore: boolean
}

export async function getPublicFreelancerProfileByProfileId(
	profileId: string,
): Promise<PublicFreelancerProfile | null> {
	const freelancerProfile = await kysely
		.selectFrom('freelancer_profiles')
		.selectAll()
		.where('id', '=', profileId)
		.executeTakeFirst()

	if (!freelancerProfile) return null
	const userId = freelancerProfile.user_id

	const userProfile = await kysely
		.selectFrom('user_profiles')
		.selectAll()
		.where('user_id', '=', userId)
		.executeTakeFirst()

	const userSkills = await kysely
		.selectFrom('user_skills')
		.innerJoin('skills', 'user_skills.skill_id', 'skills.id')
		.where('user_skills.user_id', '=', userId)
		.select([
			'user_skills.skill_id',
			'user_skills.proficiency_level',
			'skills.name as skill_name',
			'skills.category as skill_category',
		])
		.orderBy('skills.name', 'asc')
		.execute()

	const portfolio = await kysely
		.selectFrom('portfolio_items')
		.selectAll()
		.where('freelancer_profile_id', '=', profileId)
		.orderBy('created_at', 'desc')
		.execute()

	return {
		userId,
		freelancerProfileId: freelancerProfile.id,
		userProfile: userProfile
			? {
					name: userProfile.name,
					avatarUrl: userProfile.avatar_url,
					bio: userProfile.bio,
				}
			: null,
		freelancer: {
			specialization: freelancerProfile.specialization,
			hourlyRate: freelancerProfile.hourly_rate,
			availability: freelancerProfile.availability,
			experience: freelancerProfile.experience,
		},
		skills: userSkills.map((s) => ({
			skillId: s.skill_id,
			proficiencyLevel: s.proficiency_level,
			skill: {
				id: s.skill_id,
				name: s.skill_name,
				category: s.skill_category,
			},
		})),
		portfolio: portfolio.map((p) => ({
			id: p.id,
			title: p.title,
			description: p.description,
			mediaUrl: p.media_url,
			mediaType: p.media_type,
			mediaWidth: p.media_width,
			mediaHeight: p.media_height,
			caption: p.caption,
			category: p.category,
			toolsUsed: p.tools_used,
			createdAt: p.created_at,
			updatedAt: p.updated_at,
		})),
	}
}

export async function listPublicFreelancers(
	input: FreelancerDirectoryQueryInput,
): Promise<ListPublicFreelancersResult> {
	const { page, pageSize, q, category, sort, hasPortfolio } = input
	const offset = (page - 1) * pageSize
	const search = q ? `%${q}%` : undefined

	let countQuery = kysely
		.selectFrom('freelancer_profiles as freelancer')
		.innerJoin('user_profiles as profile', 'profile.user_id', 'freelancer.user_id')
		.select((eb) => eb.fn.countAll().as('count'))
		.where('profile.name', 'is not', null)
		.where('freelancer.specialization', 'is not', null)
		.where((eb) =>
			eb.exists(
				eb
					.selectFrom('user_skills as user_skill')
					.select('user_skill.id')
					.whereRef('user_skill.user_id', '=', 'freelancer.user_id'),
			),
		)

	let rowsQuery = kysely
		.selectFrom('freelancer_profiles as freelancer')
		.innerJoin('user_profiles as profile', 'profile.user_id', 'freelancer.user_id')
		.select([
			'freelancer.id as freelancerProfileId',
			'freelancer.user_id as userId',
			'freelancer.specialization as specialization',
			'freelancer.hourly_rate as hourlyRate',
			'freelancer.availability as availability',
			'freelancer.updated_at as updatedAt',
			'profile.name as name',
			'profile.avatar_url as avatarUrl',
			'profile.bio as bio',
		])
		.where('profile.name', 'is not', null)
		.where('freelancer.specialization', 'is not', null)
		.where((eb) =>
			eb.exists(
				eb
					.selectFrom('user_skills as user_skill')
					.select('user_skill.id')
					.whereRef('user_skill.user_id', '=', 'freelancer.user_id'),
			),
		)

	if (category) {
		countQuery = countQuery.where((eb) =>
			eb.exists(
				eb
					.selectFrom('user_skills as user_skill')
					.innerJoin('skills as skill', 'skill.id', 'user_skill.skill_id')
					.select('user_skill.id')
					.whereRef('user_skill.user_id', '=', 'freelancer.user_id')
					.where('skill.category', '=', category),
			),
		)
		rowsQuery = rowsQuery.where((eb) =>
			eb.exists(
				eb
					.selectFrom('user_skills as user_skill')
					.innerJoin('skills as skill', 'skill.id', 'user_skill.skill_id')
					.select('user_skill.id')
					.whereRef('user_skill.user_id', '=', 'freelancer.user_id')
					.where('skill.category', '=', category),
			),
		)
	}

	if (hasPortfolio) {
		countQuery = countQuery.where((eb) =>
			eb.exists(
				eb
					.selectFrom('portfolio_items as portfolio_item')
					.select('portfolio_item.id')
					.whereRef('portfolio_item.freelancer_profile_id', '=', 'freelancer.id'),
			),
		)
		rowsQuery = rowsQuery.where((eb) =>
			eb.exists(
				eb
					.selectFrom('portfolio_items as portfolio_item')
					.select('portfolio_item.id')
					.whereRef('portfolio_item.freelancer_profile_id', '=', 'freelancer.id'),
			),
		)
	}

	if (search) {
		countQuery = countQuery.where((eb) =>
			eb.or([
				eb('profile.name', 'ilike', search),
				eb('profile.bio', 'ilike', search),
				eb('freelancer.specialization', 'ilike', search),
				eb.exists(
					eb
						.selectFrom('user_skills as user_skill')
						.innerJoin('skills as skill', 'skill.id', 'user_skill.skill_id')
						.select('user_skill.id')
						.whereRef('user_skill.user_id', '=', 'freelancer.user_id')
						.where('skill.name', 'ilike', search),
				),
			]),
		)
		rowsQuery = rowsQuery.where((eb) =>
			eb.or([
				eb('profile.name', 'ilike', search),
				eb('profile.bio', 'ilike', search),
				eb('freelancer.specialization', 'ilike', search),
				eb.exists(
					eb
						.selectFrom('user_skills as user_skill')
						.innerJoin('skills as skill', 'skill.id', 'user_skill.skill_id')
						.select('user_skill.id')
						.whereRef('user_skill.user_id', '=', 'freelancer.user_id')
						.where('skill.name', 'ilike', search),
				),
			]),
		)
	}

	switch (sort) {
		case 'rate_asc':
			rowsQuery = rowsQuery.orderBy('freelancer.hourly_rate', 'asc')
			break
		case 'rate_desc':
			rowsQuery = rowsQuery.orderBy('freelancer.hourly_rate', 'desc')
			break
		case 'newest':
			rowsQuery = rowsQuery.orderBy('freelancer.updated_at', 'desc')
			break
		default:
			rowsQuery = rowsQuery.orderBy('freelancer.updated_at', 'desc')
			break
	}

	const countResult = await countQuery.executeTakeFirstOrThrow()
	const total = Number(countResult.count)

	const rows = await rowsQuery.limit(pageSize).offset(offset).execute()

	if (rows.length === 0) {
		return {
			items: [],
			page,
			pageSize,
			total,
			hasMore: false,
		}
	}

	const userIds = rows.map((row) => row.userId)
	const freelancerProfileIds = rows.map((row) => row.freelancerProfileId)

	const [skillRows, portfolioRows] = await Promise.all([
		kysely
			.selectFrom('user_skills as user_skill')
			.innerJoin('skills as skill', 'skill.id', 'user_skill.skill_id')
			.select([
				'user_skill.user_id as userId',
				'user_skill.proficiency_level as proficiencyLevel',
				'skill.id as skillId',
				'skill.name as skillName',
				'skill.category as skillCategory',
			])
			.where('user_skill.user_id', 'in', userIds)
			.orderBy('skill.name', 'asc')
			.execute(),
		kysely
			.selectFrom('portfolio_items as portfolio_item')
			.select([
				'portfolio_item.freelancer_profile_id as freelancerProfileId',
				'portfolio_item.id as id',
				'portfolio_item.title as title',
				'portfolio_item.media_url as mediaUrl',
				'portfolio_item.media_type as mediaType',
				'portfolio_item.category as category',
				'portfolio_item.created_at as createdAt',
			])
			.where('portfolio_item.freelancer_profile_id', 'in', freelancerProfileIds)
			.orderBy('portfolio_item.created_at', 'desc')
			.execute(),
	])

	const skillsByUserId = new Map<string, PublicFreelancerGridItem['topSkills']>()
	const categoriesByUserId = new Map<string, Set<string>>()

	for (const row of skillRows) {
		const skills = skillsByUserId.get(row.userId) ?? []
		if (skills.length < 5) {
			skills.push({
				id: row.skillId,
				name: row.skillName,
				category: row.skillCategory,
				proficiencyLevel: row.proficiencyLevel,
			})
			skillsByUserId.set(row.userId, skills)
		}

		if (row.skillCategory) {
			const categories = categoriesByUserId.get(row.userId) ?? new Set<string>()
			categories.add(row.skillCategory)
			categoriesByUserId.set(row.userId, categories)
		}
	}

	const latestPortfolioByProfileId = new Map<
		string,
		PublicFreelancerGridItem['latestPortfolioItem']
	>()
	const portfolioCountByProfileId = new Map<string, number>()

	for (const row of portfolioRows) {
		portfolioCountByProfileId.set(
			row.freelancerProfileId,
			(portfolioCountByProfileId.get(row.freelancerProfileId) ?? 0) + 1,
		)

		if (!latestPortfolioByProfileId.has(row.freelancerProfileId)) {
			latestPortfolioByProfileId.set(row.freelancerProfileId, {
				id: row.id,
				title: row.title,
				mediaUrl: row.mediaUrl,
				mediaType: row.mediaType,
				category: row.category,
			})
		}
	}

	const items = rows.map((row) => ({
		freelancerProfileId: row.freelancerProfileId,
		href: `/freelancers/${row.freelancerProfileId}`,
		name: row.name,
		avatarUrl: row.avatarUrl,
		specialization: row.specialization,
		bioSnippet: toSnippet(row.bio),
		hourlyRate: row.hourlyRate,
		availability: row.availability,
		topSkills: skillsByUserId.get(row.userId) ?? [],
		skillCategories: Array.from(categoriesByUserId.get(row.userId) ?? []),
		portfolioCount: portfolioCountByProfileId.get(row.freelancerProfileId) ?? 0,
		latestPortfolioItem: latestPortfolioByProfileId.get(row.freelancerProfileId) ?? null,
	}))

	return {
		items,
		page,
		pageSize,
		total,
		hasMore: offset + items.length < total,
	}
}

export async function getOrCreateFreelancerProfileByUserId(
	userId: string,
): Promise<FreelancerProfileRow | null> {
	// extra safety: if the user was deleted but some code still calls this helper
	const userExists = await kysely
		.selectFrom('users')
		.select(['id'])
		.where('id', '=', userId)
		.executeTakeFirst()

	if (!userExists) return null

	let created: FreelancerProfileRow | undefined

	try {
		created = await kysely
			.insertInto('freelancer_profiles')
			.values({
				user_id: userId,
				updated_at: new Date(),
			})
			.onConflict((oc) => oc.column('user_id').doNothing())
			.returningAll()
			.executeTakeFirst()
	} catch (error) {
		// postgres fk violation (user deleted in-between check and insert)
		if ((error as { code?: string } | null)?.code === '23503') return null
		throw error
	}

	if (created) return created

	const existing = await kysely
		.selectFrom('freelancer_profiles')
		.selectAll()
		.where('user_id', '=', userId)
		.executeTakeFirst()

	return existing ?? null
}

function toSnippet(value: string | null, maxLength = 160) {
	if (!value) return null
	const normalized = value.replace(/\s+/g, ' ').trim()
	if (normalized.length <= maxLength) return normalized
	return `${normalized.slice(0, maxLength - 1).trimEnd()}…`
}
