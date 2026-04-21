import { z } from 'zod'
import { emailSchema, uuidSchema } from './common'

export const userRoleSchema = z.enum(['freelancer', 'client'])

export const languageLevelSchema = z.enum(['basic', 'conversational', 'fluent', 'native'])

export const userLanguageEntrySchema = z.object({
	languageCode: z
		.string()
		.min(2)
		.max(16)
		.transform((code) => code.toLowerCase()),
	langLevel: languageLevelSchema,
})

export const nicknameSchema = z
	.string()
	.min(3, 'Nickname must be at least 3 characters')
	.max(30)
	.regex(
		/^[a-z0-9]+(?:-[a-z0-9]+)*$/,
		'Use lowercase letters, digits, and single hyphens between segments',
	)
	.transform((value) => value.toLowerCase())

export const createUserSchema = z.object({
	email: emailSchema,
	password: z.string().min(8, 'Password must be at least 8 characters'),
	role: userRoleSchema,
	name: z.string().min(2, 'Name must be at least 2 characters').optional(),
})

export const updateUserProfileSchema = z
	.object({
		name: z.string().min(2).optional(),
		nickname: nicknameSchema.optional(),
		location: z.string().max(255).optional().nullable(),
		bio: z.string().max(500).optional(),
		avatarUrl: z.string().url().optional(),
		companyName: z.string().optional(),
		companyRole: z.string().optional(),
		languages: z.array(userLanguageEntrySchema).max(32).optional(),
	})
	.superRefine((data, ctx) => {
		if (data.languages) {
			const seen = new Set<string>()
			data.languages.forEach((row, idx) => {
				const key = row.languageCode.toLowerCase()
				if (seen.has(key)) {
					ctx.addIssue({
						code: 'custom',
						message: 'Duplicate languageCode',
						path: ['languages', idx, 'languageCode'],
					})
				}
				seen.add(key)
			})
		}
	})

export const userSkillSchema = z.object({
	skillId: uuidSchema,
	proficiencyLevel: z.enum(['beginner', 'intermediate', 'advanced', 'expert']),
})

export const addUserSkillsSchema = z.object({
	skills: z.array(userSkillSchema).superRefine((skills, ctx) => {
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
	}),
})

export type CreateUserInput = z.infer<typeof createUserSchema>
export type UpdateUserProfileInput = z.infer<typeof updateUserProfileSchema>
export type UserSkillInput = z.infer<typeof userSkillSchema>
export type AddUserSkillsInput = z.infer<typeof addUserSkillsSchema>
export type UserRole = z.infer<typeof userRoleSchema>
