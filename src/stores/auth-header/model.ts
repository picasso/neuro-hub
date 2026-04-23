import { sample } from 'effector'
import { createGate } from 'effector-react'
import { produce } from 'immer'
import type { AuthHeaderState, AccountViewer } from '@/lib/account'
import { authHeaderDomain as domain } from '@/lib/logger'

export const AuthHeaderGate = createGate<AuthHeaderState>({
	domain,
	name: 'AuthHeaderGate',
})

export const clearAuthHeader = domain.createEvent('clearAuthHeader')
export const authHeaderHydrated = domain.createEvent<AuthHeaderState>('authHeaderHydrated')
export const authHeaderViewerPatched =
	domain.createEvent<Partial<AccountViewer>>('authHeaderViewerPatched')
export const authHeaderUnreadMessagesPatched = domain.createEvent<number>(
	'authHeaderUnreadMessagesPatched',
)

export const $authHeaderState = domain.createStore<AuthHeaderState | null>(null, {
	name: '$authHeaderState',
})
export const $authHeaderViewer = $authHeaderState.map((state) => state?.viewer ?? null)
export const $authHeaderUnreadMessages = $authHeaderState.map((state) => state?.unreadMessages ?? 0)

$authHeaderState
	.on(authHeaderHydrated, (_, state) => state)
	.on(authHeaderViewerPatched, (state, patch) =>
		state
			? produce(state, (draft) => {
					draft.viewer = {
						...draft.viewer,
						...patch,
					}
				})
			: state,
	)
	.on(authHeaderUnreadMessagesPatched, (state, unreadMessages) =>
		state
			? {
					...state,
					unreadMessages,
				}
			: state,
	)
	.reset(clearAuthHeader)

// hydrate the shared authenticated header state from shell props
sample({
	clock: [AuthHeaderGate.open, AuthHeaderGate.state.updates],
	target: authHeaderHydrated,
})
