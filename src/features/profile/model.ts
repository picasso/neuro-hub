'use client'

import { upload } from '@vercel/blob/client'
import { combine, sample } from 'effector'
import { createGate } from 'effector-react'
import { produce } from 'immer'
import { assign, isEmpty, isEqual } from 'lodash'
import { debounce } from 'patronum'
import type { NickStatus, ProfileDTO, ProfileForm, Language } from './types'
import { createAlertFx } from '@/alerts'
import { config } from '@/config'
import { profileDomain as domain } from '@/lib/logger'
import { nicknameSchema } from '@/lib/validations'
import { fileSize } from '@/utils'

const ALLOWED_AVATAR_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

const emptyForm: ProfileForm = {
	name: '',
	nickname: '',
	location: '',
	bio: '',
	avatarUrl: '',
	languages: [],
}

type ProfileContext = {
	userId: string
}

type NicknameFeedback = {
	status: NickStatus
	message: string | null
}

type LanguageUpdate = {
	index: number
	value: Partial<Language>
}

export const ProfileGate = createGate<ProfileContext>({
	domain,
	name: 'ProfileGate',
})

export const resetProfile = domain.createEvent('resetProfile')
const setProfileContext = domain.createEvent<ProfileContext>('setProfileContext')
export const profileUpdated = domain.createEvent<Partial<ProfileForm>>('profileUpdated')
export const languageAdded = domain.createEvent('languageAdded')
export const languageUpdated = domain.createEvent<LanguageUpdate>('languageUpdated')
export const languageRemoved = domain.createEvent<number>('languageRemoved')
export const avatarSelected = domain.createEvent<File>('avatarSelected')
export const saveRequested = domain.createEvent('saveRequested')
const autosaveRequested = domain.createEvent('autosaveRequested')

export const nicknameEdited = domain.createEvent<string | undefined>('nicknameEdited')
export const nicknameUpdated = domain.createEvent<string>('nicknameUpdated')
const nicknameChecked = domain.createEvent<NicknameFeedback>('nicknameChecked')

export const $context = domain.createStore<ProfileContext | null>(null, { name: '$context' })
export const $form = domain.createStore<ProfileForm>(emptyForm, { name: '$form' })
export const $savedForm = domain.createStore<ProfileForm>(emptyForm, { name: '$savedForm' })
export const $nickStatus = domain.createStore<NickStatus>('idle', { name: '$nickStatus' })
export const $nickMessage = domain.createStore<string | null>(null, { name: '$nickMessage' })

$context.reset(resetProfile)
$context.on(setProfileContext, (_, context) => context)

$form.reset(resetProfile)
$savedForm.reset(resetProfile)

$form.on(profileUpdated, (form, update) => (isEmpty(update) ? form : { ...form, ...update }))
$form.on(nicknameUpdated, (form, nickname) => ({ ...form, nickname }))
$form.on(languageAdded, (form) =>
	produce(form, (draft) => {
		if (draft.languages.length >= 32) return
		draft.languages.push({
			id: createLanguageId(),
			languageCode: '',
			name: '',
			nativeName: '',
		})
	}),
)
$form.on(languageUpdated, (form, { index, value }) =>
	produce(form, (draft) => {
		if (draft.languages[index]) {
			const hasLevel = value.langLevel || draft.languages[index].langLevel
			const update = hasLevel ? value : { ...value, langLevel: 'basic' }
			assign(draft.languages[index], update)
		}
	}),
)
$form.on(languageRemoved, (form, index) =>
	produce(form, (draft) => {
		draft.languages.splice(index, 1)
	}),
)

$nickStatus.reset(resetProfile)
$nickMessage.reset(resetProfile)

$nickStatus.on(nicknameChecked, (_, feedback) => feedback.status)
$nickMessage.on(nicknameChecked, (_, feedback) => feedback.message)

export const loadProfileFx = domain.createEffect<void, ProfileDTO | null, Error>({
	handler: async () => {
		const res = await fetch('/api/user/profile')
		if (!res.ok) {
			const json = await res.json().catch(() => null)
			throw new Error(json?.error?.message || json?.error || 'Failed to load profile')
		}
		const json = await res.json()
		return (json.data ?? null) as ProfileDTO | null
	},
	name: 'loadProfileFx',
})

export const saveProfileFx = domain.createEffect<ProfileForm, ProfileDTO, Error>({
	handler: async (form) => {
		const res = await fetch('/api/user/profile', {
			method: 'PUT',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({
				name: emptyToUndefined(form.name),
				nickname: emptyToUndefined(form.nickname),
				location: emptyToNull(form.location),
				bio: emptyToUndefined(form.bio),
				avatarUrl: emptyToUndefined(form.avatarUrl),
				languages: form.languages
					.filter((item) => !!item.languageCode)
					.map((item) => ({
						languageCode: item.languageCode,
						langLevel: item.langLevel,
					})),
			}),
		})

		if (!res.ok) {
			const json = await res.json().catch(() => null)
			throw new Error(json?.error?.message || json?.error || 'Failed to save profile')
		}

		const json = await res.json()
		return json.data as ProfileDTO
	},
	name: 'saveProfileFx',
})

export const checkNickFx = domain.createEffect<
	string,
	{ nickname: string; available: boolean },
	Error
>({
	handler: async (nickname) => {
		const params = new URLSearchParams({ nickname })
		const res = await fetch(`/api/user/profile/nickname?${params.toString()}`)
		if (!res.ok) {
			const json = await res.json().catch(() => null)
			throw new Error(json?.error?.message || json?.error || 'Failed to check nickname')
		}

		const json = await res.json()
		return json.data as { nickname: string; available: boolean }
	},
	name: 'checkNickFx',
})

export const uploadAvatarFx = domain.createEffect<{ userId: string; file: File }, string, Error>({
	handler: async ({ userId, file }) => {
		if (!ALLOWED_AVATAR_TYPES.includes(file.type)) {
			throw new Error('Unsupported avatar file type')
		}
		if (file.size > config.uploadMaxSize) {
			throw new Error(`File is too large: ${fileSize(file.size, 0, true)}`)
		}

		const pathname = `avatars/${userId}/${file.name}`
		const blob = await upload(pathname, file, {
			access: 'public',
			handleUploadUrl: '/api/blob/avatar-upload',
			clientPayload: JSON.stringify({ userId }),
		})

		return blob.url
	},
	name: 'uploadAvatarFx',
})

export const $isLoading = loadProfileFx.pending
export const $isSaving = saveProfileFx.pending
export const $isUploadingAvatar = uploadAvatarFx.pending
export const $isBusy = combine(
	$isLoading,
	$isSaving,
	$isUploadingAvatar,
	(loading, saving, uploading) => loading || saving || uploading,
)
export const $isDirty = combine(
	$form,
	$savedForm,
	(form, initialForm) => !isEqual(form, initialForm),
)
export const $canSave = combine(
	$isBusy,
	$isDirty,
	$nickStatus,
	(isBusy, isDirty, nickStatus) => !isBusy && isDirty && !busyNS.includes(nickStatus),
)

// reset profile slice when leaving the editor gate
sample({
	clock: ProfileGate.close,
	target: resetProfile,
})

// capture viewer context on mount
sample({
	clock: ProfileGate.open,
	target: setProfileContext,
})

// fetch profile DTO when gate opens
sample({
	clock: ProfileGate.open,
	target: loadProfileFx,
})

// hydrate editable draft after the initial profile load
sample({
	clock: loadProfileFx.doneData,
	fn: (profile) => toForm(profile),
	target: [$form, $savedForm],
})

// restore nickname feedback from the canonical persisted profile state
sample({
	clock: loadProfileFx.doneData,
	fn: () =>
		({
			status: 'idle',
			message: null,
		}) as NicknameFeedback,
	target: nicknameChecked,
})

// persist the latest successful snapshot for dirty-checking and future previews
sample({
	clock: saveProfileFx.doneData,
	fn: (profile) => toForm(profile),
	target: $savedForm,
})

// keep invalid draft nickname on screen while syncing all other saved profile fields
sample({
	clock: saveProfileFx.doneData,
	source: {
		form: $form,
		nickStatus: $nickStatus,
	},
	fn: ({ form, nickStatus }, profile) => {
		const savedForm = toForm(profile)
		return busyNS.includes(nickStatus)
			? {
					...savedForm,
					nickname: form.nickname,
				}
			: savedForm
	},
	target: $form,
})

// derive immediate nickname feedback as soon as the field changes
sample({
	clock: nicknameEdited,
	source: $savedForm,
	filter: (_, nickname) => !!nickname,
	fn: (form, nickname) => checkNickname(nickname!, form.nickname),
	target: nicknameChecked,
})

// schedule autosave after any committed profile field change
sample({
	clock: [profileUpdated, nicknameUpdated],
	target: autosaveRequested,
})

// debounce remote nickname checks for valid non-current values
sample({
	clock: debounce(nicknameEdited, 400),
	source: $savedForm,
	filter: (form, nickname) =>
		!!nickname && checkNickname(nickname, form.nickname).status === 'checking',
	fn: (_, nickname) => normalizeNickname(nickname!),
	target: checkNickFx,
})

// reconcile async nickname availability with the latest local input
sample({
	clock: checkNickFx.doneData,
	source: $form,
	// filter: (form, result) => normalizeNickname(form.nickname) === result.nickname,
	fn: (_, result): NicknameFeedback =>
		result.available
			? {
					status: 'available',
					message: 'Nickname свободен',
				}
			: {
					status: 'taken',
					message: 'Этот nickname уже занят',
				},
	target: nicknameChecked,
})

// retry autosave after nickname becomes valid or returns to the persisted value
// sample({
// 	clock: nicknameChecked,
// 	filter: ({status}) => status === 'available',
// 	target: autosaveRequested,
// })

// surface network errors for nickname availability without blocking edits
sample({
	clock: checkNickFx.failData,
	fn: (error): NicknameFeedback => ({
		status: 'error',
		message: error.message ?? 'Не удалось проверить nickname',
	}),
	target: nicknameChecked,
})

// start avatar upload after the editor returns a processed file
sample({
	clock: avatarSelected,
	source: $context,
	filter: Boolean,
	fn: (context, file) => ({
		userId: context!.userId,
		file,
	}),
	target: uploadAvatarFx,
})

// sync uploaded avatar URL into the editable profile draft
sample({
	clock: uploadAvatarFx.doneData,
	fn: (avatarUrl) => ({ avatarUrl }),
	target: profileUpdated,
})

// submit profile save with the latest draft
sample({
	clock: saveRequested,
	source: {
		form: $form,
		status: $nickStatus,
	},
	filter: ({ status }) => !busyNS.includes(status),
	fn: ({ form }) => form,
	target: saveProfileFx,
})

// autosave committed changes when the profile draft is dirty and valid
sample({
	clock: debounce(autosaveRequested, 500),
	source: {
		form: $form,
		savedForm: $savedForm,
		isBusy: $isBusy,
		isDirty: $isDirty,
		nickStatus: $nickStatus,
	},
	filter: ({ isBusy, isDirty }) => !isBusy && isDirty,
	fn: ({ form, savedForm, nickStatus }) =>
		prepareAutosaveForm({
			form,
			savedForm,
			nickStatus,
		}),
	target: saveProfileFx,
})

// surface profile and avatar errors through the shared alerts system
sample({
	clock: [loadProfileFx.failData, saveProfileFx.failData, uploadAvatarFx.failData],
	fn: (error) =>
		createAlertFx.props({
			severity: 'error',
			title: 'Ошибка профиля',
			message: error.message ?? 'Не удалось обновить профиль',
			disableAutoClose: true,
		}),
	target: createAlertFx,
})

// helpers ----------------------------------------------------------------------------------------]

const faultyNS: NickStatus[] = ['invalid', 'taken', 'error']
const busyNS: NickStatus[] = ['checking', ...faultyNS]

function toForm(profile: ProfileDTO | null): ProfileForm {
	if (!profile) return emptyForm

	return {
		name: profile.name ?? '',
		nickname: profile.nickname ?? '',
		location: profile.location ?? '',
		bio: profile.bio ?? '',
		avatarUrl: profile.avatarUrl ?? '',
		languages:
			profile.languages?.map((language) => ({
				id: createLanguageId(),
				...language,
			})) ?? [],
	}
}

function emptyToUndefined(value: string) {
	const normalized = value.trim()
	return normalized ? normalized : undefined
}

function emptyToNull(value: string) {
	const normalized = value.trim()
	return normalized ? normalized : null
}

function normalizeNickname(value: string) {
	return value.trim().toLowerCase()
}

function prepareAutosaveForm({
	form,
	savedForm,
	nickStatus,
}: {
	form: ProfileForm
	savedForm: ProfileForm
	nickStatus: NickStatus
}): ProfileForm {
	if (!busyNS.includes(nickStatus)) {
		return form
	}

	return {
		...form,
		nickname: savedForm.nickname,
	}
}

function checkNickname(next: string, prev: string): NicknameFeedback {
	const nickname = normalizeNickname(next)
	if (!nickname || nickname === normalizeNickname(prev)) {
		return {
			status: 'idle',
			message: null,
		}
	}

	const parsed = nicknameSchema.safeParse(nickname)
	if (!parsed.success) {
		return {
			status: 'invalid',
			message: parsed.error.issues[0]?.message ?? 'Некорректный nickname',
		}
	}

	return {
		status: 'checking',
		message: 'Проверяем nickname...',
	}
}

function createLanguageId() {
	return Math.random().toString(36).slice(2, 10)
}
