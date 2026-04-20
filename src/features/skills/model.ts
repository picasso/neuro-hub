'use client'

import { combine, sample } from 'effector'
import { createGate } from 'effector-react'
import { isEmpty } from 'lodash'
import type { FreelancerSkillsDto, FreelancerSkills } from './types'
import { createAlertFx } from '@/alerts'
import { freelancerProfileDomain as domain } from '@/lib/logger'

// * * * gate -------------------------------------------------------------------------------------]

export const FreelancerSkillsGate = createGate({ domain, name: 'FreelancerSkillsGate' })
export const resetSkills = domain.createEvent('resetSkills')

// * * * $form ------------------------------------------------------------------------------------]

export const skillsUpdated = domain.createEvent<Partial<FreelancerSkills>>('skillsUpdated')
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

// * * * effects ----------------------------------------------------------------------------------]

export const loadSkillsFx = domain.createEffect<void, FreelancerSkillsDto, Error>({
	handler: async () => {
		const res = await fetch('/api/freelancers/me')
		if (!res.ok) {
			const json = await res.json().catch(() => null)
			throw new Error(
				json?.error?.message || json?.error || 'Failed to load freelancer profile',
			)
		}
		const json = await res.json()
		return json.data as FreelancerSkillsDto
	},
	name: 'loadSkillsFx',
})

export const saveSkillsFx = domain.createEffect<FreelancerSkills, unknown, Error>({
	handler: async ({ nickname, specialization, hourlyRate, availability, experience }) => {
		const rate = hourlyRate.trim()
		const parsedHourly = rate ? Number(rate) : undefined
		if (parsedHourly !== undefined && (!Number.isFinite(parsedHourly) || parsedHourly <= 0)) {
			throw new Error('Hourly rate must be a positive number')
		}

		const res = await fetch(`/api/freelancers/${encodeURIComponent(nickname)}`, {
			method: 'PUT',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({
				specialization: specialization.trim() || undefined,
				hourlyRate: parsedHourly !== undefined ? Math.trunc(parsedHourly) : undefined,
				availability: availability.trim() || undefined,
				experience: experience.trim() || undefined,
			}),
		})

		if (!res.ok) {
			const json = await res.json().catch(() => null)
			throw new Error(
				json?.error?.message || json?.error || 'Failed to save freelancer profile',
			)
		}

		return await res.json()
	},
	name: 'saveSkillsFx',
})

// * * * computed stores --------------------------------------------------------------------------]

export const $isLoading = loadSkillsFx.pending
export const $isSaving = saveSkillsFx.pending
export const $isBusy = combine($isLoading, $isSaving, (loading, saving) => loading || saving)

// * * * events -----------------------------------------------------------------------------------]

export const skillsSaved = domain.createEvent('skillsSaved')

// * * * connections and consequences -------------------------------------------------------------]

// discard profile draft when leaving the editor gate
sample({
	clock: FreelancerSkillsGate.close,
	target: resetSkills,
})

// fetch profile when gate mounts
sample({
	clock: FreelancerSkillsGate.open,
	target: loadSkillsFx,
})

// store server id after load succeeds
// sample({
// 	clock: loadSkillsFx.doneData,
// 	fn: (dto) => dto.nickname,
// 	target: $freelancerNickname,
// })

// hydrate form fields from loaded DTO
sample({
	clock: loadSkillsFx.doneData,
	fn: ({ nickname, specialization, hourlyRate, availability, experience }): FreelancerSkills => ({
		nickname,
		specialization: specialization ?? '',
		hourlyRate: hourlyRate != null ? String(hourlyRate) : '',
		availability: availability ?? '',
		experience: experience ?? '',
	}),
	target: $skills,
})

// PUT profile when save clicked with known id
sample({
	clock: skillsSaved,
	source: $skills,
	filter: ({ nickname }) => !!nickname,
	fn: (skills) => skills,
	target: saveSkillsFx,
})

const profileAlertId = createAlertFx.alertId('freelancer-profile')

// show save progress toast
sample({
	clock: saveSkillsFx,
	fn: () =>
		createAlertFx.props({
			id: profileAlertId,
			severity: 'progress',
			title: 'Сохраняем профиль...',
			message: 'Обновляем данные фрилансера',
			disableClose: true,
			disableAutoClose: true,
		}),
	target: createAlertFx,
})

// dismiss save progress toast when effect settles
sample({
	clock: saveSkillsFx.finally,
	fn: () => ({ id: profileAlertId }),
	target: createAlertFx.removeFx,
})

// toast successful save
sample({
	clock: saveSkillsFx.done,
	fn: () =>
		createAlertFx.props({
			severity: 'success',
			title: 'Профиль обновлён',
			message: 'Данные сохранены',
		}),
	target: createAlertFx,
})

// toast load or save failure
sample({
	clock: [loadSkillsFx.failData, saveSkillsFx.failData],
	fn: (error) =>
		createAlertFx.props({
			severity: 'error',
			title: 'Ошибка профиля',
			message: error.message ?? 'Не удалось обновить профиль',
			disableAutoClose: true,
		}),
	target: createAlertFx,
})
