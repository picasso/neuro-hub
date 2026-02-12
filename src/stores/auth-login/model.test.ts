import { allSettled, fork } from 'effector'
import { $credentials, LoginGate } from './model'

jest.mock('@/alerts', () => {
	const createAlert = jest.fn()
	const createAlertFx = Object.assign(jest.fn(), {
		alertId: (key?: string) => `alert-${key ?? 'test'}`,
		remove: jest.fn(),
		removeFx: jest.fn(),
		props: <T>(alert: T) => alert,
	})

	return {
		createAlert,
		createAlertFx,
	}
})

jest.mock('@/lib/auth/client', () => {
	return {
		authClient: {
			signIn: { email: jest.fn() },
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
