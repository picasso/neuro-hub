'use client'

import { upload } from '@vercel/blob/client'
import { combine, sample } from 'effector'
import { createGate } from 'effector-react'
import { produce } from 'immer'
import { forEach, isEmpty, set } from 'lodash'
import type { PortfolioForm, PortfolioItem, UploadResult } from './types'
import { createAlertFx, updateAlert } from '@/alerts'
import { config } from '@/config'
import { genericDomain as domain } from '@/lib/logger'
import { fileSize } from '@/utils'

type PortfolioContext = {
	userId: string
	profileId: string
}

type UploadFeedbackMode = 'staged' | 'progress'

export const FreelancerPortfolioGate = createGate<PortfolioContext>({
	domain,
	name: 'FreelancerPortfolioGate',
})

const ALLOWED_CONTENT_TYPES = [
	'image/jpeg',
	'image/png',
	'image/webp',
	'image/gif',
	'video/mp4',
	'video/webm',
	'audio/mpeg',
	'audio/wav',
	'audio/webm',
	'application/pdf',
]

// * * * Form state -------------------------------------------------------------------------------]

export const resetForm = domain.createEvent('resetFreelancerPortfolioForm')
export const portfolioFormUpdated =
	domain.createEvent<Partial<PortfolioForm>>('portfolioFormUpdated')

export const $form = domain.createStore<PortfolioForm>(
	{
		title: '',
		description: '',
		category: '',
		toolsUsed: '',
		file: null,
		mediaWidth: null,
		mediaHeight: null,
		caption: '',
	},
	{ name: '$form' },
)

$form.reset(resetForm)
$form.on(portfolioFormUpdated, (store, update) =>
	isEmpty(update)
		? store
		: produce(store, (draft) => {
				forEach(update, (value, key) => {
					set(draft, key, value)
				})
			}),
)

// * * * $context ---------------------------------------------------------------------------------]

export const resetFreelancerPortfolio = domain.createEvent('resetFreelancerPortfolio')
export const setFreelancerPortfolioContext = domain.createEvent<PortfolioContext>(
	'setFreelancerPortfolioContext',
)

export const $context = domain.createStore<PortfolioContext | null>(null, { name: '$context' })
export const $hasContext = $context.map(Boolean)

$context.reset(resetFreelancerPortfolio)
$context.on(setFreelancerPortfolioContext, (_, ctx) => ctx)

// * * * Portfolio list ----------------------------------------------------------------------------]

export const refreshPortfolio = domain.createEvent('refreshPortfolio')
export const $portfolio = domain.createStore<PortfolioItem[]>([], { name: '$portfolio' })
export const uploadProgressChanged = domain.createEvent<number | null>('uploadProgressChanged')
export const uploadFeedbackModeChanged = domain.createEvent<UploadFeedbackMode | null>(
	'uploadFeedbackModeChanged',
)
export const $uploadProgress = domain.createStore<number | null>(null, { name: '$uploadProgress' })
export const $uploadFeedbackMode = domain.createStore<UploadFeedbackMode | null>(null, {
	name: '$uploadFeedbackMode',
})

$portfolio.reset(resetFreelancerPortfolio)
$uploadProgress
	.on(uploadProgressChanged, (_, progress) => progress)
	.reset(resetFreelancerPortfolio, resetForm)
$uploadFeedbackMode
	.on(uploadFeedbackModeChanged, (_, mode) => mode)
	.reset(resetFreelancerPortfolio, resetForm)

// * * * Effects ----------------------------------------------------------------------------------]

export const loadPortfolioFx = domain.createEffect<{ profileId: string }, PortfolioItem[], Error>({
	handler: async ({ profileId }) => {
		const res = await fetch(`/api/freelancers/${encodeURIComponent(profileId)}/portfolio`)
		if (!res.ok) {
			const json = await res.json().catch(() => null)
			throw new Error(json?.error?.message || json?.error || 'Failed to load portfolio')
		}
		const json = await res.json()
		return json.data as PortfolioItem[]
	},
	name: 'loadPortfolioFx',
})

export const uploadPortfolioMediaFx = domain.createEffect<
	{ userId: string; profileId: string; file: File },
	{ blob: UploadResult; mediaType: string | null; profileId: string },
	Error
>({
	handler: async ({ userId, profileId, file }) => {
		if (!ALLOWED_CONTENT_TYPES.includes(file.type)) {
			throw new Error('Unsupported file type')
		}
		if (file.size > config.uploadMaxSize) {
			throw new Error(`File is too large: ${fileSize(file.size, 0, true)}`)
		}

		const pathname = `portfolio/${userId}/${file.name}`
		const blob = await upload(pathname, file, {
			access: 'public',
			handleUploadUrl: '/api/blob/portfolio-upload',
			onUploadProgress: ({ percentage }) => {
				if (shouldShowUploadProgress(file.size)) {
					uploadProgressChanged(Math.round(percentage))
				}
			},
			clientPayload: JSON.stringify({
				userId,
			}),
		})

		return { blob, mediaType: file.type || null, profileId }
	},
	name: 'uploadPortfolioMediaFx',
})

export const createPortfolioItemFx = domain.createEffect<
	{
		profileId: string
		title: string
		description?: string
		mediaWidth?: number
		mediaHeight?: number
		caption?: string
		category?: string
		toolsUsed?: string[]
		mediaUrl: string
		mediaType: string | null
	},
	PortfolioItem,
	Error
>({
	handler: async ({
		profileId,
		title,
		description,
		mediaWidth,
		mediaHeight,
		caption,
		category,
		toolsUsed,
		mediaUrl,
		mediaType,
	}) => {
		const res = await fetch(`/api/freelancers/${encodeURIComponent(profileId)}/portfolio`, {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({
				title,
				description: description || undefined,
				mediaWidth,
				mediaHeight,
				caption: caption || undefined,
				category: category || undefined,
				toolsUsed: toolsUsed?.length ? toolsUsed : undefined,
				mediaUrl,
				mediaType: mediaType || undefined,
			}),
		})

		if (!res.ok) {
			const json = await res.json().catch(() => null)
			throw new Error(
				json?.error?.message || json?.error || 'Failed to create portfolio item',
			)
		}

		const json = await res.json()
		return json.data as PortfolioItem
	},
	name: 'createPortfolioItemFx',
})

export const deletePortfolioItemFx = domain.createEffect<
	{ profileId: string; itemId: string },
	void,
	Error
>({
	handler: async ({ profileId, itemId }) => {
		const res = await fetch(
			`/api/freelancers/${encodeURIComponent(profileId)}/portfolio/${encodeURIComponent(itemId)}`,
			{ method: 'DELETE' },
		)

		// API returns 204 on success; treat 404 the same UX-wise
		if (!res.ok && res.status !== 204 && res.status !== 404) {
			const json = await res.json().catch(() => null)
			throw new Error(
				json?.error?.message || json?.error || 'Failed to delete portfolio item',
			)
		}
	},
	name: 'deletePortfolioItemFx',
})

export const submitPortfolioItem = domain.createEvent<PortfolioContext>('submitPortfolioItem')
export const deletePortfolioItem = domain.createEvent<string>('deletePortfolioItem')

// * * * Wiring -----------------------------------------------------------------------------------]

// reset all stores when gate closes
sample({
	clock: FreelancerPortfolioGate.close,
	target: [resetFreelancerPortfolio, resetForm],
})

sample({
	clock: FreelancerPortfolioGate.open,
	target: setFreelancerPortfolioContext,
})

// load portfolio when userId is set
sample({
	clock: setFreelancerPortfolioContext,
	fn: ({ profileId }) => ({ profileId }),
	target: loadPortfolioFx,
})

// load portfolio on explicit refresh
sample({
	clock: refreshPortfolio,
	source: $context,
	filter: Boolean,
	fn: (ctx) => ({ profileId: ctx!.profileId }),
	target: loadPortfolioFx,
})

$portfolio.on(loadPortfolioFx.doneData, (_, items) => items)

// clear derived image dimensions on file change
sample({
	clock: portfolioFormUpdated,
	filter: (update) => 'file' in update,
	fn: () => ({ mediaWidth: null, mediaHeight: null }),
	target: portfolioFormUpdated,
})

// Submit: upload -> create -> refresh
sample({
	clock: submitPortfolioItem,
	source: $form,
	filter: (form, context) =>
		!!context.userId && !!context.profileId && !!form.file && !!form.title.trim(),
	fn: (form, context) => ({
		userId: context.userId,
		profileId: context.profileId,
		file: form.file!,
	}),
	target: uploadPortfolioMediaFx,
})

// create portfolio item payload when upload completed
sample({
	clock: uploadPortfolioMediaFx.doneData,
	source: $form,
	fn: (form, { blob, mediaType, profileId }) => ({
		profileId,
		title: form.title.trim(),
		description: form.description.trim() || undefined,
		mediaWidth: form.mediaWidth ?? undefined,
		mediaHeight: form.mediaHeight ?? undefined,
		caption: form.caption.trim() || undefined,
		category: form.category.trim() || undefined,
		toolsUsed: form.toolsUsed
			.split(',')
			.map((t) => t.trim())
			.filter(Boolean),
		mediaUrl: blob.url,
		mediaType,
	}),
	target: createPortfolioItemFx,
})

// reset form and refresh portfolio after successful create
sample({
	clock: createPortfolioItemFx.doneData,
	target: [resetForm, refreshPortfolio],
})

// delete portfolio item by id using current context
sample({
	clock: deletePortfolioItem,
	source: $context,
	filter: Boolean,
	fn: (ctx, itemId) => ({ profileId: ctx!.profileId, itemId }),
	target: deletePortfolioItemFx,
})

// refresh portfolio after delete completes (success or failure)
sample({
	clock: deletePortfolioItemFx.finally,
	target: refreshPortfolio,
})

// * * * UI helpers --------------------------------------------------------------------------------]

export const $isLoading = loadPortfolioFx.pending
export const $isUploading = uploadPortfolioMediaFx.pending
export const $isSaving = combine(
	{
		uploading: uploadPortfolioMediaFx.pending,
		creating: createPortfolioItemFx.pending,
		deleting: deletePortfolioItemFx.pending,
	},
	({ uploading, creating, deleting }) => uploading || creating || deleting,
)
export const $isBusy = combine($isLoading, $isSaving, (loading, saving) => loading || saving)

// * * * Alerts -----------------------------------------------------------------------------------]
const uploadAlertId = createAlertFx.alertId('portfolio-upload')
const syncUploadProgressFx = domain.createEffect<number, void>({
	handler: (progress) => {
		updateAlert({ id: uploadAlertId, progress })
	},
	name: 'syncUploadProgressFx',
})
const syncCreateStageAlertFx = domain.createEffect<UploadFeedbackMode | null, void>({
	handler: (mode) => {
		updateAlert({
			id: uploadAlertId,
			title: 'Сохраняем элемент...',
			message: 'Создаём запись портфолио',
			progress: mode === 'progress' ? 100 : undefined,
		})
	},
	name: 'syncCreateStageAlertFx',
})

// show progress alert when upload starts
sample({
	clock: uploadPortfolioMediaFx,
	fn: ({ file }) => {
		const mode = getUploadFeedbackMode(file.size)
		return createAlertFx.props({
			id: uploadAlertId,
			severity: 'progress',
			title: 'Загрузка файла...',
			message: 'Загружаем медиа в хранилище',
			progress: mode === 'progress' ? 0 : undefined,
			disableClose: true,
			disableAutoClose: true,
		})
	},
	target: createAlertFx,
})

sample({
	clock: uploadPortfolioMediaFx,
	fn: ({ file }) => getUploadFeedbackMode(file.size),
	target: uploadFeedbackModeChanged,
})

sample({
	clock: uploadPortfolioMediaFx,
	filter: ({ file }) => shouldShowUploadProgress(file.size),
	fn: () => 0,
	target: uploadProgressChanged,
})

sample({
	clock: uploadProgressChanged,
	filter: (progress): progress is number => progress !== null,
	target: syncUploadProgressFx,
})

sample({
	clock: createPortfolioItemFx,
	source: $uploadFeedbackMode,
	target: syncCreateStageAlertFx,
})

// remove progress alert when upload/create finishes
sample({
	clock: [uploadPortfolioMediaFx.fail, createPortfolioItemFx.finally],
	fn: () => null,
	target: uploadProgressChanged,
})

sample({
	clock: [uploadPortfolioMediaFx.fail, createPortfolioItemFx.finally],
	fn: () => null,
	target: uploadFeedbackModeChanged,
})

sample({
	clock: [uploadPortfolioMediaFx.fail, createPortfolioItemFx.finally],
	fn: () => ({ id: uploadAlertId }),
	target: createAlertFx.removeFx,
})

// show error alert when any portfolio effect failed
sample({
	clock: [
		uploadPortfolioMediaFx.failData,
		createPortfolioItemFx.failData,
		deletePortfolioItemFx.failData,
		loadPortfolioFx.failData,
	],
	fn: (error) =>
		createAlertFx.props({
			severity: 'error',
			title: 'Ошибка портфолио',
			message: error.message ?? 'Не удалось обновить портфолио',
			disableAutoClose: true,
		}),
	target: createAlertFx,
})

function shouldShowUploadProgress(fileSize: number) {
	return fileSize > config.uploadProgressThreshold
}

function getUploadFeedbackMode(fileSize: number): UploadFeedbackMode {
	return shouldShowUploadProgress(fileSize) ? 'progress' : 'staged'
}
