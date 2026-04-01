'use client'

import { sample } from 'effector'
import { createGate } from 'effector-react'
import { produce } from 'immer'
import { includes, toLower } from 'lodash'
import { delay } from 'patronum'
import type { LoginCredentials, LoginErrors } from './types'
import { createAlert, createAlertFx } from '@/alerts'
import { authClient } from '@/lib/auth/client'
import { authDomain as domain } from '@/lib/logger'

// * * * Gate -------------------------------------------------------------------------------------]

export const LoginGate = createGate<{ callbackURL: string }>({ domain, name: 'LoginGate' })

// * * * $credentials -----------------------------------------------------------------------------]

export const resetCredentials = domain.createEvent('resetCredentials')
export const updatedEmail = domain.createEvent<string>('updatedEmail')
export const updatedPassword = domain.createEvent<string>('updatedPassword')
export const toggledRememberMe = domain.createEvent('toggledRememberMe')
export const setCallbackURL = domain.createEvent<string>('setCallbackURL')

export const $credentials = domain.createStore<LoginCredentials>(
	{
		email: '',
		password: '',
		rememberMe: true,
		callbackURL: '/account/dashboard',
	},
	{ name: '$credentials' },
)

$credentials.reset(resetCredentials)

$credentials.on(updatedEmail, (state, email) =>
	produce(state, (draft) => {
		draft.email = email
	}),
)
$credentials.on(updatedPassword, (state, password) =>
	produce(state, (draft) => {
		draft.password = password
	}),
)
$credentials.on(toggledRememberMe, (state) =>
	produce(state, (draft) => {
		draft.rememberMe = !draft.rememberMe
	}),
)
$credentials.on(setCallbackURL, (state, callbackURL) =>
	produce(state, (draft) => {
		draft.callbackURL = callbackURL
	}),
)

// * * * $errors ----------------------------------------------------------------------------------]

const resetErrors = domain.createEvent('resetErrors')
export const $errors = domain.createStore<LoginErrors>({}, { name: '$errors' })

$errors.reset(resetErrors)

// drop email field error when user edits email
sample({
	clock: updatedEmail,
	source: $errors,
	fn: (errors) => {
		const next = { ...errors }
		delete next.email
		return next
	},
	target: $errors,
})

// drop password field error when user edits password
sample({
	clock: updatedPassword,
	source: $errors,
	fn: (errors) => {
		const next = { ...errors }
		delete next.password
		return next
	},
	target: $errors,
})

// * * * signInFx ---------------------------------------------------------------------------------]

const loginAlertId = createAlertFx.alertId('login')

type BetterAuthError = {
	// observed in API responses: { code: "EMAIL_NOT_VERIFIED", message: "Email not verified" }
	code?: string
	message?: string
	status?: number
	statusText?: string
	statusCode?: number
	error?: { message?: string; code?: string; statusCode?: number; status?: number }
}

const thrownError = domain.createEvent<BetterAuthError>('thrownError')
export const signInFx = domain.createEffect<LoginCredentials, unknown, Error>({
	handler: async ({ email, password, rememberMe, callbackURL }) => {
		createAlert({
			id: loginAlertId,
			severity: 'progress',
			title: 'Авторизация...',
			message: 'Проверяем ваши данные',
			disableClose: true,
			disableAutoClose: true,
			overlay: true,
		})
		const result = await authClient.signIn.email({
			email,
			password,
			rememberMe,
			callbackURL,
		})

		if (!result.data) {
			thrownError(result.error as BetterAuthError)
		}
		return result.data
	},
	name: 'signInFx',
})

export const submitLogin = domain.createEvent('submitLogin')

// sync callback URL from gate open payload
sample({
	clock: LoginGate.open,
	fn: ({ callbackURL }) => callbackURL,
	target: setCallbackURL,
})

// run sign-in with current credentials
sample({
	clock: submitLogin,
	source: $credentials,
	target: signInFx,
})

// update alert information if sign-in is successful and data is present
sample({
	clock: signInFx.doneData,
	filter: (data) => !!data,
	fn: () =>
		// NOTE: no need to remove progress alert here, it will be removed by Next router
		// it also gives a better user experience
		createAlertFx.patchProps({
			id: loginAlertId,
			title: 'Доступ разрешен',
			message: 'Авторизация прошла успешно',
		}),
	target: createAlertFx.patch,
})

// dismiss login progress alert when error was thrown or effect fails
sample({
	clock: [signInFx.fail, thrownError],
	fn: () => ({ id: loginAlertId }),
	target: createAlertFx.removeFx,
})

// process sign-in failure and display appropriate alert
sample({
	clock: [delay(signInFx.failData, 800), delay(thrownError, 800)],
	fn: (err: BetterAuthError) => {
		const code = err?.code ?? err?.error?.code
		const status =
			err?.error?.statusCode ??
			err?.error?.status ??
			// some adapters return status at top level
			err?.status ??
			err?.statusCode
		const message = err?.error?.message ?? err?.message

		const isUnverified =
			status === 403 ||
			code === 'EMAIL_NOT_VERIFIED' ||
			includes(toLower(code ?? message), 'verify')

		if (isUnverified) {
			return createAlertFx.props({
				severity: 'info',
				title: 'Email не подтверждён',
				message: 'Мы отправили `+письмо` для верификации — подтвердите и повторите вход.',
				relaxed: true,
				toasterId: 'dialog-toaster',
			})
		} else {
			const isInvalid = includes(toLower(message), 'invalid')
			return createAlertFx.props({
				severity: 'error',
				title: 'Ошибка авторизации',
				message: isInvalid
					? 'Неверный `!email` или `!пароль` - *попробуйте ещё раз*.'
					: (message ?? '*Что-то пошло не так:* не удалось войти, попробуйте ещё раз.'),
				disableAutoClose: true,
				relaxed: isInvalid,
				toasterId: 'dialog-toaster',
			})
		}
	},
	target: createAlertFx,
})

// reset credentials and errors when gate unmounts
sample({
	clock: LoginGate.close,
	target: [resetCredentials, resetErrors],
})
