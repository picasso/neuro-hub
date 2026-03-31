import { sample } from 'effector'
import { createGate } from 'effector-react'
import type { AccountSnapshot } from '@/lib/account'
import { accountContextDomain as domain } from '@/lib/logger'

export const AccountContextGate = createGate<AccountSnapshot>({
	domain,
	name: 'AccountContextGate',
})

export const resetContext = domain.createEvent('resetContext')
export const contextHydrated = domain.createEvent<AccountSnapshot>('contextHydrated')
export const contextPatched = domain.createEvent<Partial<AccountSnapshot>>('contextPatched')

export const projectCreated = domain.createEvent('projectCreated')
export const applicationSubmitted = domain.createEvent('applicationSubmitted')
export const applicationWithdrawn = domain.createEvent('applicationWithdrawn')
export const applicationRejectedObserved = domain.createEvent('applicationRejectedObserved')
export const portfolioWorkCreated = domain.createEvent('portfolioWorkCreated')
export const portfolioWorkDeleted = domain.createEvent('portfolioWorkDeleted')

export const $accountContext = domain.createStore<AccountSnapshot | null>(null, {
	name: '$accountContext',
})
export const $accountRole = $accountContext.map((context) => context?.role ?? null)

$accountContext
	.on(contextHydrated, (_, context) => context)
	.on(contextPatched, (context, patch) => (context ? { ...context, ...patch } : context))
	.reset(resetContext)

// hydrate store from gate open and subsequent prop updates
sample({
	clock: [AccountContextGate.open, AccountContextGate.state.updates],
	target: contextHydrated,
})

// clear context when account layout unmounts
sample({
	clock: AccountContextGate.close,
	target: resetContext,
})

// bump projects count after a project was created locally
sample({
	clock: projectCreated,
	source: $accountContext,
	filter: (context) => !!context,
	fn: (context) => ({
		projects: updateCount(context!.projects, 1),
	}),
	target: contextPatched,
})

// bump applications count after submitting an application locally
sample({
	clock: applicationSubmitted,
	source: $accountContext,
	filter: (context) => !!context,
	fn: (context) => ({
		applications: updateCount(context!.applications, 1),
	}),
	target: contextPatched,
})

// lower applications count when an active application ends locally
sample({
	clock: [applicationWithdrawn, applicationRejectedObserved],
	source: $accountContext,
	filter: (context) => !!context,
	fn: (context) => ({
		applications: updateCount(context!.applications, -1),
	}),
	target: contextPatched,
})

// bump portfolio works count after adding an item locally
sample({
	clock: portfolioWorkCreated,
	source: $accountContext,
	filter: (context) => !!context,
	fn: (context) => ({
		works: updateCount(context!.works, 1),
	}),
	target: contextPatched,
})

// lower portfolio works count after deleting an item locally
sample({
	clock: portfolioWorkDeleted,
	source: $accountContext,
	filter: (context) => !!context,
	fn: (context) => ({
		works: updateCount(context!.works, -1),
	}),
	target: contextPatched,
})

function updateCount(value: number | undefined, delta: number) {
	if (typeof value !== 'number') return value

	return Math.max(0, value + delta)
}
