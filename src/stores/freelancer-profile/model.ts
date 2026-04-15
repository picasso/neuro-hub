'use client'

import { combine, sample } from 'effector'
import { createGate } from 'effector-react'
import { isEmpty } from 'lodash'
import type { FreelancerProfileDto, FreelancerProfileForm } from './types'
import { createAlertFx } from '@/alerts'
import { freelancerProfileDomain as domain } from '@/lib/logger'

// * * * Gate -------------------------------------------------------------------------------------]

export const FreelancerProfileGate = createGate({
	domain,
	name: 'FreelancerProfileGate',
})

export const resetFreelancerProfile = domain.createEvent('resetFreelancerProfile')

// * * * $form ------------------------------------------------------------------------------------]

export const profileFormUpdated =
	domain.createEvent<Partial<FreelancerProfileForm>>('profileFormUpdated')

export const $form = domain.createStore<FreelancerProfileForm>(
	{
		specialization: '',
		hourlyRate: '',
		availability: '',
		experience: '',
	},
	{ name: '$form' },
)

$form.reset(resetFreelancerProfile)
$form.on(profileFormUpdated, (store, update) => (isEmpty(update) ? store : { ...store, ...update }))

// * * * $freelancerNickname ----------------------------------------------------------------------]

export const $freelancerNickname = domain.createStore<string | null>(null, {
	name: '$freelancerNickname',
})

$freelancerNickname.reset(resetFreelancerProfile)

// * * * effects ----------------------------------------------------------------------------------]

export const loadFreelancerProfileFx = domain.createEffect<void, FreelancerProfileDto, Error>({
	handler: async () => {
		const res = await fetch('/api/freelancers/me')
		if (!res.ok) {
			const json = await res.json().catch(() => null)
			throw new Error(
				json?.error?.message || json?.error || 'Failed to load freelancer profile',
			)
		}
		const json = await res.json()
		return json.data as FreelancerProfileDto
	},
	name: 'loadFreelancerProfileFx',
})

export const saveFreelancerProfileFx = domain.createEffect<
	{ nickname: string; form: FreelancerProfileForm },
	unknown,
	Error
>({
	handler: async ({ nickname, form }) => {
		const hourlyRate = form.hourlyRate.trim()
		const parsedHourly = hourlyRate ? Number(hourlyRate) : undefined
		if (parsedHourly !== undefined && (!Number.isFinite(parsedHourly) || parsedHourly <= 0)) {
			throw new Error('Hourly rate must be a positive number')
		}

		const res = await fetch(`/api/freelancers/${encodeURIComponent(nickname)}`, {
			method: 'PUT',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({
				specialization: form.specialization.trim() || undefined,
				hourlyRate: parsedHourly !== undefined ? Math.trunc(parsedHourly) : undefined,
				availability: form.availability.trim() || undefined,
				experience: form.experience.trim() || undefined,
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
	name: 'saveFreelancerProfileFx',
})

// * * * computed stores --------------------------------------------------------------------------]

export const $isLoading = loadFreelancerProfileFx.pending
export const $isSaving = saveFreelancerProfileFx.pending
export const $isBusy = combine($isLoading, $isSaving, (loading, saving) => loading || saving)

// * * * events -----------------------------------------------------------------------------------]

export const saveFreelancerProfileClicked = domain.createEvent('saveFreelancerProfileClicked')

// * * * connections and consequences -------------------------------------------------------------]

// discard profile draft when leaving the editor gate
sample({
	clock: FreelancerProfileGate.close,
	target: resetFreelancerProfile,
})

// fetch profile when gate mounts
sample({
	clock: FreelancerProfileGate.open,
	target: loadFreelancerProfileFx,
})

// store server id after load succeeds
sample({
	clock: loadFreelancerProfileFx.doneData,
	fn: (dto) => dto.nickname,
	target: $freelancerNickname,
})

// hydrate form fields from loaded DTO
sample({
	clock: loadFreelancerProfileFx.doneData,
	fn: (dto): FreelancerProfileForm => ({
		specialization: dto.specialization ?? '',
		hourlyRate: dto.hourlyRate != null ? String(dto.hourlyRate) : '',
		availability: dto.availability ?? '',
		experience: dto.experience ?? '',
	}),
	target: $form,
})

// PUT profile when save clicked with known id
sample({
	clock: saveFreelancerProfileClicked,
	source: {
		nickname: $freelancerNickname,
		form: $form,
	},
	filter: ({ nickname }) => !!nickname,
	fn: ({ nickname, form }) => ({ nickname: nickname!, form }),
	target: saveFreelancerProfileFx,
})

const profileAlertId = createAlertFx.alertId('freelancer-profile')

// show save progress toast
sample({
	clock: saveFreelancerProfileFx,
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
	clock: saveFreelancerProfileFx.finally,
	fn: () => ({ id: profileAlertId }),
	target: createAlertFx.removeFx,
})

// toast successful save
sample({
	clock: saveFreelancerProfileFx.done,
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
	clock: [loadFreelancerProfileFx.failData, saveFreelancerProfileFx.failData],
	fn: (error) =>
		createAlertFx.props({
			severity: 'error',
			title: 'Ошибка профиля',
			message: error.message ?? 'Не удалось обновить профиль',
			disableAutoClose: true,
		}),
	target: createAlertFx,
})
