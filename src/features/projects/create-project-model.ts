import { combine, sample } from 'effector'
import { createGate } from 'effector-react'
import type {
	CreateProjectInput,
	FreelancerDirectoryCategory,
	ProjectBudgetType,
	ProjectExperienceLevel,
} from '@/lib/validations'
import { createAlertFx } from '@/alerts'
import { createProjectDomain as domain } from '@/lib/logger'
import { projectCreated } from '@/stores/account-context/model'

type CreateProjectStatus = Extract<CreateProjectInput['status'], 'draft' | 'published'>

export type CreateProjectForm = {
	title: string
	description: string
	category: FreelancerDirectoryCategory
	experienceLevel: ProjectExperienceLevel
	budgetType: ProjectBudgetType
	budgetMin: string
	budgetMax: string
	deadline: string
	skillIds: string[]
	status: CreateProjectStatus
}

export type CreateProjectField = Exclude<keyof CreateProjectForm, 'skillIds'>

export type CreateProjectErrors = Partial<Record<keyof CreateProjectForm, string>>

export type SkillOption = {
	id: string
	name: string
	category: FreelancerDirectoryCategory
}

type ApiErrorPayload = {
	error?: {
		message?: string
		errors?: Record<string, string[]>
	}
}

type CreateProjectFailure = Error & {
	statusCode?: number
	fieldErrors?: CreateProjectErrors
}

const initialForm: CreateProjectForm = {
	title: '',
	description: '',
	category: 'programming',
	experienceLevel: 'middle',
	budgetType: 'fixed',
	budgetMin: '',
	budgetMax: '',
	deadline: '',
	skillIds: [],
	status: 'published',
}

const createProjectAlertId = createAlertFx.alertId('create-project')

export const CreateProjectGate = createGate({
	domain,
	name: 'CreateProjectGate',
})

export const resetCreateProjectFlow = domain.createEvent('resetCreateProjectFlow')
export const resetCreateProjectForm = domain.createEvent('resetCreateProjectForm')
export const createProjectSubmitted = domain.createEvent('createProjectSubmitted')
export const createProjectSkillsReloadRequested = domain.createEvent(
	'createProjectSkillsReloadRequested',
)
export const createProjectFormUpdated = domain.createEvent<
	Partial<Pick<CreateProjectForm, CreateProjectField>>
>('createProjectFormUpdated')
export const createProjectSkillToggled = domain.createEvent<string>('createProjectSkillToggled')

export const $form = domain.createStore<CreateProjectForm>(initialForm, {
	name: '$createProjectForm',
})
export const $skills = domain.createStore<SkillOption[]>([], { name: '$createProjectSkills' })
export const $skillsError = domain.createStore<string | null>(null, {
	name: '$createProjectSkillsError',
})
export const $errors = domain.createStore<CreateProjectErrors>({}, { name: '$createProjectErrors' })
export const $createdProjectId = domain.createStore<string | null>(null, {
	name: '$createdProjectId',
})

export const loadSkillsFx = domain.createEffect<void, SkillOption[], CreateProjectFailure>({
	handler: async () => {
		const response = await fetch('/api/skills?pageSize=100')
		if (!response.ok) {
			throw createProjectFailure('Не удалось загрузить список навыков')
		}

		const json = (await response.json()) as { data?: SkillOption[] }
		return json.data ?? []
	},
	name: 'loadSkillsFx',
})

export const submitCreateProjectFx = domain.createEffect<
	CreateProjectForm,
	{ id: string },
	CreateProjectFailure
>({
	handler: async (form) => {
		const budgetMin = Number(form.budgetMin.trim())
		if (!Number.isFinite(budgetMin) || budgetMin <= 0) {
			throw createProjectFailure('Укажите корректный минимальный бюджет', {
				budgetMin: 'Введите сумму больше 0',
			})
		}

		const budgetMax = Number(form.budgetMax.trim())
		if (!Number.isFinite(budgetMax) || budgetMax <= 0) {
			throw createProjectFailure('Укажите корректный максимальный бюджет', {
				budgetMax: 'Введите сумму больше 0',
			})
		}

		if (!form.deadline) {
			throw createProjectFailure('Укажите дедлайн проекта', {
				deadline: 'Выберите дату сдачи проекта',
			})
		}

		if (form.skillIds.length === 0) {
			throw createProjectFailure('Выберите хотя бы один навык', {
				skillIds: 'Выберите хотя бы один навык',
			})
		}

		const response = await fetch('/api/projects', {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({
				title: form.title.trim(),
				description: form.description.trim(),
				category: form.category,
				experienceLevel: form.experienceLevel,
				budgetType: form.budgetType,
				budgetMin: Math.trunc(budgetMin),
				budgetMax: Math.trunc(budgetMax),
				deadline: new Date(form.deadline),
				skillIds: form.skillIds,
				status: form.status,
				attachments: [],
			} satisfies CreateProjectInput),
		})

		if (response.status === 401 || response.status === 403) {
			throw createProjectFailure(
				'Создавать проекты могут только клиенты. Войдите в клиентский аккаунт, чтобы продолжить.',
				undefined,
				response.status,
			)
		}

		if (!response.ok) {
			const json = (await response.json().catch(() => null)) as ApiErrorPayload | null
			const fieldErrors = mapFieldErrors(json?.error?.errors)
			const message =
				json?.error?.message === 'Validation failed'
					? 'Проверьте поля формы и попробуйте снова.'
					: json?.error?.message || 'Не удалось создать проект'

			throw createProjectFailure(message, fieldErrors, response.status)
		}

		const json = (await response.json()) as { data?: { id?: string } }
		const id = json.data?.id

		if (!id) {
			throw createProjectFailure('Проект создан, но не удалось получить его идентификатор')
		}

		return { id }
	},
	name: 'submitCreateProjectFx',
})

$form.reset(resetCreateProjectFlow, resetCreateProjectForm)
$skills.reset(resetCreateProjectFlow)
$skillsError.reset(resetCreateProjectFlow)
$errors.reset(resetCreateProjectFlow, resetCreateProjectForm)
$createdProjectId.reset(resetCreateProjectFlow, resetCreateProjectForm)

$form.on(createProjectFormUpdated, (form, patch) => ({ ...form, ...patch }))
$form.on(createProjectSkillToggled, (form, skillId) => {
	const hasSkill = form.skillIds.includes(skillId)

	return {
		...form,
		skillIds: hasSkill
			? form.skillIds.filter((currentSkillId) => currentSkillId !== skillId)
			: [...form.skillIds, skillId],
	}
})

$skills.on(loadSkillsFx.doneData, (_, skills) => skills)
$skillsError
	.on(loadSkillsFx, () => null)
	.on(loadSkillsFx.done, () => null)
	.on(loadSkillsFx.failData, (_, error) => error.message)
$errors
	.on(createProjectSubmitted, () => ({}))
	.on(createProjectFormUpdated, (errors, patch) => {
		const nextErrors = { ...errors }

		for (const fieldName of Object.keys(patch) as CreateProjectField[]) {
			delete nextErrors[fieldName]
		}

		return nextErrors
	})
	.on(createProjectSkillToggled, (errors) => {
		if (!errors.skillIds) return errors

		const nextErrors = { ...errors }
		delete nextErrors.skillIds
		return nextErrors
	})
	.on(submitCreateProjectFx.failData, (_, error) => error.fieldErrors ?? {})
$createdProjectId.on(submitCreateProjectFx.doneData, (_, result) => result.id)

export const $isLoadingSkills = loadSkillsFx.pending
export const $isSubmitting = submitCreateProjectFx.pending
export const $isBusy = combine($isLoadingSkills, $isSubmitting, (isLoading, isSubmitting) => {
	return isLoading || isSubmitting
})

// fetch skill options when create-project surface opens
sample({
	clock: CreateProjectGate.open,
	target: loadSkillsFx,
})

// discard draft state when leaving create-project flow
sample({
	clock: CreateProjectGate.close,
	target: resetCreateProjectFlow,
})

// refetch skills after user-triggered retry
sample({
	clock: createProjectSkillsReloadRequested,
	target: loadSkillsFx,
})

// POST current form to create project
sample({
	clock: createProjectSubmitted,
	source: $form,
	target: submitCreateProjectFx,
})

// show blocking progress toast while create request runs
sample({
	clock: submitCreateProjectFx,
	fn: () =>
		createAlertFx.props({
			id: createProjectAlertId,
			severity: 'progress',
			title: 'Создаём проект...',
			message: 'Сохраняем проект и подготавливаем публикацию',
			disableClose: true,
			disableAutoClose: true,
		}),
	target: createAlertFx,
})

// dismiss progress toast when create effect finishes (success or fail)
sample({
	clock: submitCreateProjectFx.finally,
	fn: () => ({ id: createProjectAlertId }),
	target: createAlertFx.removeFx,
})

// toast success before navigation to the new project
sample({
	clock: submitCreateProjectFx.done,
	fn: () =>
		createAlertFx.props({
			severity: 'success',
			title: 'Проект создан',
			message: 'Переходим на страницу проекта',
		}),
	target: createAlertFx,
})

// notify account context store to increment project count
sample({
	clock: submitCreateProjectFx.doneData,
	target: projectCreated,
})

// toast skills fetch failure
sample({
	clock: loadSkillsFx.failData,
	fn: (error) =>
		createAlertFx.props({
			severity: 'error',
			title: 'Не удалось загрузить навыки',
			message: error.message ?? 'Попробуйте обновить страницу или повторить позже',
			disableAutoClose: true,
		}),
	target: createAlertFx,
})

// toast create-project API or validation failure
sample({
	clock: submitCreateProjectFx.failData,
	fn: (error) =>
		createAlertFx.props({
			severity: 'error',
			title:
				error.statusCode === 401 || error.statusCode === 403
					? 'Создание проекта недоступно'
					: 'Не удалось создать проект',
			message: error.message ?? 'Проверьте данные и попробуйте ещё раз',
			disableAutoClose: true,
		}),
	target: createAlertFx,
})

function createProjectFailure(
	message: string,
	fieldErrors?: CreateProjectErrors,
	statusCode?: number,
): CreateProjectFailure {
	return Object.assign(new Error(message), {
		fieldErrors,
		statusCode,
	})
}

function mapFieldErrors(errors?: Record<string, string[]>): CreateProjectErrors | undefined {
	if (!errors) return undefined

	const mappedErrors: CreateProjectErrors = {}

	for (const [fieldName, messages] of Object.entries(errors)) {
		const message = messages[0]
		if (!message) continue

		switch (fieldName) {
			case 'title':
			case 'description':
			case 'category':
			case 'experienceLevel':
			case 'budgetType':
			case 'budgetMin':
			case 'budgetMax':
			case 'deadline':
			case 'skillIds':
			case 'status':
				mappedErrors[fieldName] = message
				break
			default:
				break
		}
	}

	return Object.keys(mappedErrors).length > 0 ? mappedErrors : undefined
}
