export type FreelancerProfileForm = {
	specialization: string
	hourlyRate: string
	availability: string
	experience: string
}

export type FreelancerProfileDto = {
	profileId: string
	userId: string
	specialization: string | null
	hourlyRate: number | null
	availability: string | null
	experience: string | null
	createdAt: string | Date | null
	updatedAt: string | Date | null
}
