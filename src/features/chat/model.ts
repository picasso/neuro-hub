import { combine, sample } from 'effector'
import { createGate } from 'effector-react'
import {
	fetchChatConversations,
	fetchChatMessages,
	markChatConversationRead,
	sendChatMessage,
	type ChatRequestError,
} from './api'
import {
	appendChatMessage,
	appendOptimisticChatMessage,
	createOptimisticChatMessage,
	getLatestReadableMessageId,
	markOptimisticChatMessageFailed,
	patchConversationReadState,
	patchConversationWithMessage,
	replaceOptimisticChatMessage,
	shouldUseIncomingReadEventAsPeerUpdate,
	sortChatConversations,
	type ChatUiMessage,
} from './helpers'
import {
	clearActiveConversationRealtime,
	setActiveConversationRealtime,
	type ChatRealtimeStatus,
} from './realtime'
import type {
	ChatConversationSummary,
	ChatMessage,
	ChatReadState,
	ChatRealtimeEvent,
} from '@/lib/chat/contracts'
import { createAlertFx } from '@/alerts'
import { createDomainWatched } from '@/lib/logger'

type MessagesMap = Record<string, ChatUiMessage[]>
type CursorMap = Record<string, string | null>
type BooleanMap = Record<string, boolean>
type StringMap = Record<string, string | null>
type ReadStateMap = Record<string, ChatReadState | null>

const domain = createDomainWatched('chat', {
	filter: {
		gate: false,
	},
})

function createChatLocalId() {
	return `chat-local-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

export const ChatGate = createGate<{ conversationId?: string | null }>({
	domain,
	name: 'ChatGate',
})

const resetChatFlow = domain.createEvent('resetChatFlow')
const activeConversationChanged = domain.createEvent<string | null>('activeConversationChanged')
const messageSendRequested = domain.createEvent<{
	conversationId: string
	text: string
	localId: string
}>('messageSendRequested')
const optimisticMessageQueued = domain.createEvent<{
	conversationId: string
	message: ChatUiMessage
}>('optimisticMessageQueued')
const optimisticMessageConfirmed = domain.createEvent<{
	conversationId: string
	localId: string
	message: ChatMessage
}>('optimisticMessageConfirmed')
const optimisticMessageFailed = domain.createEvent<{
	conversationId: string
	localId: string
}>('optimisticMessageFailed')
const conversationReadStateUpdated = domain.createEvent<{
	conversationId: string
	lastReadMessageId: string
	readAt: string
}>('conversationReadStateUpdated')
const conversationMessagePatched = domain.createEvent<{
	conversationId: string
	message: ChatMessage
	incrementUnread?: boolean
	keepUnread?: boolean
}>('conversationMessagePatched')
const localReadSyncRequested = domain.createEvent<{
	conversationId: string
	lastReadMessageId: string
}>('localReadSyncRequested')
const chatRealtimeEventReceived = domain.createEvent<ChatRealtimeEvent>('chatRealtimeEventReceived')
const chatRealtimeStatusUpdated = domain.createEvent<ChatRealtimeStatus>(
	'chatRealtimeStatusUpdated',
)
const peerReadStateTracked = domain.createEvent<ChatReadState>('peerReadStateTracked')

export const chatConversationsRefreshRequested = domain.createEvent(
	'chatConversationsRefreshRequested',
)
export const chatActiveConversationReloadRequested = domain.createEvent(
	'chatActiveConversationReloadRequested',
)
export const chatHistoryLoadRequested = domain.createEvent('chatHistoryLoadRequested')
export const chatMessageSubmitted = domain.createEvent<string>('chatMessageSubmitted')

export const loadChatConversationsFx = domain.createEffect<
	void,
	Awaited<ReturnType<typeof fetchChatConversations>>,
	ChatRequestError
>({
	handler: fetchChatConversations,
	name: 'loadChatConversationsFx',
})

export const loadActiveChatMessagesFx = domain.createEffect<
	{ conversationId: string },
	{ conversationId: string; page: Awaited<ReturnType<typeof fetchChatMessages>> },
	ChatRequestError
>({
	handler: async ({ conversationId }) => ({
		conversationId,
		page: await fetchChatMessages({ conversationId }),
	}),
	name: 'loadActiveChatMessagesFx',
})

export const loadOlderChatMessagesFx = domain.createEffect<
	{ conversationId: string; cursor: string },
	{ conversationId: string; page: Awaited<ReturnType<typeof fetchChatMessages>> },
	ChatRequestError
>({
	handler: async ({ conversationId, cursor }) => ({
		conversationId,
		page: await fetchChatMessages({ conversationId, cursor }),
	}),
	name: 'loadOlderChatMessagesFx',
})

export const sendChatMessageFx = domain.createEffect<
	{ conversationId: string; text: string; localId: string },
	{ conversationId: string; localId: string; message: ChatMessage },
	ChatRequestError
>({
	handler: async ({ conversationId, text, localId }) => ({
		conversationId,
		localId,
		message: await sendChatMessage({ conversationId, text }),
	}),
	name: 'sendChatMessageFx',
})

export const markChatConversationReadFx = domain.createEffect<
	{ conversationId: string; lastReadMessageId: string },
	{ conversationId: string; readState: ChatReadState },
	ChatRequestError
>({
	handler: async ({ conversationId, lastReadMessageId }) => ({
		conversationId,
		readState: await markChatConversationRead({
			conversationId,
			lastReadMessageId,
		}),
	}),
	name: 'markChatConversationReadFx',
})

export const subscribeActiveConversationRealtimeFx = domain.createEffect<
	{ conversationId: string },
	void,
	Error
>({
	handler: async ({ conversationId }) => {
		await setActiveConversationRealtime({
			conversationId,
			onEvent: chatRealtimeEventReceived,
			onStatusChange: chatRealtimeStatusUpdated,
		})
	},
	name: 'subscribeActiveConversationRealtimeFx',
})

export const unsubscribeActiveConversationRealtimeFx = domain.createEffect({
	handler: async () => {
		await clearActiveConversationRealtime()
	},
	name: 'unsubscribeActiveConversationRealtimeFx',
})

export const $conversations = domain.createStore<ChatConversationSummary[]>([], {
	name: '$chatConversations',
})

export const $activeConversationId = domain.createStore<string | null>(null, {
	name: '$activeConversationId',
})

export const $messagesByConversationId = domain.createStore<MessagesMap>(
	{},
	{
		name: '$messagesByConversationId',
	},
)

export const $nextCursorByConversationId = domain.createStore<CursorMap>(
	{},
	{
		name: '$nextCursorByConversationId',
	},
)

export const $hasLoadedMessagesByConversationId = domain.createStore<BooleanMap>(
	{},
	{
		name: '$hasLoadedMessagesByConversationId',
	},
)

export const $pendingReadByConversationId = domain.createStore<StringMap>(
	{},
	{
		name: '$pendingReadByConversationId',
	},
)

export const $peerReadStateByConversationId = domain.createStore<ReadStateMap>(
	{},
	{
		name: '$peerReadStateByConversationId',
	},
)

export const $conversationsError = domain.createStore<string | null>(null, {
	name: '$chatConversationsError',
})

export const $messagesErrorByConversationId = domain.createStore<StringMap>(
	{},
	{
		name: '$messagesErrorByConversationId',
	},
)

export const $realtimeStatus = domain.createStore<ChatRealtimeStatus>('idle', {
	name: '$chatRealtimeStatus',
})

$activeConversationId.reset(resetChatFlow)
$conversations.reset(resetChatFlow)
$messagesByConversationId.reset(resetChatFlow)
$nextCursorByConversationId.reset(resetChatFlow)
$hasLoadedMessagesByConversationId.reset(resetChatFlow)
$pendingReadByConversationId.reset(resetChatFlow)
$peerReadStateByConversationId.reset(resetChatFlow)
$conversationsError.reset(resetChatFlow)
$messagesErrorByConversationId.reset(resetChatFlow)
$realtimeStatus.reset(resetChatFlow)

$activeConversationId.on(activeConversationChanged, (_, conversationId) => conversationId)

$conversations
	.on(loadChatConversationsFx.doneData, (_, result) => sortChatConversations(result.data))
	.on(conversationReadStateUpdated, (conversations, payload) =>
		patchConversationReadState(conversations, payload),
	)
	.on(conversationMessagePatched, (conversations, payload) =>
		patchConversationWithMessage(conversations, {
			conversationId: payload.conversationId,
			message: payload.message,
			incrementUnread: payload.incrementUnread,
			options: {
				keepUnread: payload.keepUnread,
			},
		}),
	)

$messagesByConversationId
	.on(
		loadActiveChatMessagesFx.doneData,
		(messagesByConversationId, { conversationId, page }) => ({
			...messagesByConversationId,
			[conversationId]: page.items.map((message) => ({
				...message,
				status: 'sent' as const,
			})),
		}),
	)
	.on(loadOlderChatMessagesFx.doneData, (messagesByConversationId, { conversationId, page }) => ({
		...messagesByConversationId,
		[conversationId]: mergeOlderMessages(
			messagesByConversationId[conversationId] ?? [],
			page.items,
		),
	}))
	.on(optimisticMessageQueued, (messagesByConversationId, { conversationId, message }) => ({
		...messagesByConversationId,
		[conversationId]: appendOptimisticChatMessage(
			messagesByConversationId[conversationId] ?? [],
			message,
		),
	}))
	.on(
		optimisticMessageConfirmed,
		(messagesByConversationId, { conversationId, localId, message }) => ({
			...messagesByConversationId,
			[conversationId]: replaceOptimisticChatMessage(
				messagesByConversationId[conversationId] ?? [],
				{
					localId,
					message,
				},
			),
		}),
	)
	.on(optimisticMessageFailed, (messagesByConversationId, { conversationId, localId }) => ({
		...messagesByConversationId,
		[conversationId]: markOptimisticChatMessageFailed(
			messagesByConversationId[conversationId] ?? [],
			localId,
		),
	}))
	.on(chatRealtimeEventReceived, (messagesByConversationId, event) => {
		if (event.type !== 'message.created') {
			return messagesByConversationId
		}

		return {
			...messagesByConversationId,
			[event.conversationId]: appendChatMessage(
				messagesByConversationId[event.conversationId] ?? [],
				event.message,
			),
		}
	})

$nextCursorByConversationId
	.on(loadActiveChatMessagesFx.doneData, (cursorByConversationId, { conversationId, page }) => ({
		...cursorByConversationId,
		[conversationId]: page.nextCursor,
	}))
	.on(loadOlderChatMessagesFx.doneData, (cursorByConversationId, { conversationId, page }) => ({
		...cursorByConversationId,
		[conversationId]: page.nextCursor,
	}))

$hasLoadedMessagesByConversationId
	.on(loadActiveChatMessagesFx.doneData, (loadedByConversationId, { conversationId }) => ({
		...loadedByConversationId,
		[conversationId]: true,
	}))
	.on(loadOlderChatMessagesFx.doneData, (loadedByConversationId, { conversationId }) => ({
		...loadedByConversationId,
		[conversationId]: true,
	}))

$pendingReadByConversationId
	.on(
		localReadSyncRequested,
		(pendingByConversationId, { conversationId, lastReadMessageId }) => ({
			...pendingByConversationId,
			[conversationId]: lastReadMessageId,
		}),
	)
	.on(markChatConversationReadFx.finally, (pendingByConversationId, { params }) => ({
		...pendingByConversationId,
		[params.conversationId]: null,
	}))

$peerReadStateByConversationId.on(
	peerReadStateTracked,
	(peerReadStateByConversationId, readState) => ({
		...peerReadStateByConversationId,
		[readState.conversationId]: readState,
	}),
)

$conversationsError
	.on(loadChatConversationsFx, () => null)
	.on(loadChatConversationsFx.done, () => null)
	.on(loadChatConversationsFx.failData, (_, error) => error.message)

$messagesErrorByConversationId
	.on(activeConversationChanged, (messagesErrorByConversationId, conversationId) =>
		conversationId
			? {
					...messagesErrorByConversationId,
					[conversationId]: null,
				}
			: messagesErrorByConversationId,
	)
	.on(loadActiveChatMessagesFx, (messagesErrorByConversationId, { conversationId }) => ({
		...messagesErrorByConversationId,
		[conversationId]: null,
	}))
	.on(loadActiveChatMessagesFx.fail, (messagesErrorByConversationId, { params, error }) => ({
		...messagesErrorByConversationId,
		[params.conversationId]: error.message,
	}))
	.on(loadOlderChatMessagesFx.fail, (messagesErrorByConversationId, { params, error }) => ({
		...messagesErrorByConversationId,
		[params.conversationId]: error.message,
	}))

$realtimeStatus.on(chatRealtimeStatusUpdated, (_, status) => status)

export const $activeConversation = combine(
	$conversations,
	$activeConversationId,
	(conversations, activeConversationId) =>
		conversations.find((conversation) => conversation.id === activeConversationId) ?? null,
)

export const $activeMessages = combine(
	$messagesByConversationId,
	$activeConversationId,
	(messagesByConversationId, activeConversationId) =>
		(activeConversationId ? messagesByConversationId[activeConversationId] : null) ?? [],
)

export const $activeNextCursor = combine(
	$nextCursorByConversationId,
	$activeConversationId,
	(cursorByConversationId, activeConversationId) =>
		(activeConversationId ? cursorByConversationId[activeConversationId] : null) ?? null,
)

export const $activeMessagesError = combine(
	$messagesErrorByConversationId,
	$activeConversationId,
	(messagesErrorByConversationId, activeConversationId) =>
		(activeConversationId ? messagesErrorByConversationId[activeConversationId] : null) ?? null,
)

export const $hasLoadedActiveMessages = combine(
	$hasLoadedMessagesByConversationId,
	$activeConversationId,
	(loadedByConversationId, activeConversationId) =>
		(activeConversationId ? loadedByConversationId[activeConversationId] : false) ?? false,
)

export const $unreadConversationsCount = $conversations.map(
	(conversations) => conversations.filter((conversation) => conversation.unreadCount > 0).length,
)

sample({
	clock: [ChatGate.open, ChatGate.state.updates],
	source: {
		gate: ChatGate.state,
		activeConversationId: $activeConversationId,
	},
	filter: ({ gate, activeConversationId }) =>
		(gate.conversationId ?? null) !== activeConversationId,
	fn: ({ gate }) => gate.conversationId ?? null,
	target: activeConversationChanged,
})

sample({
	clock: [chatConversationsRefreshRequested, ChatGate.open],
	fn: () => undefined,
	target: loadChatConversationsFx,
})

sample({
	clock: activeConversationChanged,
	filter: (conversationId) => !!conversationId,
	fn: (conversationId) => ({
		conversationId: conversationId as string,
	}),
	target: [loadActiveChatMessagesFx, subscribeActiveConversationRealtimeFx],
})

sample({
	clock: activeConversationChanged,
	filter: (conversationId) => !conversationId,
	fn: () => undefined,
	target: unsubscribeActiveConversationRealtimeFx,
})

sample({
	clock: chatActiveConversationReloadRequested,
	source: $activeConversationId,
	filter: (conversationId) => !!conversationId,
	fn: (conversationId) => ({
		conversationId: conversationId as string,
	}),
	target: [loadActiveChatMessagesFx, subscribeActiveConversationRealtimeFx],
})

sample({
	clock: chatActiveConversationReloadRequested,
	fn: () => undefined,
	target: loadChatConversationsFx,
})

sample({
	clock: chatHistoryLoadRequested,
	source: {
		conversationId: $activeConversationId,
		nextCursor: $activeNextCursor,
	},
	filter: ({ conversationId, nextCursor }) => !!conversationId && !!nextCursor,
	fn: ({ conversationId, nextCursor }) => ({
		conversationId: conversationId as string,
		cursor: nextCursor as string,
	}),
	target: loadOlderChatMessagesFx,
})

sample({
	clock: chatMessageSubmitted,
	source: $activeConversationId,
	filter: (conversationId, text) => !!conversationId && text.trim().length > 0,
	fn: (conversationId, text) => ({
		conversationId: conversationId as string,
		text: text.trim(),
		localId: createChatLocalId(),
	}),
	target: messageSendRequested,
})

sample({
	clock: messageSendRequested,
	fn: ({ conversationId, text, localId }) => ({
		conversationId,
		message: createOptimisticChatMessage({
			conversationId,
			text,
			senderId: 'self',
			localId,
		}),
	}),
	target: optimisticMessageQueued,
})

sample({
	clock: messageSendRequested,
	target: sendChatMessageFx,
})

sample({
	clock: sendChatMessageFx.doneData,
	fn: ({ conversationId, localId, message }) => ({
		conversationId,
		localId,
		message,
	}),
	target: optimisticMessageConfirmed,
})

sample({
	clock: sendChatMessageFx.doneData,
	fn: ({ conversationId, message }) => ({
		conversationId,
		message,
		keepUnread: true,
	}),
	target: conversationMessagePatched,
})

sample({
	clock: sendChatMessageFx.fail,
	fn: ({ params }) => ({
		conversationId: params.conversationId,
		localId: params.localId,
	}),
	target: optimisticMessageFailed,
})

sample({
	clock: sendChatMessageFx.failData,
	fn: (error) =>
		createAlertFx.props({
			severity: 'error',
			title: 'Не удалось отправить сообщение',
			message: error.message ?? 'Попробуйте отправить сообщение ещё раз',
			disableAutoClose: true,
		}),
	target: createAlertFx,
})

sample({
	clock: loadChatConversationsFx.failData,
	fn: (error) =>
		createAlertFx.props({
			severity: 'error',
			title: 'Не удалось загрузить диалоги',
			message: error.message ?? 'Попробуйте обновить список позже',
			disableAutoClose: true,
		}),
	target: createAlertFx,
})

sample({
	clock: loadActiveChatMessagesFx.failData,
	fn: (error) =>
		createAlertFx.props({
			severity: 'error',
			title: 'Не удалось загрузить историю сообщений',
			message: error.message ?? 'Попробуйте открыть диалог ещё раз',
			disableAutoClose: true,
		}),
	target: createAlertFx,
})

sample({
	clock: subscribeActiveConversationRealtimeFx.failData,
	fn: (error) =>
		createAlertFx.props({
			severity: 'error',
			title: 'Realtime-соединение не установлено',
			message:
				error.message ?? 'Сообщения будут обновляться после повторного открытия диалога',
			disableAutoClose: true,
		}),
	target: createAlertFx,
})

sample({
	clock: chatRealtimeEventReceived,
	source: $activeConversationId,
	filter: (_, event) => event.type === 'message.created',
	fn: (activeConversationId, event) => ({
		conversationId: event.conversationId,
		message: (event as Extract<ChatRealtimeEvent, { type: 'message.created' }>).message,
		incrementUnread: activeConversationId !== event.conversationId,
		keepUnread: activeConversationId === event.conversationId,
	}),
	target: conversationMessagePatched,
})

sample({
	clock: chatRealtimeEventReceived,
	source: $pendingReadByConversationId,
	filter: (pendingReadByConversationId, event) =>
		event.type === 'conversation.read' &&
		shouldUseIncomingReadEventAsPeerUpdate({
			event: event as Extract<ChatRealtimeEvent, { type: 'conversation.read' }>,
			pendingReadMessageId: pendingReadByConversationId[event.conversationId],
		}),
	fn: (_, event) =>
		(event as Extract<ChatRealtimeEvent, { type: 'conversation.read' }>).readState,
	target: peerReadStateTracked,
})

sample({
	clock: [
		loadActiveChatMessagesFx.doneData,
		loadChatConversationsFx.doneData,
		chatRealtimeEventReceived,
	],
	source: {
		activeConversation: $activeConversation,
		activeConversationId: $activeConversationId,
		activeMessages: $activeMessages,
		pendingReadByConversationId: $pendingReadByConversationId,
	},
	filter: ({
		activeConversation,
		activeConversationId,
		activeMessages,
		pendingReadByConversationId,
	}) => {
		if (!activeConversationId) {
			return false
		}

		return Boolean(
			getLatestReadableMessageId({
				conversation: activeConversation,
				messages: activeMessages,
				pendingReadMessageId: pendingReadByConversationId[activeConversationId],
			}),
		)
	},
	fn: ({
		activeConversation,
		activeConversationId,
		activeMessages,
		pendingReadByConversationId,
	}) => ({
		conversationId: activeConversationId as string,
		lastReadMessageId: getLatestReadableMessageId({
			conversation: activeConversation,
			messages: activeMessages,
			pendingReadMessageId: pendingReadByConversationId[activeConversationId as string],
		}) as string,
	}),
	target: localReadSyncRequested,
})

sample({
	clock: localReadSyncRequested,
	target: markChatConversationReadFx,
})

sample({
	clock: markChatConversationReadFx.doneData,
	fn: ({ conversationId, readState }) => ({
		conversationId,
		lastReadMessageId: readState.lastReadMessageId,
		readAt: readState.readAt,
	}),
	target: conversationReadStateUpdated,
})

sample({
	clock: ChatGate.close,
	fn: () => undefined,
	target: [resetChatFlow, unsubscribeActiveConversationRealtimeFx],
})

function mergeOlderMessages(currentMessages: ChatUiMessage[], olderMessages: ChatMessage[]) {
	return olderMessages.reduce(
		(messages, message) => appendChatMessage(messages, message),
		currentMessages,
	)
}
