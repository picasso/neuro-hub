'use client'

import { combine, sample } from 'effector'
import { createGate } from 'effector-react'
import { includes, toLower } from 'lodash'
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

$credentials.on(updatedEmail, (state, email) => ({ ...state, email }))

$credentials.on(updatedPassword, (state, password) => ({ ...state, password }))

$credentials.on(toggledRememberMe, (state) => ({ ...state, rememberMe: !state.rememberMe }))

$credentials.on(setCallbackURL, (state, callbackURL) => ({ ...state, callbackURL }))

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
			createAlert({
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
			const message = err?.error?.message ?? err?.message

			const isUnverified =
				status === 403 ||
				code === 'EMAIL_NOT_VERIFIED' ||
				includes(toLower(code ?? message), 'verify')

			if (isUnverified) {
				createAlert({
					severity: 'info',
					title: 'Email не подтверждён',
					message:
						'Мы отправили `+письмо` для верификации — подтвердите и повторите вход.',
					relaxed: true,
				})
			} else {
				const isInvalid = includes(toLower(message), 'invalid')
				createAlert({
					severity: 'error',
					title: 'Ошибка авторизации',
					message: isInvalid
						? 'Неверный `!email` или `!пароль` - *попробуйте ещё раз*.'
						: (message ??
							'*Что-то пошло не так:* не удалось войти, попробуйте ещё раз.'),
					disableAutoClose: true,
					relaxed: isInvalid,
				})
			}
		}
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

// * * * Computed stores --------------------------------------------------------------------------]

export const $isLoading = signInFx.pending

export const $canSubmit = combine($credentials, (c) => !!c.email && !!c.password)

// * * * Reset all stores -------------------------------------------------------------------------]

export const resetLogin = domain.createEvent('resetLogin')

// reset credential and error stores together
sample({
	clock: resetLogin,
	target: [resetCredentials, resetErrors],
})

// reset login state when gate unmounts
sample({
	clock: LoginGate.close,
	target: resetLogin,
})
