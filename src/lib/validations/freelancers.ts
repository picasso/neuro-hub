import { z } from 'zod'
import { uuidSchema } from './common'
import { userSkillSchema, nicknameSchema } from './user'

/**
 * Public freelancer routes use the user profile nickname slug (`user_profiles.nickname`).
 */
export const freelancerNicknameParamSchema = z.object({
	nickname: nicknameSchema,
})

/** @deprecated Use freelancerNicknameParamSchema — kept for internal UUID references only */
export const freelancerProfileIdParamSchema = z.object({
	id: uuidSchema,
})

export const updateFreelancerProfileSchema = z.object({
	specialization: z.string().min(1).max(255).optional(),
	hourlyRate: z.number().int().positive().optional(),
	availability: z.string().min(1).max(100).optional(),
	experience: z.string().max(5000).optional(),
	skills: z
		.array(userSkillSchema)
		.superRefine((skills, ctx) => {
			const seen = new Set<string>()
			skills.forEach((skill, idx) => {
				if (seen.has(skill.skillId)) {
					ctx.addIssue({
						code: 'custom',
						message: 'Duplicate skillId',
						path: [idx, 'skillId'],
					})
				}
				seen.add(skill.skillId)
			})
		})
		.optional(),
})

export const createPortfolioItemSchema = z.object({
	title: z.string().min(2).max(255),
	description: z.string().max(5000).optional(),
	mediaUrl: z.url(),
	mediaType: z.string().max(50).optional(),
	mediaWidth: z.number().int().positive().optional(),
	mediaHeight: z.number().int().positive().optional(),
	caption: z.string().max(5000).optional(),
	category: z.string().max(100).optional(),
	toolsUsed: z.array(z.string().min(1).max(100)).optional(),
})

export const portfolioItemIdParamSchema = z.object({
	itemId: uuidSchema,
})

export type UpdateFreelancerProfileInput = z.infer<typeof updateFreelancerProfileSchema>
export type CreatePortfolioItemInput = z.infer<typeof createPortfolioItemSchema>
