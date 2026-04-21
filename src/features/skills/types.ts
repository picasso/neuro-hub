import type { UserSkillInput } from '@/lib/validations'

export type SkillItem = {
	id: string
	name: string
	category: string | null
}

export type UserSkillDTO = {
	id: string
	userId: string
	skillId: string
	proficiencyLevel: UserSkillInput['proficiencyLevel']
	createdAt: string | Date | null
	skill: SkillItem
}

export type FreelancerSkills = {
	nickname: string
	specialization: string
	hourlyRate: string
	availability: string
	experience: string
}

export type FreelancerSkillsDTO = {
	nickname: string
	profileId: string
	userId: string
	specialization: string | null
	hourlyRate: number | null
	availability: string | null
	experience: string | null
	createdAt: string | Date | null
	updatedAt: string | Date | null
}

export type AccountSkillsLoadDTO = FreelancerSkillsDTO & {
	selectedSkills: UserSkillInput[]
}

export const skilLevelOptions: Array<{
	value: UserSkillInput['proficiencyLevel']
	label: string
}> = [
	{ value: 'beginner', label: 'Beginner' },
	{ value: 'intermediate', label: 'Intermediate' },
	{ value: 'advanced', label: 'Advanced' },
	{ value: 'expert', label: 'Expert' },
]
