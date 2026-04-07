import { allSettled, createEffect, createEvent, fork } from 'effector'
import { describe, expect, it, vi } from 'vitest'
import { $credentials, LoginGate } from './model'

vi.mock('@/alerts', () => {
	const createAlert = vi.fn()
	const patch = createEvent()
	const removeFx = createEffect({
		handler: () => undefined,
	})
	const createFx = createEffect({
		async handler() {
			return undefined
		},
	})
	const createAlertFx = Object.assign(createFx, {
		alertId: (key?: string) => `alert-${key ?? 'test'}`,
		remove: vi.fn(),
		removeFx,
		props: <T>(alert: T) => alert,
		patchProps: <T>(alert: T) => alert,
		patch,
	})

	return {
		createAlert,
		createAlertFx,
	}
})

vi.mock('@/lib/auth/client', () => {
	return {
		authClient: {
			signIn: { email: vi.fn() },
		},
	}
})

describe('auth-login gate props', () => {
	it('sets callbackURL when LoginGate opens', async () => {
		const scope = fork()

		await allSettled(LoginGate.open, {
			scope,
			params: { callbackURL: '/login?next=/dashboard' },
		})

		expect(scope.getState($credentials).callbackURL).toBe('/login?next=/dashboard')
	})
})
