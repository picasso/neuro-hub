import type {
	ClientProfileInput,
	CredentialsInput,
	FreelancerProfileInput,
	UserRole,
	UserSkillInput,
} from '@/lib/validations'

export type OnboardingStep = 1 | 2 | 3 | 4

export type ProfileData = FreelancerProfileInput | ClientProfileInput

export type OnboardingState = {
	currentStep: OnboardingStep
	role: UserRole | null
	credentials: CredentialsInput | null
	profileData: ProfileData | null
	selectedSkills: UserSkillInput[]
	isLoading: boolean
	error: string | null
}

export type StepValidation = {
	isValid: boolean
	errors: string[]
}

export type UpdateSkillLevel = {
	skillId: string
	level: UserSkillInput['proficiencyLevel']
}
