import { z } from 'zod'
import { emailSchema } from './common'
import { addUserSkillsSchema, updateUserProfileSchema, userRoleSchema } from './user'

export const roleSelectionSchema = z.object({
	role: userRoleSchema,
})

export const credentialsSchema = z.object({
	email: emailSchema,
	password: z.string().min(8, 'Password must be at least 8 characters'),
})

export const freelancerProfileSchema = z.object({
	name: z.string().min(2, 'Name must be at least 2 characters'),
	bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
})

export const clientProfileSchema = z.object({
	name: z.string().min(2, 'Name must be at least 2 characters'),
	companyName: z.string().min(2, 'Company name must be at least 2 characters'),
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
