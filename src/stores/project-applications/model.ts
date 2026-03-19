import { sample } from 'effector'
import { produce } from 'immer'
import { forEach, isEmpty, set } from 'lodash'
import { createAlertFx } from '@/alerts'
import { genericDomain as domain } from '@/lib/logger'

export type ProjectApplicationForm = {
	coverLetter: string
	proposedPrice: string
	proposedDeadline: string
}

type SubmitProjectApplicationParams = {
	projectId: string
	form: ProjectApplicationForm
}

type WithdrawProjectApplicationParams = {
	applicationId: string
}

type PendingWithdrawMap = Record<string, boolean>

export const projectApplicationFormScopeChanged = domain.createEvent<string>(
	'projectApplicationFormScopeChanged',
)
export const resetProjectApplicationForm = domain.createEvent('resetProjectApplicationForm')
export const projectApplicationFormUpdated = domain.createEvent<Partial<ProjectApplicationForm>>(
	'projectApplicationFormUpdated',
)

export const $form = domain.createStore<ProjectApplicationForm>(
	{
		coverLetter: '',
		proposedPrice: '',
		proposedDeadline: '',
	},
	{ name: '$projectApplicationForm' },
)

$form.reset(resetProjectApplicationForm)
$form.on(projectApplicationFormUpdated, (store, update) =>
	isEmpty(update)
		? store
		: produce(store, (draft) => {
				forEach(update, (value, key) => {
					set(draft, key, value)
				})
			}),
)

sample({
	clock: projectApplicationFormScopeChanged,
	target: resetProjectApplicationForm,
})

export const submitProjectApplicationFx = domain.createEffect<
	SubmitProjectApplicationParams,
	{ id: string; status: string },
	Error
>({
	handler: async ({ projectId, form }) => {
		const proposedPrice = Number(form.proposedPrice.trim())
		if (!Number.isFinite(proposedPrice) || proposedPrice <= 0) {
			throw new Error('Укажите корректный бюджет заявки')
		}

		const res = await fetch(`/api/projects/${encodeURIComponent(projectId)}/applications`, {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({
				coverLetter: form.coverLetter.trim(),
				proposedPrice: Math.trunc(proposedPrice),
				proposedDeadline: form.proposedDeadline || undefined,
			}),
		})

		if (!res.ok) {
			const json = await res.json().catch(() => null)
			throw new Error(json?.error?.message || json?.error || 'Не удалось подать заявку')
		}

		const json = await res.json()
		return {
			id: json.data.id as string,
			status: json.data.status as string,
		}
	},
	name: 'submitProjectApplicationFx',
})

export const withdrawProjectApplicationFx = domain.createEffect<
	WithdrawProjectApplicationParams,
	{ id: string; status: string },
	Error
>({
	handler: async ({ applicationId }) => {
		const res = await fetch(`/api/applications/${encodeURIComponent(applicationId)}`, {
			method: 'DELETE',
		})

		if (!res.ok) {
			const json = await res.json().catch(() => null)
			throw new Error(json?.error?.message || json?.error || 'Не удалось отозвать заявку')
		}

		const json = await res.json()
		return {
			id: json.data.id as string,
			status: json.data.status as string,
		}
	},
	name: 'withdrawProjectApplicationFx',
})

export const $pendingWithdrawByApplicationId = domain.createStore<PendingWithdrawMap>(
	{},
	{ name: '$pendingWithdrawByApplicationId' },
)

$pendingWithdrawByApplicationId
	.on(withdrawProjectApplicationFx, (store, { applicationId }) => ({
		...store,
		[applicationId]: true,
	}))
	.on(withdrawProjectApplicationFx.finally, (store, { params }) => {
		if (!store[params.applicationId]) {
			return store
		}

		const nextStore = { ...store }
		delete nextStore[params.applicationId]
		return nextStore
	})

const submitAlertId = createAlertFx.alertId('project-application-submit')
const withdrawAlertId = createAlertFx.alertId('project-application-withdraw')

sample({
	clock: submitProjectApplicationFx,
	fn: () =>
		createAlertFx.props({
			id: submitAlertId,
			severity: 'progress',
			title: 'Отправляем заявку...',
			message: 'Проверяем данные и сохраняем вашу заявку',
			disableClose: true,
			disableAutoClose: true,
		}),
	target: createAlertFx,
})

sample({
	clock: withdrawProjectApplicationFx,
	fn: () =>
		createAlertFx.props({
			id: withdrawAlertId,
			severity: 'progress',
			title: 'Отзываем заявку...',
			message: 'Обновляем статус заявки',
			disableClose: true,
			disableAutoClose: true,
		}),
	target: createAlertFx,
})

sample({
	clock: submitProjectApplicationFx.finally,
	fn: () => ({ id: submitAlertId }),
	target: createAlertFx.removeFx,
})

sample({
	clock: withdrawProjectApplicationFx.finally,
	fn: () => ({ id: withdrawAlertId }),
	target: createAlertFx.removeFx,
})

sample({
	clock: submitProjectApplicationFx.done,
	fn: () =>
		createAlertFx.props({
			severity: 'success',
			title: 'Заявка подана',
			message: 'Ваша заявка сохранена в истории',
		}),
	target: createAlertFx,
})

sample({
	clock: withdrawProjectApplicationFx.done,
	fn: () =>
		createAlertFx.props({
			severity: 'success',
			title: 'Заявка отозвана',
			message: 'Статус заявки обновлён',
		}),
	target: createAlertFx,
})

sample({
	clock: [submitProjectApplicationFx.failData, withdrawProjectApplicationFx.failData],
	fn: (error) =>
		createAlertFx.props({
			severity: 'error',
			title: 'Ошибка заявки',
			message: error.message ?? 'Не удалось выполнить действие с заявкой',
			disableAutoClose: true,
		}),
	target: createAlertFx,
})

sample({
	clock: submitProjectApplicationFx.done,
	target: resetProjectApplicationForm,
})
