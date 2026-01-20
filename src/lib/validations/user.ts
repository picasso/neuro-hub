import { z } from 'zod'
import { emailSchema, uuidSchema } from './common'

export const userRoleSchema = z.enum(['freelancer', 'client'])

export const createUserSchema = z.object({
	email: emailSchema,
	password: z.string().min(8, 'Password must be at least 8 characters'),
	role: userRoleSchema,
	name: z.string().min(2, 'Name must be at least 2 characters').optional(),
})

export const updateUserProfileSchema = z.object({
	name: z.string().min(2).optional(),
	bio: z.string().max(500).optional(),
	avatarUrl: z.string().url().optional(),
	companyName: z.string().optional(),
	companyRole: z.string().optional(),
})

export const userSkillSchema = z.object({
	skillId: uuidSchema,
	proficiencyLevel: z.enum(['beginner', 'intermediate', 'advanced', 'expert']),
})

export const addUserSkillsSchema = z.object({
	skills: z.array(userSkillSchema).min(1, 'At least one skill is required'),
})

export type CreateUserInput = z.infer<typeof createUserSchema>
export type UpdateUserProfileInput = z.infer<typeof updateUserProfileSchema>
export type UserSkillInput = z.infer<typeof userSkillSchema>
export type AddUserSkillsInput = z.infer<typeof addUserSkillsSchema>
export type UserRole = z.infer<typeof userRoleSchema>
