import type { UserSkillInput } from '@/lib/validations'

export type OnboardingStep = 1 | 2 | 3 | 4 | 5

export type ProfileData = {
	name: string
} & (
	| {
			kind: 'freelancer'
			bio?: string
			specialization?: string
	  }
	| {
			kind: 'client'
			companyName: string
			companyRole?: string
	  }
)

export type UpdateSkillLevel = {
	skillId: string
	level: UserSkillInput['proficiencyLevel']
}

export type Skill = {
	id: string
	name: string
	category: string
}

export type CredentialField = {
	field: 'email' | 'password'
	value: string
}

export type ProfileField = {
	kind: 'freelancer' | 'client'
	field: string
	value: string
}

export type ProfileErrors = {
	name?: string
	bio?: string
	specialization?: string
	companyName?: string
	companyRole?: string
}
