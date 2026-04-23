import { sample } from 'effector'
import { createGate } from 'effector-react'
import { produce } from 'immer'
import type { AccountSnapshot, AccountViewer, AuthHeaderState } from '@/lib/account'
import { authHeaderDomain as domain } from '@/lib/logger'

export const AuthHeaderGate = createGate<AuthHeaderState>({
	domain,
	name: 'AuthHeaderGate',
})

export const clearAuthHeader = domain.createEvent('clearAuthHeader')
export const authHeaderHydrated = domain.createEvent<AuthHeaderState>('authHeaderHydrated')
export const authHeaderViewerPatched =
	domain.createEvent<Partial<AccountViewer>>('authHeaderViewerPatched')
export const authHeaderSnapshotPatched = domain.createEvent<Partial<AccountSnapshot>>(
	'authHeaderSnapshotPatched',
)
export const authHeaderUnreadMessagesPatched = domain.createEvent<number>(
	'authHeaderUnreadMessagesPatched',
)

export const $authHeaderState = domain.createStore<AuthHeaderState | null>(null, {
	name: '$authHeaderState',
})
export const $authHeaderViewer = $authHeaderState.map((state) => state?.viewer ?? null)
export const $authHeaderSnapshot = $authHeaderState.map((state) => state?.snapshot ?? null)
export const $authHeaderUnreadMessages = $authHeaderState.map(
	(state) => state?.snapshot?.messages ?? 0,
)

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
	.on(authHeaderSnapshotPatched, (state, patch) =>
		state
			? produce(state, (draft) => {
					draft.snapshot = {
						...draft.snapshot,
						...patch,
					}
				})
			: state,
	)
	.on(authHeaderUnreadMessagesPatched, (state, unreadMessages) =>
		state
			? produce(state, (draft) => {
					draft.snapshot.messages = unreadMessages
				})
			: state,
	)
	.reset(clearAuthHeader)

// hydrate the shared authenticated header state from shell props
sample({
	clock: [AuthHeaderGate.open, AuthHeaderGate.state.updates],
	target: authHeaderHydrated,
})

// clear the shared authenticated header state when its gate unmounts
sample({
	clock: AuthHeaderGate.close,
	target: clearAuthHeader,
})
