import { allSettled, fork } from 'effector'
import { describe, expect, it } from 'vitest'
import {
	$accountContext,
	AccountContextGate,
	applicationSubmitted,
	applicationWithdrawn,
	portfolioWorkCreated,
	portfolioWorkDeleted,
	projectCreated,
} from './model'

describe('account-context model', () => {
	it('hydrates from gate props and resets on close', async () => {
		const scope = fork()

		await allSettled(AccountContextGate.open, {
			scope,
			params: {
				role: 'client',
				projects: 3,
				applications: 5,
				messages: 2,
			},
		})

		expect(scope.getState($accountContext)).toEqual({
			role: 'client',
			projects: 3,
			applications: 5,
			messages: 2,
		})

		await allSettled(AccountContextGate.close, { scope, params: { role: 'client' } })

		expect(scope.getState($accountContext)).toBeNull()
	})

	it('updates counters through patch events', async () => {
		const scope = fork()

		await allSettled(AccountContextGate.open, {
			scope,
			params: {
				role: 'freelancer',
				applications: 1,
				works: 2,
				messages: 4,
			},
		})

		await allSettled(applicationSubmitted, { scope })
		await allSettled(applicationWithdrawn, { scope })
		await allSettled(applicationWithdrawn, { scope })
		await allSettled(portfolioWorkCreated, { scope })
		await allSettled(portfolioWorkDeleted, { scope })
		await allSettled(projectCreated, { scope })

		expect(scope.getState($accountContext)).toEqual({
			role: 'freelancer',
			applications: 0,
			works: 2,
			messages: 4,
		})
	})
})
