'use client'

import { combine, sample } from 'effector'
import { createGate } from 'effector-react'
import { produce } from 'immer'
import type { LoginCredentials, LoginErrors } from './types'
import { createAlert, createAlertFx, updateAlert } from '@/alerts'
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

// clear email error on change
sample({
	clock: updatedEmail,
	source: $errors,
	fn: (errors) =>
		produce(errors, (draft) => {
			delete draft.email
		}),
	target: $errors,
})

// clear password error on change
sample({
	clock: updatedPassword,
	source: $errors,
	fn: (errors) =>
		produce(errors, (draft) => {
			delete draft.password
		}),
	target: $errors,
})

// * * * Effects ----------------------------------------------------------------------------------]

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

export const signInFx = domain.createEffect<LoginCredentials, unknown, Error>({
	handler: async ({ email, password, rememberMe, callbackURL }) => {
		const timerId = setTimeout(() => {
			createAlertFx({
				id: loginAlertId,
				severity: 'progress',
				title: 'Авторизация...',
				message: 'Проверяем ваши данные',
				disableClose: true,
				disableAutoClose: true,
				overlay: true,
			})
		}, 800)

		try {
			const result = await authClient.signIn.email({
				email,
				password,
				rememberMe,
				callbackURL,
			})

			clearTimeout(timerId)

			if (!result.data) {
				createAlertFx.remove(loginAlertId)
				// bubble up the adapter error object into catch()
				throw (result.error as BetterAuthError) ?? new Error('Sign-in failed')
			} else {
				// NOTE: no need to remove progress alert here, it will be removed by Next router
				// it also gives a better user experience
				updateAlert({
					id: loginAlertId,
					title: 'Доступ разрешен',
					message: 'Авторизация прошла успешно',
				})
			}

			return result.data
		} catch (error) {
			clearTimeout(timerId)
			createAlertFx.remove(loginAlertId)

			const err = error as BetterAuthError

			const code = err?.code ?? err?.error?.code
			const status =
				err?.error?.statusCode ??
				err?.error?.status ??
				// some adapters return status at top level
				err?.status ??
				err?.statusCode

			const isUnverified =
				status === 403 ||
				code === 'EMAIL_NOT_VERIFIED' ||
				(code?.toLowerCase?.() ?? '').includes('verify') ||
				(err?.error?.message?.toLowerCase?.() ?? '').includes('verify') ||
				(err?.message?.toLowerCase?.() ?? '').includes('verify')

			if (isUnverified) {
				createAlert({
					severity: 'info',
					title: 'Email не подтверждён',
					message: 'Мы отправили письмо для верификации — подтвердите и повторите вход.',
				})
				throw new Error('EMAIL_NOT_VERIFIED')
			} else {
				const message =
					(err?.error?.message as string | undefined) ||
					(err?.message as string | undefined) ||
					'Не удалось войти'
				createAlert('error', message)
				throw new Error(message)
			}
		}
	},
	name: 'signInFx',
})

export const submitLogin = domain.createEvent('submitLogin')

// set callback url when gate opens
sample({
	clock: LoginGate.open,
	fn: ({ callbackURL }) => callbackURL,
	target: setCallbackURL,
})

// trigger sign-in on submit
sample({
	clock: submitLogin,
	source: $credentials,
	target: signInFx,
})

// * * * Computed stores --------------------------------------------------------------------------]

export const $isLoading = signInFx.pending

export const $canSubmit = combine($credentials, (c) => !!c.email && !!c.password)

// * * * Reset all stores -------------------------------------------------------------------------]

export const resetLogin = domain.createEvent('resetLogin')

// reset credentials + errors
sample({
	clock: resetLogin,
	target: [resetCredentials, resetErrors],
})

// reset on gate close
sample({
	clock: LoginGate.close,
	target: resetLogin,
})
