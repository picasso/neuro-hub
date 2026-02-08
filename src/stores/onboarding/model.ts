import { combine, createEffect, sample } from 'effector'
import { produce } from 'immer'
import { find, findIndex } from 'lodash'
import type {
	CredentialField,
	OnboardingStep,
	ProfileData,
	ProfileErrors,
	ProfileField,
	RegisterUserInput,
	Skill,
	UpdateSkillLevel,
} from './types'
import { createAlertFx } from '@/alerts'
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
export const submitRegistration = domain.createEvent('submitRegistration')

export const $credentials = domain.createStore<CredentialsInput | null>(null, {
	name: '$credentials',
})

$credentials.reset(resetCredentials)
$credentials.on(setCredentials, (_, credentials) => credentials)

$credentials.on(updateCredentialField, (credentials, { field, value }) =>
	produce(credentials, (draft) => {
		if (!draft) {
			return { [field]: value } as CredentialsInput
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
		if (!draft) {
			return { kind, [field]: value } as ProfileData
		}

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

// * * * $credentialsErrors -----------------------------------------------------------------------]

type CredentialsErrors = {
	email?: string
	password?: string
}

const resetCredentialsErrors = domain.createEvent('resetCredentialsErrors')
export const $credentialsErrors = domain.createStore<CredentialsErrors>(
	{},
	{
		name: '$credentialsErrors',
	},
)

$credentialsErrors.reset(resetCredentialsErrors)

// clear errors when field is updated
sample({
	clock: updateCredentialField,
	source: $credentialsErrors,
	fn: (errors, { field }) =>
		produce(errors, (draft) => {
			delete draft[field as keyof CredentialsErrors]
		}),
	target: $credentialsErrors,
})

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
		const exists = find(draft, { skillId: skill.skillId })
		if (!exists) {
			draft.push(skill)
		}
	}),
)

$selectedSkills.on(removeSkill, (skills, skillId) =>
	produce(skills, (draft) => {
		const index = findIndex(draft, { skillId })
		if (index !== -1) {
			draft.splice(index, 1)
		}
	}),
)

$selectedSkills.on(updateSkillLevel, (skills, { skillId, level }) =>
	produce(skills, (draft) => {
		const skill = find(draft, { skillId })
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

const onboardingId = createAlertFx.alertId('onboarding-register')
const skillsId = createAlertFx.alertId('onboarding-skills')

type BetterAuthError = {
	error?: {
		message?: string
		code?: string
		statusCode?: number
	}
	message?: string
	status?: number
	statusText?: string
}

export const registerUserFx = createEffect<RegisterUserInput, unknown, Error>(
	async ({ email, password, name, profileData }) => {
		const timerId = setTimeout(() => {
			createAlertFx({
				id: onboardingId,
				severity: 'progress',
				title: 'Регистрация...',
				message: 'Создаём ваш аккаунт',
				disableClose: true,
				disableAutoClose: true,
			})
		}, 800)

		try {
			const result = await authClient.signUp.email(
				{
					email,
					password,
					name,
					callbackURL: '/dashboard',
					fetchOptions: {
						onSuccess: () => {},
						body: {
							profileData,
						},
					},
				},
				{
					body: {
						profileData,
					},
				},
			)

			clearTimeout(timerId)

			if (!result.data) {
				const error = result.error as BetterAuthError
				const errorMessage =
					error?.error?.message || error?.message || 'Не удалось создать аккаунт'
				throw new Error(errorMessage)
			}

			return result.data
		} catch (error) {
			clearTimeout(timerId)
			throw error
		}
	},
)

export const loadSkillsFx = createEffect<void, Skill[], Error>(async () => {
	const timerId = setTimeout(() => {
		createAlertFx({
			id: skillsId,
			severity: 'progress',
			title: 'Загрузка навыков...',
			message: 'Получаем список доступных навыков',
			disableClose: true,
			disableAutoClose: true,
		})
	}, 800)

	try {
		const response = await fetch('/api/skills?pageSize=100')

		clearTimeout(timerId)

		if (!response.ok) {
			const error = await response.json()
			throw new Error(error.error?.message || 'Не удалось загрузить навыки')
		}

		const result = await response.json()

		if (!result.success || !result.data) {
			throw new Error('Некорректный формат ответа от сервера')
		}

		return result.data
	} catch (error) {
		clearTimeout(timerId)
		if (error instanceof Error) {
			throw error
		}
		const betterAuthError = error as BetterAuthError
		const errorMessage =
			betterAuthError?.error?.message ||
			betterAuthError?.message ||
			'Не удалось создать аккаунт'
		throw new Error(errorMessage)
	}
})

// update `$allSkills` when `loadSkillsFx` succeeds
$allSkills.on(loadSkillsFx.doneData, (_, skills) => skills)

// * * * Computed stores --------------------------------------------------------------------------]

export const $isLoading = combine([registerUserFx.pending, loadSkillsFx.pending], (states) =>
	states.some(Boolean),
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
				return profileData !== null
			case 3:
				if (role === 'freelancer') {
					return selectedSkills.length > 0
				}
				return true
			case 4:
				return credentials !== null
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
		resetCredentialsErrors,
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
	filter: (step) => step < 5,
	fn: (step) => (step + 1) as OnboardingStep,
	target: setCurrentStep,
})

// auto-skip step 3 (skills) for client role
sample({
	clock: $currentStep,
	source: $role,
	filter: (role, currentStep) => currentStep === 3 && role === 'client',
	fn: () => 4 as OnboardingStep,
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
		updateCredentialField,
		setProfileData,
		updateProfileField,
		addSkill,
		removeSkill,
		updateSkillLevel,
	],
	target: resetError,
})

// validate credentials and set errors when validation fails
sample({
	clock: validateCredentialsAndContinue,
	source: $credentials,
	filter: (credentials) => {
		if (!credentials) return false
		const result = credentialsSchema.safeParse(credentials)
		return !result.success
	},
	fn: (credentials) => {
		const result = credentialsSchema.safeParse(credentials!)
		const fieldErrors: CredentialsErrors = {}
		if (!result.success) {
			result.error.issues.forEach((err) => {
				const field = err.path[0] as keyof CredentialsErrors
				fieldErrors[field] = err.message
			})
		}
		return fieldErrors
	},
	target: $credentialsErrors,
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

// set error when `loadSkillsFx` fails
sample({
	clock: loadSkillsFx.failData,
	fn: (error) => error.message,
	target: $error,
})

// * * * Alert notifications for effects ----------------------------------------------------------]

// remove progress alert when registration finishes
sample({
	clock: registerUserFx.finally,
	fn: () => ({ id: onboardingId }),
	target: createAlertFx.removeFx,
})

// show error alert when registration fails
sample({
	clock: registerUserFx.failData,
	fn: (error) =>
		createAlertFx.props({
			severity: 'error',
			title: 'Ошибка регистрации',
			message: error.message ?? 'Не удалось создать аккаунт',
			disableAutoClose: true,
		}),
	target: createAlertFx,
})

// remove progress alert when loading skills finishes
sample({
	clock: loadSkillsFx.finally,
	fn: () => ({ id: skillsId }),
	target: createAlertFx.removeFx,
})

// show error alert when loading skills fails
sample({
	clock: loadSkillsFx.failData,
	fn: (error) =>
		createAlertFx.props({
			severity: 'error',
			title: 'Ошибка загрузки',
			message: error.message ?? 'Не удалось загрузить список навыков',
			disableAutoClose: true,
		}),
	target: createAlertFx,
})

// * * * Automatic effects triggering based on `$currentStep` -------------------------------------]

// trigger `loadSkillsFx` when step 3 is reached (freelancer only, load once)
sample({
	clock: $currentStep,
	source: {
		allSkills: $allSkills,
		role: $role,
		isLoading: loadSkillsFx.pending,
	},
	filter: ({ allSkills, role, isLoading }, currentStep) => {
		return currentStep === 3 && !isLoading && role === 'freelancer' && allSkills.length === 0
	},
	target: loadSkillsFx,
})

// validate credentials and show errors when `submitRegistration` is called with invalid data
sample({
	clock: submitRegistration,
	source: $credentials,
	filter: (credentials) => {
		if (!credentials) return false
		const result = credentialsSchema.safeParse(credentials)
		return !result.success
	},
	fn: (credentials) => {
		const result = credentialsSchema.safeParse(credentials!)
		const fieldErrors: CredentialsErrors = {}
		if (!result.success) {
			result.error.issues.forEach((err) => {
				const field = err.path[0] as keyof CredentialsErrors
				fieldErrors[field] = err.message
			})
		}
		return fieldErrors
	},
	target: $credentialsErrors,
})

// trigger registration when submitRegistration is called (from credentials step)
sample({
	clock: submitRegistration,
	source: {
		credentials: $credentials,
		profile: $profileData,
		role: $role,
		skills: $selectedSkills,
	},
	filter: ({ credentials, profile, role, skills }) => {
		if (!credentials || !profile || !role) return false
		const credentialsValid = credentialsSchema.safeParse(credentials).success
		if (!credentialsValid) return false
		if (role === 'freelancer' && skills.length === 0) return false
		return true
	},
	fn: ({ credentials, profile, role, skills }) => ({
		email: credentials!.email,
		password: credentials!.password,
		name: profile!.name,
		role: role!,
		profileData: {
			name: profile!.name,
			bio: profile!.kind === 'freelancer' ? profile!.bio : undefined,
			companyName: profile!.kind === 'client' ? profile!.companyName : undefined,
			companyRole: profile!.kind === 'client' ? profile!.companyRole : undefined,
			skills: role === 'freelancer' && skills.length > 0 ? skills : undefined,
		},
	}),
	target: registerUserFx,
})

// go to step 5 (email verification) when registration succeeds
sample({
	clock: registerUserFx.doneData,
	fn: () => 5 as OnboardingStep,
	target: setCurrentStep,
})

// * * * helpers ---------------------------------------------------------------------------------]

function validateProfileData(profileData: ProfileData) {
	const { kind, ...dataWithoutKind } = profileData
	const schema = kind === 'freelancer' ? freelancerProfileSchema : clientProfileSchema
	return schema.safeParse(dataWithoutKind)
}
