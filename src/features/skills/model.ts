'use client'

import { combine, sample } from 'effector'
import { createGate } from 'effector-react'
import { produce } from 'immer'
import { find, findIndex, isEmpty } from 'lodash'
import type { AccountSkillsLoadDTO, FreelancerSkills, SkillItem } from './types'
import type { UserSkillInput } from '@/lib/validations'
import { createAlertFx } from '@/alerts'
import { freelancerProfileDomain as domain } from '@/lib/logger'

// * * * gate -------------------------------------------------------------------------------------]

export const FreelancerSkillsGate = createGate({ domain, name: 'FreelancerSkillsGate' })
export const SkillsPickerGate = createGate({ domain, name: 'SkillsPickerGate' })
export const resetSkills = domain.createEvent('resetSkills')
export const resetSelectedSkills = domain.createEvent('resetSelectedSkills')
export const skillsCatalogLoaded = domain.createEvent<SkillItem[]>('skillsCatalogLoaded')
export const selectedSkillsLoaded = domain.createEvent<UserSkillInput[]>('selectedSkillsLoaded')

// * * * $form ------------------------------------------------------------------------------------]

export const skillsUpdated = domain.createEvent<Partial<FreelancerSkills>>('skillsUpdated')
export const skillAdded = domain.createEvent<UserSkillInput>('skillAdded')
export const skillRemoved = domain.createEvent<string>('skillRemoved')
export const skillLevelUpdated = domain.createEvent<{
	skillId: string
	level: UserSkillInput['proficiencyLevel']
}>('skillLevelUpdated')
export const $skills = domain.createStore<FreelancerSkills>(
	{
		nickname: '',
		specialization: '',
		hourlyRate: '',
		availability: '',
		experience: '',
	},
	{ name: '$skills' },
)

$skills.reset(resetSkills)
$skills.on(skillsUpdated, (store, update) => (isEmpty(update) ? store : { ...store, ...update }))

export const $allSkills = domain.createStore<SkillItem[]>([], { name: '$allSkills' })
export const $selectedSkills = domain.createStore<UserSkillInput[]>([], { name: '$selectedSkills' })

$allSkills.on(skillsCatalogLoaded, (_, skills) => skills)
$selectedSkills.reset(resetSelectedSkills)
$selectedSkills.on(selectedSkillsLoaded, (_, skills) => skills)

$selectedSkills.on(skillAdded, (skills, skill) =>
	produce(skills, (draft) => {
		const exists = find(draft, { skillId: skill.skillId })
		if (!exists) {
			draft.push(skill)
		}
	}),
)

$selectedSkills.on(skillRemoved, (skills, skillId) =>
	produce(skills, (draft) => {
		const index = findIndex(draft, { skillId })
		if (index !== -1) {
			draft.splice(index, 1)
		}
	}),
)

$selectedSkills.on(skillLevelUpdated, (skills, { skillId, level }) =>
	produce(skills, (draft) => {
		const skill = find(draft, { skillId })
		if (skill) {
			skill.proficiencyLevel = level
		}
	}),
)

// * * * effects ----------------------------------------------------------------------------------]

export const loadSkillCatalogFx = domain.createEffect<void, SkillItem[], Error>({
	handler: async () => {
		return fetchJson<SkillItem[]>('/api/skills?pageSize=100', {
			fallbackMessage: 'Failed to load skills catalog',
		})
	},
	name: 'loadSkillCatalogFx',
})

export const loadAccountSkillsFx = domain.createEffect<void, AccountSkillsLoadDTO, Error>({
	handler: async () => {
		return fetchJson<AccountSkillsLoadDTO>('/api/freelancers/me', {
			fallbackMessage: 'Failed to load freelancer profile',
		})
	},
	name: 'loadAccountSkillsFx',
})

export const saveSkillsFx = domain.createEffect<
	{ profile: FreelancerSkills; selectedSkills: UserSkillInput[] },
	unknown,
	Error
>({
	handler: async ({ profile, selectedSkills }) => {
		const { nickname, specialization, hourlyRate, availability, experience } = profile
		const rate = hourlyRate.trim()
		const parsedHourly = rate ? Number(rate) : undefined
		if (parsedHourly !== undefined && (!Number.isFinite(parsedHourly) || parsedHourly <= 0)) {
			throw new Error('Hourly rate must be a positive number')
		}

		await fetchJson(`/api/freelancers/${encodeURIComponent(nickname)}`, {
			method: 'PUT',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({
				specialization: specialization.trim() || undefined,
				hourlyRate: parsedHourly !== undefined ? Math.trunc(parsedHourly) : undefined,
				availability: availability.trim() || undefined,
				experience: experience.trim() || undefined,
				skills: selectedSkills,
			}),
			fallbackMessage: 'Failed to save freelancer profile',
		})
	},
	name: 'saveSkillsFx',
})

// * * * computed stores --------------------------------------------------------------------------]

export const $isSkillsCatalogLoading = loadSkillCatalogFx.pending
export const $isLoading = combine(
	loadAccountSkillsFx.pending,
	$isSkillsCatalogLoading,
	(isLoadingAccount, isLoadingCatalog) => isLoadingAccount || isLoadingCatalog,
)
export const $isSaving = saveSkillsFx.pending
export const $isBusy = combine($isLoading, $isSaving, (loading, saving) => loading || saving)

// * * * events -----------------------------------------------------------------------------------]

export const skillsSaved = domain.createEvent('skillsSaved')

// * * * connections and consequences -------------------------------------------------------------]

// discard profile draft when leaving the editor gate
sample({
	clock: FreelancerSkillsGate.close,
	target: [resetSkills, resetSelectedSkills],
})

// load the shared skills catalog once when picker mounts
sample({
	clock: SkillsPickerGate.open,
	source: {
		allSkills: $allSkills,
		isLoading: $isSkillsCatalogLoading,
	},
	filter: ({ allSkills, isLoading }) => allSkills.length === 0 && !isLoading,
	target: loadSkillCatalogFx,
})

// fetch account profile and current user skills when account editor mounts
sample({
	clock: FreelancerSkillsGate.open,
	target: loadAccountSkillsFx,
})

// hydrate shared catalog after successful load
sample({
	clock: loadSkillCatalogFx.doneData,
	target: skillsCatalogLoaded,
})

// hydrate form fields from loaded DTO
sample({
	clock: loadAccountSkillsFx.doneData,
	fn: (profile): FreelancerSkills => ({
		nickname: profile.nickname,
		specialization: profile.specialization ?? '',
		hourlyRate: profile.hourlyRate != null ? String(profile.hourlyRate) : '',
		availability: profile.availability ?? '',
		experience: profile.experience ?? '',
	}),
	target: $skills,
})

// hydrate selected skills from account data
sample({
	clock: loadAccountSkillsFx.doneData,
	fn: ({ selectedSkills }) => selectedSkills,
	target: selectedSkillsLoaded,
})

// PUT profile when save clicked with known id
sample({
	clock: skillsSaved,
	source: {
		profile: $skills,
		selectedSkills: $selectedSkills,
	},
	filter: ({ profile }) => !!profile.nickname,
	fn: ({ profile, selectedSkills }) => ({ profile, selectedSkills }),
	target: saveSkillsFx,
})

const profileAlertId = createAlertFx.alertId('freelancer-profile')

// show save progress toast when profile save starts
sample({
	clock: saveSkillsFx,
	fn: () =>
		createAlertFx.props({
			id: profileAlertId,
			severity: 'progress',
			title: 'Сохраняем профиль...',
			message: 'Обновляем данные фрилансера и навыки',
			disableClose: true,
			disableAutoClose: true,
		}),
	target: createAlertFx,
})

// dismiss save progress toast when save effect settles
sample({
	clock: saveSkillsFx.finally,
	fn: () => ({ id: profileAlertId }),
	target: createAlertFx.removeFx,
})

// toast successful save after profile and skills persist
sample({
	clock: saveSkillsFx.done,
	fn: () =>
		createAlertFx.props({
			severity: 'success',
			title: 'Профиль обновлён',
			message: 'Данные и навыки сохранены',
		}),
	target: createAlertFx,
})

// toast load or save failure
sample({
	clock: [loadSkillCatalogFx.failData, loadAccountSkillsFx.failData, saveSkillsFx.failData],
	fn: (error) =>
		createAlertFx.props({
			severity: 'error',
			title: 'Ошибка профиля',
			message: error.message ?? 'Не удалось обновить профиль',
			disableAutoClose: true,
		}),
	target: createAlertFx,
})
function fetchJson<T>(
	input: RequestInfo | URL,
	init?: RequestInit & { fallbackMessage?: string },
): Promise<T> {
	const { fallbackMessage = 'Request failed', ...requestInit } = init ?? {}
	return fetch(input, requestInit).then(async (response) => {
		if (!response.ok) {
			const json = await response.json().catch(() => null)
			throw new Error(json?.error?.message || json?.error || fallbackMessage)
		}

		const json = await response.json().catch(() => null)
		if (!json?.success) {
			throw new Error(json?.error?.message || json?.error || fallbackMessage)
		}

		return json.data as T
	})
}
