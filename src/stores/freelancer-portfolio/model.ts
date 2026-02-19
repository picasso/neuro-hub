'use client'

import { upload } from '@vercel/blob/client'
import { combine, sample } from 'effector'
import { createGate } from 'effector-react'
import { produce } from 'immer'
import { forEach, isEmpty, set } from 'lodash'
import type { PortfolioForm, PortfolioItem, UploadResult } from './types'
import { createAlertFx } from '@/alerts'
import { genericDomain as domain } from '@/lib/logger'

type PortfolioContext = {
	userId: string
	profileId: string
}

export const FreelancerPortfolioGate = createGate({
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

const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024 // 50MB

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
export const submitFreelancerPortfolio = domain.createEvent<PortfolioContext>(
	'submitFreelancerPortfolio',
)

export const $context = domain.createStore<PortfolioContext | null>(null, { name: '$context' })

$context.reset(resetFreelancerPortfolio)
$context.on(submitFreelancerPortfolio, (_, ctx) => ctx)

// * * * Portfolio list ----------------------------------------------------------------------------]

export const refreshPortfolio = domain.createEvent('refreshPortfolio')
export const $portfolio = domain.createStore<PortfolioItem[]>([], { name: '$portfolio' })

$portfolio.reset(resetFreelancerPortfolio)

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
	{ userId: string; file: File },
	{ blob: UploadResult; mediaType: string | null },
	Error
>({
	handler: async ({ userId, file }) => {
		if (!ALLOWED_CONTENT_TYPES.includes(file.type)) {
			throw new Error('Unsupported file type')
		}
		if (file.size > MAX_FILE_SIZE_BYTES) {
			throw new Error('File is too large')
		}

		const pathname = `portfolio/${userId}/${file.name}`
		const blob = await upload(pathname, file, {
			access: 'public',
			handleUploadUrl: '/api/blob/portfolio-upload',
			clientPayload: JSON.stringify({
				userId,
			}),
		})

		return { blob, mediaType: file.type || null }
	},
	name: 'uploadPortfolioMediaFx',
})

export const computeImageDimensionsFx = domain.createEffect<
	File,
	{ width: number; height: number } | null,
	Error
>({
	handler: async (file) => {
		if (!file.type.startsWith('image/')) return null

		try {
			const bitmap = await createImageBitmap(file)
			const dims = { width: bitmap.width, height: bitmap.height }
			bitmap.close?.()
			if (!dims.width || !dims.height) return null
			return dims
		} catch (_error) {
			// fallback for browsers without createImageBitmap support
			const url = URL.createObjectURL(file)
			try {
				const img = new Image()
				img.decoding = 'async'
				img.src = url

				// prefer decode() when available
				if (img.decode) {
					await img.decode()
				} else {
					await new Promise<void>((resolve, reject) => {
						img.onload = () => resolve()
						img.onerror = () => reject(new Error('Failed to load image'))
					})
				}

				if (!img.naturalWidth || !img.naturalHeight) return null
				return { width: img.naturalWidth, height: img.naturalHeight }
			} catch (_error2) {
				return null
			} finally {
				URL.revokeObjectURL(url)
			}
		}
	},
	name: 'computeImageDimensionsFx',
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

export const submitPortfolioItem = domain.createEvent('submitPortfolioItem')
export const deletePortfolioItem = domain.createEvent<string>('deletePortfolioItem')

// * * * Wiring -----------------------------------------------------------------------------------]

// reset all stores when gate closes
sample({
	clock: FreelancerPortfolioGate.close,
	target: [resetFreelancerPortfolio, resetForm],
})

// load portfolio when userId is set
sample({
	clock: submitFreelancerPortfolio,
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

// compute image dimensions when file selected
sample({
	clock: portfolioFormUpdated,
	filter: (update) => 'file' in update && !!update.file,
	fn: (update) => update.file!,
	target: computeImageDimensionsFx,
})

sample({
	clock: computeImageDimensionsFx.doneData,
	fn: (dims) => ({
		mediaWidth: dims?.width ?? null,
		mediaHeight: dims?.height ?? null,
	}),
	target: portfolioFormUpdated,
})

// Submit: upload -> create -> refresh
sample({
	clock: submitPortfolioItem,
	source: {
		context: $context,
		form: $form,
	},
	filter: ({ form, context }) => !!context && !!form.file && !!form.title.trim(),
	fn: ({ form, context }) => ({ userId: context!.userId, file: form.file! }),
	target: uploadPortfolioMediaFx,
})

// create portfolio item payload when upload completed
sample({
	clock: uploadPortfolioMediaFx.doneData,
	source: {
		context: $context,
		form: $form,
	},
	filter: ({ context }) => !!context,
	fn: ({ form, context }, { blob, mediaType }) => ({
		profileId: context!.profileId,
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

export const $isBusy = combine(
	{
		loading: loadPortfolioFx.pending,
		uploading: uploadPortfolioMediaFx.pending,
		creating: createPortfolioItemFx.pending,
		deleting: deletePortfolioItemFx.pending,
	},
	({ loading, uploading, creating, deleting }) => loading || uploading || creating || deleting,
)

// * * * Alerts -----------------------------------------------------------------------------------]
const uploadAlertId = createAlertFx.alertId('portfolio-upload')

// show progress alert when upload starts
sample({
	clock: uploadPortfolioMediaFx,
	fn: () =>
		createAlertFx.props({
			id: uploadAlertId,
			severity: 'progress',
			title: 'Загрузка файла...',
			message: 'Загружаем медиа в хранилище',
			disableClose: true,
			disableAutoClose: true,
		}),
	target: createAlertFx,
})

// remove progress alert when upload/create finishes
sample({
	clock: [uploadPortfolioMediaFx.finally, createPortfolioItemFx.finally],
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
