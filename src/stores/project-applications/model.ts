import { sample } from 'effector'
import { createGate } from 'effector-react'
import { isEmpty } from 'lodash'
import { createAlertFx } from '@/alerts'
import { requestJson } from '@/lib/api-client'
import { projectApplicationsDomain as domain } from '@/lib/logger'
import { applicationSubmitted, applicationWithdrawn } from '@/stores'
import {
	buildUserFacingApiErrorMessageFromParsed,
	parseClientApiError,
	pickFieldErrorsFromApiErrors,
	PROJECT_APPLICATION_VALIDATION_FIELD_LABELS,
} from '@/utils'

export type ProjectApplicationForm = {
	coverLetter: string
	proposedPrice: string
	proposedDeadline: string
}

const APPLICATION_FORM_FIELD_KEYS = ['coverLetter', 'proposedPrice', 'proposedDeadline'] as const

type ProjectApplicationFormField = (typeof APPLICATION_FORM_FIELD_KEYS)[number]

type ProjectApplicationRequestFailure = Error & {
	fieldErrors?: Partial<Record<ProjectApplicationFormField, string>>
}

function projectApplicationRequestFailure(
	message: string,
	fieldErrors?: Partial<Record<ProjectApplicationFormField, string>>,
): ProjectApplicationRequestFailure {
	return Object.assign(new Error(message), { fieldErrors })
}

type SubmitProjectApplicationParams = {
	projectId: string
	form: ProjectApplicationForm
}

type WithdrawProjectApplicationParams = {
	applicationId: string
}

type PendingWithdrawMap = Record<string, boolean>

export const ProjectApplicationFormGate = createGate<{ projectId: string }>({
	domain,
	name: 'ProjectApplicationFormGate',
})

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

export const $applicationErrors = domain.createStore<
	Partial<Record<ProjectApplicationFormField, string>>
>({}, { name: '$projectApplicationErrors' })

$form.reset(resetProjectApplicationForm)
$form.on(projectApplicationFormUpdated, (form, update) =>
	isEmpty(update) ? form : { ...form, ...update },
)

// clear form when user switches project tab/scope
sample({
	clock: projectApplicationFormScopeChanged,
	target: resetProjectApplicationForm,
})

// set scope event from gate open payload
sample({
	clock: ProjectApplicationFormGate.open,
	fn: ({ projectId }) => projectId,
	target: projectApplicationFormScopeChanged,
})

// discard draft when leaving application form gate
sample({
	clock: ProjectApplicationFormGate.close,
	target: resetProjectApplicationForm,
})

export const submitProjectApplicationFx = domain.createEffect<
	SubmitProjectApplicationParams,
	{ id: string; status: string },
	ProjectApplicationRequestFailure
>({
	handler: async ({ projectId, form }) => {
		const proposedPrice = Number(form.proposedPrice.trim())
		if (!Number.isFinite(proposedPrice) || proposedPrice <= 0) {
			throw projectApplicationRequestFailure('Укажите корректный бюджет заявки', {
				proposedPrice: 'Введите сумму больше 0',
			})
		}

		try {
			return await requestJson<{ id: string; status: string }>(
				`/api/projects/${encodeURIComponent(projectId)}/applications`,
				{
					method: 'POST',
					json: {
						coverLetter: form.coverLetter.trim(),
						proposedPrice: Math.trunc(proposedPrice),
						proposedDeadline: form.proposedDeadline.trim(),
					},
					normalizeJson: { omitEmptyStrings: true },
					fallbackMessage: 'Не удалось подать заявку',
				},
			)
		} catch (error) {
			const parsed = parseClientApiError(error)
			const message = buildUserFacingApiErrorMessageFromParsed(parsed, {
				fallback: 'Не удалось подать заявку',
				fieldLabels: PROJECT_APPLICATION_VALIDATION_FIELD_LABELS,
			})
			const fieldErrors = pickFieldErrorsFromApiErrors(
				parsed?.errors,
				APPLICATION_FORM_FIELD_KEYS,
			) as Partial<Record<ProjectApplicationFormField, string>> | undefined
			throw projectApplicationRequestFailure(message, fieldErrors)
		}
	},
	name: 'submitProjectApplicationFx',
})

export const withdrawProjectApplicationFx = domain.createEffect<
	WithdrawProjectApplicationParams,
	{ id: string; status: string },
	ProjectApplicationRequestFailure
>({
	handler: async ({ applicationId }) => {
		try {
			return await requestJson<{ id: string; status: string }>(
				`/api/applications/${encodeURIComponent(applicationId)}`,
				{
					method: 'DELETE',
					fallbackMessage: 'Не удалось отозвать заявку',
				},
			)
		} catch (error) {
			const parsed = parseClientApiError(error)
			const message = buildUserFacingApiErrorMessageFromParsed(parsed, {
				fallback: 'Не удалось отозвать заявку',
				fieldLabels: PROJECT_APPLICATION_VALIDATION_FIELD_LABELS,
			})
			const fieldErrors = pickFieldErrorsFromApiErrors(
				parsed?.errors,
				APPLICATION_FORM_FIELD_KEYS,
			) as Partial<Record<ProjectApplicationFormField, string>> | undefined
			throw projectApplicationRequestFailure(message, fieldErrors)
		}
	},
	name: 'withdrawProjectApplicationFx',
})

$applicationErrors.reset(resetProjectApplicationForm)

$applicationErrors
	.on(submitProjectApplicationFx, () => ({}))
	.on(projectApplicationFormUpdated, (errors, patch) => {
		const next = { ...errors }
		for (const key of APPLICATION_FORM_FIELD_KEYS) {
			if (key in patch) delete next[key]
		}
		return next
	})
	.on(submitProjectApplicationFx.failData, (_, error) => {
		const requestError = error as ProjectApplicationRequestFailure
		return requestError.fieldErrors ?? {}
	})
	.on(submitProjectApplicationFx.done, () => ({}))

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

// show blocking toast while submit effect runs
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

// show blocking toast while withdraw effect runs
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

// dismiss submit progress toast when effect settles
sample({
	clock: submitProjectApplicationFx.finally,
	fn: () => ({ id: submitAlertId }),
	target: createAlertFx.removeFx,
})

// dismiss withdraw progress toast when effect settles
sample({
	clock: withdrawProjectApplicationFx.finally,
	fn: () => ({ id: withdrawAlertId }),
	target: createAlertFx.removeFx,
})

// toast successful application submit
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

// bump account applications count after submit succeeds
sample({
	clock: submitProjectApplicationFx.doneData,
	target: applicationSubmitted,
})

// toast successful withdrawal
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

// decrement account applications count after withdraw succeeds
sample({
	clock: withdrawProjectApplicationFx.doneData,
	target: applicationWithdrawn,
})

// toast submit or withdraw API failure
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

// reset form fields after successful submit
sample({
	clock: submitProjectApplicationFx.done,
	target: resetProjectApplicationForm,
})
