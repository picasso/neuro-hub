import { z } from 'zod'
import { paginationSchema } from './common'
import { freelancerDirectoryCategorySchema } from './freelancer-directory'
import {
	applicationStatusSchema,
	projectBudgetTypeSchema,
	projectExperienceLevelSchema,
} from './projects'

export const projectDirectorySortSchema = z.enum([
	'recommended',
	'newest',
	'budget_asc',
	'budget_desc',
	'deadline_asc',
])

export const projectDirectoryQuerySchema = paginationSchema.extend({
	pageSize: z.coerce.number().int().positive().max(100).default(12),
	q: z
		.string()
		.trim()
		.max(100)
		.optional()
		.transform((value) => value || undefined),
	category: freelancerDirectoryCategorySchema.optional(),
	experienceLevel: projectExperienceLevelSchema.optional(),
	budgetType: projectBudgetTypeSchema.optional(),
	budgetMin: z.coerce.number().int().positive().optional(),
	budgetMax: z.coerce.number().int().positive().optional(),
	deadlineBefore: z.coerce.date().optional(),
	sort: projectDirectorySortSchema.default('recommended'),
})

export const applicationsQuerySchema = paginationSchema.extend({
	pageSize: z.coerce.number().int().positive().max(100).default(12),
	status: applicationStatusSchema.optional(),
})

export type ProjectDirectorySort = z.infer<typeof projectDirectorySortSchema>
export type ProjectDirectoryQueryInput = z.infer<typeof projectDirectoryQuerySchema>
export type ApplicationsQueryInput = z.infer<typeof applicationsQuerySchema>
