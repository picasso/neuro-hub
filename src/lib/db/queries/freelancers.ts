import { kysely } from '@/lib/db'

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
		category: string | null
		toolsUsed: unknown
		createdAt: Date | null
		updatedAt: Date | null
	}>
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
			category: p.category,
			toolsUsed: p.tools_used,
			createdAt: p.created_at,
			updatedAt: p.updated_at,
		})),
	}
}

export async function getOrCreateFreelancerProfileByUserId(userId: string) {
	const created = await kysely
		.insertInto('freelancer_profiles')
		.values({
			user_id: userId,
			updated_at: new Date(),
		})
		.onConflict((oc) => oc.column('user_id').doNothing())
		.returningAll()
		.executeTakeFirst()

	if (created) return created

	return await kysely
		.selectFrom('freelancer_profiles')
		.selectAll()
		.where('user_id', '=', userId)
		.executeTakeFirstOrThrow()
}
