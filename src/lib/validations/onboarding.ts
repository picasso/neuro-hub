import { z } from 'zod'
import { emailSchema } from './common'
import { addUserSkillsSchema, updateUserProfileSchema, userRoleSchema } from './user'

export const roleSelectionSchema = z.object({
	role: userRoleSchema,
})

export const credentialsSchema = z.object({
	email: emailSchema,
	password: z.string().min(8, 'Пароль должен содержать минимум 8 символов'),
})

export const freelancerProfileSchema = z.object({
	name: z.string().min(2, 'Имя должно содержать минимум 2 символа'),
	bio: z.string().max(500, 'Описание не должно превышать 500 символов').optional(),
})

export const clientProfileSchema = z.object({
	name: z.string().min(2, 'Имя должно содержать минимум 2 символа'),
	companyName: z.string().min(2, 'Название компании должно содержать минимум 2 символа'),
	companyRole: z.string().optional(),
})

export const onboardingDataSchema = z.object({
	role: userRoleSchema,
	email: emailSchema,
	password: z.string().min(8),
	profile: z.union([freelancerProfileSchema, clientProfileSchema]),
	skills: addUserSkillsSchema.optional(),
})

export type RoleSelectionInput = z.infer<typeof roleSelectionSchema>
export type CredentialsInput = z.infer<typeof credentialsSchema>
export type FreelancerProfileInput = z.infer<typeof freelancerProfileSchema>
export type ClientProfileInput = z.infer<typeof clientProfileSchema>
export type OnboardingDataInput = z.infer<typeof onboardingDataSchema>

export { updateUserProfileSchema, addUserSkillsSchema }
