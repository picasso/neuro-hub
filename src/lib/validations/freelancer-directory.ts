import { z } from 'zod'
import { paginationSchema } from './common'

export const freelancerDirectoryCategorySchema = z.enum([
	'text_generation',
	'image_generation',
	'video_generation',
	'audio_generation',
	'programming',
	'consulting',
])

export const freelancerDirectorySortSchema = z.enum([
	'recommended',
	'rate_asc',
	'rate_desc',
	'newest',
])

export const freelancerDirectoryQuerySchema = paginationSchema.extend({
	pageSize: z.coerce.number().int().positive().max(100).default(12),
	q: z
		.string()
		.trim()
		.max(100)
		.optional()
		.transform((value) => value || undefined),
	category: freelancerDirectoryCategorySchema.optional(),
	sort: freelancerDirectorySortSchema.default('recommended'),
	hasPortfolio: z
		.enum(['true', 'false'])
		.optional()
		.transform((value) => (value ? value === 'true' : undefined)),
})

export type FreelancerDirectoryCategory = z.infer<typeof freelancerDirectoryCategorySchema>
export type FreelancerDirectorySort = z.infer<typeof freelancerDirectorySortSchema>
export type FreelancerDirectoryQueryInput = z.infer<typeof freelancerDirectoryQuerySchema>
