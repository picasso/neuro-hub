'use client'

import { upload } from '@vercel/blob/client'
import { combine, sample } from 'effector'
import { createGate } from 'effector-react'
import { isEmpty } from 'lodash'
import type { PortfolioForm, PortfolioItem, UploadResult } from './types'
import { createAlertFx, updateAlert } from '@/alerts'
import { config } from '@/config'
import { requestJson } from '@/lib/api-client'
import { freelancerPortfolioDomain as domain } from '@/lib/logger'
import { portfolioWorkCreated, portfolioWorkDeleted } from '@/stores'
import { fileSize } from '@/utils'

type PortfolioContext = {
	userId: string
	nickname: string
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
$form.on(portfolioFormUpdated, (form, update) => (isEmpty(update) ? form : { ...form, ...update }))

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

export const loadPortfolioFx = domain.createEffect<{ nickname: string }, PortfolioItem[], Error>({
	handler: async ({ nickname }) => {
		return requestJson<PortfolioItem[]>(
			`/api/freelancers/${encodeURIComponent(nickname)}/portfolio`,
			{
				fallbackMessage: 'Failed to load portfolio',
			},
		)
	},
	name: 'loadPortfolioFx',
})

export const uploadPortfolioMediaFx = domain.createEffect<
	{ userId: string; nickname: string; file: File },
	{ blob: UploadResult; mediaType: string | null; nickname: string },
	Error
>({
	handler: async ({ userId, nickname, file }) => {
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

		return { blob, mediaType: file.type || null, nickname }
	},
	name: 'uploadPortfolioMediaFx',
})

export const createPortfolioItemFx = domain.createEffect<
	{
		nickname: string
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
		nickname,
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
		return requestJson<PortfolioItem>(
			`/api/freelancers/${encodeURIComponent(nickname)}/portfolio`,
			{
				method: 'POST',
				json: {
					title,
					description,
					mediaWidth,
					mediaHeight,
					caption,
					category,
					toolsUsed,
					mediaUrl,
					mediaType,
				},
				normalizeJson: {
					omitEmptyStrings: true,
					omitNulls: true,
					omitEmptyArrays: true,
				},
				fallbackMessage: 'Failed to create portfolio item',
			},
		)
	},
	name: 'createPortfolioItemFx',
})

export const deletePortfolioItemFx = domain.createEffect<
	{ nickname: string; itemId: string },
	void,
	Error
>({
	handler: async ({ nickname, itemId }) => {
		const res = await fetch(
			`/api/freelancers/${encodeURIComponent(nickname)}/portfolio/${encodeURIComponent(itemId)}`,
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

// * * * wiring -----------------------------------------------------------------------------------]

// reset portfolio slice when leaving the editor gate
sample({
	clock: FreelancerPortfolioGate.close,
	target: [resetFreelancerPortfolio, resetForm],
})

// capture user/profile ids when gate opens
sample({
	clock: FreelancerPortfolioGate.open,
	target: setFreelancerPortfolioContext,
})

// fetch list after context is known
sample({
	clock: setFreelancerPortfolioContext,
	fn: ({ nickname }) => ({ nickname }),
	target: loadPortfolioFx,
})

// refetch list on manual refresh with current profile id
sample({
	clock: refreshPortfolio,
	source: $context,
	filter: Boolean,
	fn: (ctx) => ({ nickname: ctx!.nickname }),
	target: loadPortfolioFx,
})

$portfolio.on(loadPortfolioFx.doneData, (_, items) => items)

// reset width/height hints when user picks a new file
sample({
	clock: portfolioFormUpdated,
	filter: (update) => 'file' in update,
	fn: () => ({ mediaWidth: null, mediaHeight: null }),
	target: portfolioFormUpdated,
})

// start blob upload when submit is valid for current context
sample({
	clock: submitPortfolioItem,
	source: $form,
	filter: (form, context) =>
		!!context.userId && !!context.nickname && !!form.file && !!form.title.trim(),
	fn: (form, context) => ({
		userId: context.userId,
		nickname: context.nickname,
		file: form.file!,
	}),
	target: uploadPortfolioMediaFx,
})

// persist portfolio row after blob upload succeeds
sample({
	clock: uploadPortfolioMediaFx.doneData,
	source: $form,
	fn: (form, { blob, mediaType, nickname }) => ({
		nickname,
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

// clear form and reload list after successful create
sample({
	clock: createPortfolioItemFx.doneData,
	target: [resetForm, refreshPortfolio],
})

// bump account snapshot work count after create
sample({
	clock: createPortfolioItemFx.doneData,
	target: portfolioWorkCreated,
})

// call delete API with current profile id + item id
sample({
	clock: deletePortfolioItem,
	source: $context,
	filter: Boolean,
	fn: (ctx, itemId) => ({ nickname: ctx!.nickname, itemId }),
	target: deletePortfolioItemFx,
})

// sync list after delete attempt finishes
sample({
	clock: deletePortfolioItemFx.finally,
	target: refreshPortfolio,
})

// decrement account snapshot work count after delete succeeds
sample({
	clock: deletePortfolioItemFx.doneData,
	target: portfolioWorkDeleted,
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

// open upload progress toast when blob upload starts
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

// track staged vs numeric progress mode for the active upload
sample({
	clock: uploadPortfolioMediaFx,
	fn: ({ file }) => getUploadFeedbackMode(file.size),
	target: uploadFeedbackModeChanged,
})

// seed progress at 0 for large files that show a percent bar
sample({
	clock: uploadPortfolioMediaFx,
	filter: ({ file }) => shouldShowUploadProgress(file.size),
	fn: () => 0,
	target: uploadProgressChanged,
})

// push percent updates into the open progress toast
sample({
	clock: uploadProgressChanged,
	filter: (progress): progress is number => progress !== null,
	target: syncUploadProgressFx,
})

// swap toast copy when moving from upload to persist stage
sample({
	clock: createPortfolioItemFx,
	source: $uploadFeedbackMode,
	target: syncCreateStageAlertFx,
})

// clear percent state when upload or create leg ends
sample({
	clock: [uploadPortfolioMediaFx.fail, createPortfolioItemFx.finally],
	fn: () => null,
	target: uploadProgressChanged,
})

// reset feedback mode when upload or create leg ends
sample({
	clock: [uploadPortfolioMediaFx.fail, createPortfolioItemFx.finally],
	fn: () => null,
	target: uploadFeedbackModeChanged,
})

// dismiss portfolio progress toast after upload/create completes or fails
sample({
	clock: [uploadPortfolioMediaFx.fail, createPortfolioItemFx.finally],
	fn: () => ({ id: uploadAlertId }),
	target: createAlertFx.removeFx,
})

// surface any portfolio effect failure via toast
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
