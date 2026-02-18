import { createDomain } from 'effector'
import {
	type ConfigLogger,
	createDomainWatched,
	namedItems,
	watchedSettings,
} from './debug-effector'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyType = any

// skip logger on `[empty]` stores
watchedSettings({ hideEmptyStores: true })

export const debugStores = {
	generic: true,
	meta: false,
	onboarding: true,
	auth: true,
	viewer: true,
}

// * * * generic watched domain -------------------------------------------------------------------]

export const genericDomain = createDomainWatched('neurogig', {}, debugStores.generic)

export const genericMuteDomain = createDomain('neurogig-muted')

// * * * onboarding -------------------------------------------------------------------------------]

const onboardingConfig: ConfigLogger = {
	colors: {
		$currentStep: 'fx',
		$role: 'data',
		$selectedSkills: 'data',
		$profileData: 'data',
		$credentials: 'data',
		setRole: 'event',
		registerUserFx: 'red',
	},
	filter: {
		gate: false,
		resetError: false,
		resetCurrentStep: false,
		resetRole: false,
		resetCredentials: false,
		resetProfileData: false,
		resetSelectedSkills: false,
		resetAllSkills: false,
		updateProfileField: false,
		updateCredentialField: false,
		updateSkillLevel: false,
	},
	fn: {
		$selectedSkills: (skills: AnyType) => namedItems('skill')(skills),
		$profileData: (profile: AnyType) => (profile ? profile.name : 'unset'),
		$credentials: (credentials: AnyType) => (credentials ? credentials.email : 'unset'),
	},
}

export const onboardingDomain = createDomainWatched(
	'onboarding',
	onboardingConfig,
	debugStores.onboarding,
)

// * * * auth -------------------------------------------------------------------------------------]

export const authDomain = createDomainWatched('auth', {}, debugStores.auth)

// * * * viewer -----------------------------------------------------------------------------------]

const viewerConfig: ConfigLogger = {
	colors: {
		$currentIndex: 'green',
		$targetIndex: 'data',
		$phase: 'query',
		navigated: 'red',
		fadeCompleted: 'blue',
		fadeOutDone: 'orange',
		fadeInDone: 'green',
		preloadImageFx_root: 'blue',
		preloadImageFx_done: 'green',
	},
	filter: {
		gate: false,
		gate_root: true,
		opened: false,
		closed: false,
	},
	fn: {
		$currentIndex: (index: number | null) => (index !== null ? String(index) : 'closed'),
		$targetIndex: (index: number | null) => (index !== null ? String(index) : 'closed'),
		$phase: (phase: { _: string }) => phase._,
		navigated: (payload: {
			direction: 'left' | 'right'
			nextIndex: number
			nextKind: string
		}) => `${payload.direction} {->} ${payload.nextIndex}:${payload.nextKind}`,
	},
}

export const viewerDomain = createDomainWatched('viewer', viewerConfig, debugStores.viewer)
