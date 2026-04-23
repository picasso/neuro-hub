import { allSettled, fork } from 'effector'
import { describe, expect, it } from 'vitest'
import {
	$authHeaderState,
	$authHeaderUnreadMessages,
	$authHeaderViewer,
	authHeaderUnreadMessagesPatched,
	authHeaderViewerPatched,
	AuthHeaderGate,
	clearAuthHeader,
} from './model'

describe('auth-header model', () => {
	it('hydrates from gate props and keeps the latest header state', async () => {
		const scope = fork()

		await allSettled(AuthHeaderGate.open, {
			scope,
			params: {
				viewer: {
					email: 'client@example.com',
					displayName: 'Client User',
					avatarUrl: 'https://example.com/avatar.png',
				},
				snapshot: {
					role: 'client',
					messages: 2,
					projects: 4,
				},
			},
		})

		expect(scope.getState($authHeaderState)).toEqual({
			viewer: {
				email: 'client@example.com',
				displayName: 'Client User',
				avatarUrl: 'https://example.com/avatar.png',
			},
			snapshot: {
				role: 'client',
				messages: 2,
				projects: 4,
			},
		})

		await allSettled(AuthHeaderGate.close, {
			scope,
			params: {
				viewer: {
					email: 'client@example.com',
					displayName: 'Client User',
					avatarUrl: 'https://example.com/avatar.png',
				},
				snapshot: {
					role: 'client',
					messages: 2,
					projects: 4,
				},
			},
		})

		expect(scope.getState($authHeaderState)).toBeNull()
	})

	it('patches viewer identity and unread count independently', async () => {
		const scope = fork()

		await allSettled(AuthHeaderGate.open, {
			scope,
			params: {
				viewer: {
					email: 'viewer@example.com',
					displayName: 'Before Save',
					avatarUrl: null,
				},
				snapshot: {
					role: 'freelancer',
					messages: 3,
					applications: 1,
				},
			},
		})

		await allSettled(authHeaderViewerPatched, {
			scope,
			params: {
				displayName: 'After Save',
				avatarUrl: 'https://example.com/new-avatar.png',
			},
		})
		await allSettled(authHeaderUnreadMessagesPatched, {
			scope,
			params: 7,
		})

		expect(scope.getState($authHeaderViewer)).toEqual({
			email: 'viewer@example.com',
			displayName: 'After Save',
			avatarUrl: 'https://example.com/new-avatar.png',
		})
		expect(scope.getState($authHeaderUnreadMessages)).toBe(7)
		expect(scope.getState($authHeaderState)?.snapshot).toEqual({
			role: 'freelancer',
			messages: 7,
			applications: 1,
		})
	})

	it('clears the shared header state explicitly', async () => {
		const scope = fork()

		await allSettled(AuthHeaderGate.open, {
			scope,
			params: {
				viewer: {
					email: 'clear@example.com',
					displayName: 'Clear Me',
					avatarUrl: null,
				},
				snapshot: {
					role: 'client',
					messages: 1,
				},
			},
		})

		await allSettled(clearAuthHeader, { scope })

		expect(scope.getState($authHeaderState)).toBeNull()
	})
})
