import { combine, createEffect, sample } from 'effector'
import { produce } from 'immer'
import type {
	CredentialField,
	OnboardingStep,
	ProfileData,
	ProfileErrors,
	ProfileField,
	Skill,
	UpdateSkillLevel,
} from './types'
import { authClient } from '@/lib/auth/client'
import { onboardingDomain as domain } from '@/lib/logger'
import {
	clientProfileSchema,
	credentialsSchema,
	freelancerProfileSchema,
	type CredentialsInput,
	type UserRole,
	type UserSkillInput,
} from '@/lib/validations'

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
export const updateCredentialField = domain.createEvent<CredentialField>('updateCredentialField')
export const validateCredentialsAndContinue = domain.createEvent('validateCredentialsAndContinue')

export const $credentials = domain.createStore<CredentialsInput | null>(null, {
	name: '$credentials',
})

$credentials.reset(resetCredentials)
$credentials.on(setCredentials, (_, credentials) => credentials)

$credentials.on(updateCredentialField, (credentials, { field, value }) =>
	produce(credentials, (draft) => {
		if (!draft) {
			draft = { email: '', password: '' }
		}
		draft[field] = value
	}),
)

// * * * $profileData -----------------------------------------------------------------------------]

const resetProfileData = domain.createEvent('resetProfileData')
export const setProfileData = domain.createEvent<ProfileData>('setProfileData')
export const updateProfileField = domain.createEvent<ProfileField>('updateProfileField')
export const validateAndContinue = domain.createEvent('validateAndContinue')

export const $profileData = domain.createStore<ProfileData | null>(null, {
	name: '$profileData',
})

$profileData.reset(resetProfileData)
$profileData.on(setProfileData, (_, data) => data)

$profileData.on(updateProfileField, (profile, { kind, field, value }) =>
	produce(profile, (draft) => {
		if (!draft) return

		if (draft.kind === 'freelancer' && kind === 'freelancer') {
			if (field === 'name') {
				draft.name = value
			} else if (field === 'bio') {
				draft.bio = value
			} else if (field === 'specialization') {
				draft.specialization = value
			}
		} else if (draft.kind === 'client' && kind === 'client') {
			if (field === 'name') {
				draft.name = value
			} else if (field === 'companyName') {
				draft.companyName = value
			} else if (field === 'companyRole') {
				draft.companyRole = value
			}
		}
	}),
)

// * * * $profileErrors ---------------------------------------------------------------------------]

const resetProfileErrors = domain.createEvent('resetProfileErrors')
export const $profileErrors = domain.createStore<ProfileErrors>(
	{},
	{
		name: '$profileErrors',
	},
)

$profileErrors.reset(resetProfileErrors)

// clear errors when field is updated
sample({
	clock: updateProfileField,
	source: $profileErrors,
	fn: (errors, { field }) =>
		produce(errors, (draft) => {
			delete draft[field as keyof ProfileErrors]
		}),
	target: $profileErrors,
})

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

// * * * $allSkills -------------------------------------------------------------------------------]

const resetAllSkills = domain.createEvent('resetAllSkills')
export const $allSkills = domain.createStore<Skill[]>([], { name: '$allSkills' })

$allSkills.reset(resetAllSkills)

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

export const updateProfileFx = createEffect<Omit<ProfileData, 'kind'>, unknown, Error>(
	async (profileData) => {
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
	},
)

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

export const loadSkillsFx = createEffect<void, Skill[], Error>(async () => {
	const response = await fetch('/api/skills?pageSize=100')

	if (!response.ok) {
		throw new Error('Failed to load skills')
	}

	const result = await response.json()

	if (!result.success || !result.data) {
		throw new Error('Invalid response format')
	}

	return result.data
})

// update `$allSkills` when `loadSkillsFx` succeeds
$allSkills.on(loadSkillsFx.doneData, (_, skills) => skills)

// * * * Computed stores --------------------------------------------------------------------------]

export const $isLoading = combine(
	[registerUserFx.pending, updateProfileFx.pending, addSkillsFx.pending, loadSkillsFx.pending],
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

// reset all stores when `resetOnboarding` is called
sample({
	clock: resetOnboarding,
	target: [
		resetCurrentStep,
		resetRole,
		resetCredentials,
		resetProfileData,
		resetProfileErrors,
		resetSelectedSkills,
		resetAllSkills,
		resetError,
	],
})

// * * * connections and consequences -------------------------------------------------------------]

// automatically move to step 2 when `setRole` is called
sample({
	clock: setRole,
	fn: () => 2 as OnboardingStep,
	target: setCurrentStep,
})

// initialize profile data when role is set
sample({
	clock: setRole,
	fn: (role): ProfileData => {
		if (role === 'freelancer') {
			return {
				kind: 'freelancer',
				name: '',
			}
		} else {
			return {
				kind: 'client',
				name: '',
				companyName: '',
			}
		}
	},
	target: setProfileData,
})

// increment step when `nextStep` is called
sample({
	clock: nextStep,
	source: $currentStep,
	filter: (step) => step < 4,
	fn: (step) => (step + 1) as OnboardingStep,
	target: setCurrentStep,
})

// decrement step when `prevStep` is called
sample({
	clock: prevStep,
	source: $currentStep,
	filter: (step) => step > 1,
	fn: (step) => (step - 1) as OnboardingStep,
	target: setCurrentStep,
})

// clear error when any store updates
sample({
	clock: [
		setRole,
		setCredentials,
		setProfileData,
		updateProfileField,
		addSkill,
		removeSkill,
		updateSkillLevel,
	],
	target: resetError,
})

// validate credentials and continue to next step when `validateCredentialsAndContinue` is called
sample({
	clock: validateCredentialsAndContinue,
	source: $credentials,
	filter: (credentials) => {
		if (!credentials) return false
		const result = credentialsSchema.safeParse(credentials)
		return result.success
	},
	target: nextStep,
})

// validate profile and continue to next step when `validateAndContinue` is called
sample({
	clock: validateAndContinue,
	source: {
		profileData: $profileData,
	},
	filter: ({ profileData }) => {
		if (!profileData) return false
		const result = validateProfileData(profileData)
		return !result.success
	},
	fn: ({ profileData }) => {
		const result = validateProfileData(profileData!)
		const fieldErrors: ProfileErrors = {}
		if (!result.success) {
			result.error.issues.forEach((err) => {
				const field = err.path[0] as keyof ProfileErrors
				fieldErrors[field] = err.message
			})
		}
		return fieldErrors
	},
	target: $profileErrors,
})

// go to next step if validation succeeded
sample({
	clock: validateAndContinue,
	source: {
		profileData: $profileData,
	},
	filter: ({ profileData }) => {
		if (!profileData) return false
		const result = validateProfileData(profileData)
		return result.success
	},
	target: nextStep,
})

// set error when `registerUserFx` fails
sample({
	clock: registerUserFx.failData,
	fn: (error) => error.message,
	target: $error,
})

// set error when `updateProfileFx` fails
sample({
	clock: updateProfileFx.failData,
	fn: (error) => error.message,
	target: $error,
})

// set error when `addSkillsFx` fails
sample({
	clock: addSkillsFx.failData,
	fn: (error) => error.message,
	target: $error,
})

// set error when `loadSkillsFx` fails
sample({
	clock: loadSkillsFx.failData,
	fn: (error) => error.message,
	target: $error,
})

// * * * Automatic effects triggering based on `$currentStep` -------------------------------------]

// trigger `loadSkillsFx` when step 4 is reached (freelancer only, load once)
sample({
	clock: $currentStep,
	source: {
		allSkills: $allSkills,
		role: $role,
		isLoading: loadSkillsFx.pending,
	},
	filter: ({ allSkills, role, isLoading }, currentStep) => {
		return currentStep === 4 && !isLoading && role === 'freelancer' && allSkills.length === 0
	},
	target: loadSkillsFx,
})

// trigger `registerUserFx` when step 3 is reached
sample({
	clock: $currentStep,
	source: {
		credentials: $credentials,
		profile: $profileData,
		role: $role,
		isRegistering: registerUserFx.pending,
	},
	filter: ({ credentials, profile, role, isRegistering }, currentStep) => {
		return (
			currentStep === 3 &&
			!isRegistering &&
			credentials !== null &&
			profile !== null &&
			role !== null
		)
	},
	fn: ({ credentials, profile, role }) => ({
		email: credentials!.email,
		password: credentials!.password,
		name: profile!.name,
		role: role!,
	}),
	target: registerUserFx,
})

// trigger `updateProfileFx` when step 4 is reached
sample({
	clock: $currentStep,
	source: {
		profile: $profileData,
		isUpdating: updateProfileFx.pending,
	},
	filter: ({ profile, isUpdating }, currentStep) => {
		return currentStep === 4 && !isUpdating && profile !== null
	},
	fn: ({ profile }) => {
		const { kind: _kind, ...dataWithoutKind } = profile!
		return dataWithoutKind
	},
	target: updateProfileFx,
})

// trigger `addSkillsFx` when step 5 is reached (freelancer only)
sample({
	clock: $currentStep,
	source: {
		skills: $selectedSkills,
		role: $role,
		isAdding: addSkillsFx.pending,
	},
	filter: ({ skills, role, isAdding }, currentStep) => {
		return currentStep === 5 && !isAdding && role === 'freelancer' && skills.length > 0
	},
	fn: ({ skills }) => ({ skills }),
	target: addSkillsFx,
})

// * * * helpers ---------------------------------------------------------------------------------]

function validateProfileData(profileData: ProfileData) {
	const { kind, ...dataWithoutKind } = profileData
	const schema = kind === 'freelancer' ? freelancerProfileSchema : clientProfileSchema
	return schema.safeParse(dataWithoutKind)
}
