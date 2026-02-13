'use client'

import { combine, sample } from 'effector'
import { createGate } from 'effector-react'
import { produce } from 'immer'
import { forEach, isEmpty, set } from 'lodash'
import type { FreelancerProfileDto, FreelancerProfileForm } from './types'
import { createAlertFx } from '@/alerts'
import { genericDomain as domain } from '@/lib/logger'

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
$form.on(profileFormUpdated, (store, update) =>
	isEmpty(update)
		? store
		: produce(store, (draft) => {
				forEach(update, (value, key) => {
					set(draft, key, value)
				})
			}),
)

// * * * $profileId -------------------------------------------------------------------------------]

export const $profileId = domain.createStore<string | null>(null, { name: '$profileId' })

$profileId.reset(resetFreelancerProfile)

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
	{ profileId: string; form: FreelancerProfileForm },
	unknown,
	Error
>({
	handler: async ({ profileId, form }) => {
		const hourlyRate = form.hourlyRate.trim()
		const parsedHourly = hourlyRate ? Number(hourlyRate) : undefined
		if (parsedHourly !== undefined && (!Number.isFinite(parsedHourly) || parsedHourly <= 0)) {
			throw new Error('Hourly rate must be a positive number')
		}

		const res = await fetch(`/api/freelancers/${encodeURIComponent(profileId)}`, {
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

export const $isBusy = combine(
	{
		loading: loadFreelancerProfileFx.pending,
		saving: saveFreelancerProfileFx.pending,
	},
	({ loading, saving }) => loading || saving,
)

// * * * events -----------------------------------------------------------------------------------]

export const saveFreelancerProfileClicked = domain.createEvent('saveFreelancerProfileClicked')

// * * * connections and consequences -------------------------------------------------------------]

// reset store when gate closes
sample({
	clock: FreelancerProfileGate.close,
	target: resetFreelancerProfile,
})

// load profile when gate opens
sample({
	clock: FreelancerProfileGate.open,
	target: loadFreelancerProfileFx,
})

// set profile id when profile loaded
sample({
	clock: loadFreelancerProfileFx.doneData,
	fn: (dto) => dto.profileId,
	target: $profileId,
})

// set form when profile loaded
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

// save profile when user clicks save button
sample({
	clock: saveFreelancerProfileClicked,
	source: {
		profileId: $profileId,
		form: $form,
	},
	filter: ({ profileId }) => !!profileId,
	fn: ({ profileId, form }) => ({ profileId: profileId!, form }),
	target: saveFreelancerProfileFx,
})

const profileAlertId = createAlertFx.alertId('freelancer-profile')

// show progress alert when save starts
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

// remove progress alert when save ends
sample({
	clock: saveFreelancerProfileFx.finally,
	fn: () => ({ id: profileAlertId }),
	target: createAlertFx.removeFx,
})

// show success alert when save succeeded
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

// show error alert when load or save failed
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
