import { combine, createEffect, sample } from 'effector'
import { produce } from 'immer'
import type { OnboardingStep, ProfileData, UpdateSkillLevel } from './types'
import type { CredentialsInput, UserRole, UserSkillInput } from '@/lib/validations'
import { authClient } from '@/lib/auth/client'
import { onboardingDomain as domain } from '@/lib/logger'

// * * * $currentStep -----------------------------------------------------------------------------]

const resetCurrentStep = domain.createEvent('resetCurrentStep')
export const setCurrentStep = domain.createEvent<OnboardingStep>('setCurrentStep')
export const nextStep = domain.createEvent('nextStep')
export const prevStep = domain.createEvent('prevStep')
export const $currentStep = domain.createStore<OnboardingStep>(1, {
	name: '$currentStep',
})

$currentStep.reset(resetCurrentStep)
$currentStep.on(setCurrentStep, (_, step) => step)

// * * * $role ------------------------------------------------------------------------------------]

const resetRole = domain.createEvent('resetRole')
export const setRole = domain.createEvent<UserRole>('setRole')
export const $role = domain.createStore<UserRole | null>(null, { name: '$role' })

$role.reset(resetRole)
$role.on(setRole, (_, role) => role)

// * * * $credentials -----------------------------------------------------------------------------]

const resetCredentials = domain.createEvent('resetCredentials')
export const setCredentials = domain.createEvent<CredentialsInput>('setCredentials')
export const $credentials = domain.createStore<CredentialsInput | null>(null, {
	name: '$credentials',
})

$credentials.reset(resetCredentials)
$credentials.on(setCredentials, (_, credentials) => credentials)

// * * * $profileData -----------------------------------------------------------------------------]

const resetProfileData = domain.createEvent('resetProfileData')
export const setProfileData = domain.createEvent<ProfileData>('setProfileData')
export const $profileData = domain.createStore<ProfileData | null>(null, {
	name: '$profileData',
})

$profileData.reset(resetProfileData)
$profileData.on(setProfileData, (_, data) => data)

// * * * $selectedSkills --------------------------------------------------------------------------]

const resetSelectedSkills = domain.createEvent('resetSelectedSkills')
export const addSkill = domain.createEvent<UserSkillInput>('addSkill')
export const removeSkill = domain.createEvent<string>('removeSkill')
export const updateSkillLevel = domain.createEvent<UpdateSkillLevel>('updateSkillLevel')

export const $selectedSkills = domain.createStore<UserSkillInput[]>([], {
	name: '$selectedSkills',
})

$selectedSkills.reset(resetSelectedSkills)

$selectedSkills.on(addSkill, (skills, skill) =>
	produce(skills, (draft) => {
		const exists = draft.find((s) => s.skillId === skill.skillId)
		if (!exists) {
			draft.push(skill)
		}
	}),
)

$selectedSkills.on(removeSkill, (skills, skillId) =>
	produce(skills, (draft) => {
		const index = draft.findIndex((s) => s.skillId === skillId)
		if (index !== -1) {
			draft.splice(index, 1)
		}
	}),
)

$selectedSkills.on(updateSkillLevel, (skills, { skillId, level }) =>
	produce(skills, (draft) => {
		const skill = draft.find((s) => s.skillId === skillId)
		if (skill) {
			skill.proficiencyLevel = level
		}
	}),
)

// * * * $error -----------------------------------------------------------------------------------]

const resetError = domain.createEvent('resetError')
export const $error = domain.createStore<string | null>(null, { name: '$error' })

$error.reset(resetError)

// * * * Effects ----------------------------------------------------------------------------------]

export const registerUserFx = createEffect<
	{ email: string; password: string; name: string; role: UserRole },
	unknown,
	Error
>(async ({ email, password, name }) => {
	const result = await authClient.signUp.email({
		email,
		password,
		name,
		callbackURL: '/dashboard',
		fetchOptions: {
			onSuccess: () => {},
		},
	})

	if (!result.data) {
		throw new Error('Registration failed')
	}

	return result.data
})

export const updateProfileFx = createEffect<ProfileData, unknown, Error>(async (profileData) => {
	const response = await fetch('/api/user/profile', {
		method: 'PUT',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(profileData),
	})

	if (!response.ok) {
		const error = await response.json()
		throw new Error(error.error?.message || 'Failed to update profile')
	}

	return await response.json()
})

export const addSkillsFx = createEffect<{ skills: UserSkillInput[] }, unknown, Error>(
	async ({ skills }) => {
		const response = await fetch('/api/user-skills', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ skills }),
		})

		if (!response.ok) {
			const error = await response.json()
			throw new Error(error.error?.message || 'Failed to add skills')
		}

		return await response.json()
	},
)

// * * * Computed stores --------------------------------------------------------------------------]

export const $isLoading = combine(
	[registerUserFx.pending, updateProfileFx.pending, addSkillsFx.pending],
	(states) => states.some(Boolean),
)

export const $canGoNext = combine(
	{
		step: $currentStep,
		role: $role,
		credentials: $credentials,
		profileData: $profileData,
		selectedSkills: $selectedSkills,
	},
	({ step, role, credentials, profileData, selectedSkills }) => {
		switch (step) {
			case 1:
				return role !== null
			case 2:
				return credentials !== null
			case 3:
				if (role === 'freelancer') {
					return profileData !== null && selectedSkills.length > 0
				}
				return profileData !== null
			case 4:
				return true
			default:
				return false
		}
	},
)

export const $canGoPrev = $currentStep.map((step) => step > 1)

// * * * Reset all stores -------------------------------------------------------------------------]

export const resetOnboarding = domain.createEvent('resetOnboarding')

// reset all stores when resetOnboarding is called
sample({
	clock: resetOnboarding,
	target: [
		resetCurrentStep,
		resetRole,
		resetCredentials,
		resetProfileData,
		resetSelectedSkills,
		resetError,
	],
})

// * * * connections and consequences -------------------------------------------------------------]

// automatically move to step 2 when role is selected
sample({
	clock: setRole,
	fn: () => 2 as OnboardingStep,
	target: setCurrentStep,
})

// increment step when nextStep is called
sample({
	clock: nextStep,
	source: $currentStep,
	filter: (step) => step < 4,
	fn: (step) => (step + 1) as OnboardingStep,
	target: setCurrentStep,
})

// decrement step when prevStep is called
sample({
	clock: prevStep,
	source: $currentStep,
	filter: (step) => step > 1,
	fn: (step) => (step - 1) as OnboardingStep,
	target: setCurrentStep,
})

// clear error when any store updates
sample({
	clock: [setRole, setCredentials, setProfileData, addSkill, removeSkill, updateSkillLevel],
	target: resetError,
})

// set error when registerUserFx fails
sample({
	clock: registerUserFx.failData,
	fn: (error) => error.message,
	target: $error,
})

// set error when updateProfileFx fails
sample({
	clock: updateProfileFx.failData,
	fn: (error) => error.message,
	target: $error,
})

// set error when addSkillsFx fails
sample({
	clock: addSkillsFx.failData,
	fn: (error) => error.message,
	target: $error,
})
