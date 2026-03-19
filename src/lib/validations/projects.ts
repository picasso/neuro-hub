import { z } from 'zod'
import { uuidSchema } from './common'
import { freelancerDirectoryCategorySchema } from './freelancer-directory'

export const projectIdParamSchema = z.object({
	id: uuidSchema,
})

export const applicationIdParamSchema = z.object({
	id: uuidSchema,
})

const allowedAttachmentProtocols = new Set(['https:', 'http:'])

const projectAttachmentUrlSchema = z
	.string()
	.trim()
	.url()
	.refine((value) => {
		const url = new URL(value)
		if (!allowedAttachmentProtocols.has(url.protocol)) {
			return false
		}

		if (url.protocol === 'https:') {
			return true
		}

		return ['localhost', '127.0.0.1', '::1'].includes(url.hostname)
	}, 'Attachment URL must use https or local development http')

export const projectAttachmentSchema = z.object({
	filename: z.string().trim().min(1).max(255),
	fileUrl: projectAttachmentUrlSchema,
	mimeType: z.string().trim().min(1).max(100).optional(),
	fileSizeBytes: z
		.number()
		.int()
		.positive()
		.max(10 * 1024 * 1024)
		.optional(),
})

export const projectExperienceLevelSchema = z.enum(['junior', 'middle', 'senior', 'lead'])

export const projectBudgetTypeSchema = z.enum(['fixed', 'hourly'])

export const projectStatusSchema = z.enum([
	'draft',
	'published',
	'in_progress',
	'completed',
	'cancelled',
])

export const applicationStatusSchema = z.enum([
	'submitted',
	'shortlisted',
	'accepted',
	'rejected',
	'withdrawn',
])

export const projectSkillIdsSchema = z
	.array(uuidSchema)
	.min(1, 'Select at least one skill')
	.max(10, 'Too many skills')
	.refine((value) => new Set(value).size === value.length, 'Skill ids must be unique')

const projectFieldsSchema = z.object({
	title: z.string().trim().min(10).max(255),
	description: z.string().trim().min(50).max(5000),
	category: freelancerDirectoryCategorySchema,
	experienceLevel: projectExperienceLevelSchema,
	budgetType: projectBudgetTypeSchema,
	budgetMin: z.number().int().positive(),
	budgetMax: z.number().int().positive(),
	deadline: z.coerce.date(),
	status: projectStatusSchema,
	skillIds: projectSkillIdsSchema,
	attachments: z.array(projectAttachmentSchema).max(5),
})

export const fullProjectSchema = projectFieldsSchema.refine(
	(value) => value.budgetMax >= value.budgetMin,
	{
		message: 'Budget max must be greater than or equal to budget min',
		path: ['budgetMax'],
	},
)

export const createProjectSchema = projectFieldsSchema
	.extend({
		status: z.enum(['draft', 'published']).default('published'),
		attachments: z.array(projectAttachmentSchema).max(5).default([]),
	})
	.refine((value) => value.budgetMax >= value.budgetMin, {
		message: 'Budget max must be greater than or equal to budget min',
		path: ['budgetMax'],
	})
	.refine((value) => value.deadline.getTime() > Date.now(), {
		message: 'Deadline must be in the future',
		path: ['deadline'],
	})

export const updateProjectSchema = z
	.object({
		title: z.string().trim().min(10).max(255).optional(),
		description: z.string().trim().min(50).max(5000).optional(),
		category: freelancerDirectoryCategorySchema.optional(),
		experienceLevel: projectExperienceLevelSchema.optional(),
		budgetType: projectBudgetTypeSchema.optional(),
		budgetMin: z.number().int().positive().optional(),
		budgetMax: z.number().int().positive().optional(),
		deadline: z.coerce.date().optional(),
		status: projectStatusSchema.optional(),
		skillIds: projectSkillIdsSchema.optional(),
		attachments: z.array(projectAttachmentSchema).max(5).optional(),
	})
	.refine(
		(value) =>
			value.budgetMin === undefined ||
			value.budgetMax === undefined ||
			value.budgetMax >= value.budgetMin,
		{
			message: 'Budget max must be greater than or equal to budget min',
			path: ['budgetMax'],
		},
	)
	.refine((value) => !value.deadline || value.deadline.getTime() > Date.now(), {
		message: 'Deadline must be in the future',
		path: ['deadline'],
	})

export const createApplicationSchema = z
	.object({
		// use .refine for min length so issues use code "custom" with our message (Zod 4 can emit
		// default English "too_small" for .min() in some pipelines)
		coverLetter: z
			.string()
			.trim()
			.max(3000, { message: 'Сопроводительное письмо не должно превышать 3000 символов' })
			.refine((value) => value.length >= 50, {
				message: 'Сопроводительное письмо должно содержать не менее 50 символов',
			}),
		proposedPrice: z
			.number({ error: () => ({ message: 'Укажите корректную сумму' }) })
			.int({ message: 'Укажите целое число' })
			.positive({ message: 'Укажите сумму больше 0' }),
		proposedDeadline: z.coerce.date().optional(),
	})
	.refine((value) => !value.proposedDeadline || value.proposedDeadline.getTime() > Date.now(), {
		message: 'Предлагаемый срок должен быть в будущем',
		path: ['proposedDeadline'],
	})

export type ProjectAttachmentInput = z.infer<typeof projectAttachmentSchema>
export type ProjectExperienceLevel = z.infer<typeof projectExperienceLevelSchema>
export type ProjectBudgetType = z.infer<typeof projectBudgetTypeSchema>
export type ProjectStatus = z.infer<typeof projectStatusSchema>
export type ApplicationStatus = z.infer<typeof applicationStatusSchema>
export type FullProjectInput = z.infer<typeof fullProjectSchema>
export type CreateProjectInput = z.infer<typeof createProjectSchema>
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>
export type CreateApplicationInput = z.infer<typeof createApplicationSchema>
