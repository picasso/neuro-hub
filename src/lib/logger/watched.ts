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
		$targetIndex: 'data',
		$ready: 'green',
		$fade: 'query',
		$fadeOpacity: 'query',
		$loaders: 'data',
		$preloading: 'red',
		completedFade: 'orange',
		fadeInDelayed: 'fx',
		resetTransition: 'red',
	},
	filter: {
		gate: false,
		gate_root: true,
		setTargetIndex: false,
		startedLoader: false,
		preloaded: false,
		startedFadeOut: false,
		startedFadeIn: false,
		resetFade: false,
		resetLoaders: false,
		resetPreloading: false,
		resetFadeOpacity: false,
		resetTargetIndex: false,
	},
	fn: {
		$targetIndex: (index: number) => String(index),
		$ready: (ready: boolean) => (ready ? 'ready' : 'not ready'),
		$fade: (fade: { in: boolean; out: boolean }) =>
			fade.in ? 'fading in' : fade.out ? 'fading out' : 'off',
		$fadeOpacity: (opacity: number) => `opacity:${opacity}`,
		$loaders: (loaders: { right: boolean; left: boolean }) =>
			loaders.right ? 'next loader' : loaders.left ? 'prev loader' : 'off',
		$preloading: (preloading: boolean) => (preloading ? 'loading...' : 'completed'),
	},
}

export const viewerDomain = createDomainWatched('viewer', viewerConfig, debugStores.viewer)
