import { z } from 'zod'
import { uuidSchema } from './common'

/**
 * Public freelancer profile routes address a profile by its domain UUID:
 * `freelancer_profiles.id`.
 */
export const freelancerProfileIdParamSchema = z.object({
	id: uuidSchema,
})

export const updateFreelancerProfileSchema = z.object({
	specialization: z.string().min(1).max(255).optional(),
	hourlyRate: z.number().int().positive().optional(),
	availability: z.string().min(1).max(100).optional(),
	experience: z.string().max(5000).optional(),
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
