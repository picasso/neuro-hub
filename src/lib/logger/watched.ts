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
	onboarding: false,
	auth: false,
	viewer: false,
	authHeader: true,
	accountContext: false,
	accountSidebar: false,
	createProject: false,
	profile: false,
	freelancerPortfolio: false,
	projectApplications: false,
	alerts: false,
	modals: false,
	chat: false,
	freelancerProfile: false,
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

export const alertsDomain = createDomainWatched('alerts', {}, debugStores.alerts)

export const modalsDomain = createDomainWatched(
	'modals',
	{ filter: { gate: false } },
	debugStores.modals,
)

const chatConfig: ConfigLogger = {
	filter: {
		gate: false,
	},
}

export const chatDomain = createDomainWatched('chat', chatConfig, debugStores.chat)

export const freelancerProfileDomain = createDomainWatched(
	'freelancer-profile',
	{ filter: { gate: false } },
	debugStores.freelancerProfile,
)

export const profileDomain = createDomainWatched(
	'profile',
	{ filter: { gate: false } },
	debugStores.profile,
)

export const authHeaderDomain = createDomainWatched(
	'auth-header',
	{ filter: { gate: false } },
	debugStores.authHeader,
)

// * * * account ----------------------------------------------------------------------------------]

export const accountContextDomain = createDomainWatched(
	'account-context',
	{ filter: { gate: false } },
	debugStores.accountContext,
)

export const accountSidebarDomain = createDomainWatched(
	'account-sidebar',
	{ filter: { gate: false } },
	debugStores.accountSidebar,
)

export const createProjectDomain = createDomainWatched(
	'create-project',
	{ filter: { gate: false } },
	debugStores.createProject,
)

export const freelancerPortfolioDomain = createDomainWatched(
	'freelancer-portfolio',
	{ filter: { gate: false } },
	debugStores.freelancerPortfolio,
)

export const projectApplicationsDomain = createDomainWatched(
	'project-applications',
	{ filter: { gate: false } },
	debugStores.projectApplications,
)

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
