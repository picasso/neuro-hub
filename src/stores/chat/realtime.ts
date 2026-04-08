import Ably from 'ably'
import { requestChatAblyToken } from './api'
import {
	CHAT_ABLY_CHANNEL_PREFIX,
	type ChatAblyTokenGrant,
	type ChatConversationSummaryEvent,
	type ChatMessageCreatedEvent,
	type ChatPeerMessageReadEvent,
} from '@/lib/chat/contracts'

export type ChatRealtimeStatus = 'idle' | 'connecting' | 'connected' | 'error'

type ChatRealtimeParams = {
	conversationId: string | null
	onConversationEvent: (event: ChatMessageCreatedEvent | ChatPeerMessageReadEvent) => void
	onInboxSummary: (event: ChatConversationSummaryEvent) => void
	onStatusChange: (status: ChatRealtimeStatus) => void
}

type ActiveInboxSubscription = {
	channel: Ably.RealtimeChannel
	channelName: string
	onSummary: (message: { data?: unknown }) => void
}

type ActiveConversationSubscription = {
	channel: Ably.RealtimeChannel
	channelName: string
	conversationId: string
	onConnected: () => void
	onFailed: () => void
	onMessageCreated: (message: { data?: unknown }) => void
	onPeerMessageRead: (message: { data?: unknown }) => void
}

let sharedRealtimeClient: Ably.Realtime | null = null
let requestedConversationIdForAuth: string | null = null
let authorizedAuthConversationKey: string | null = null
let lastIssuedChatGrant: ChatAblyTokenGrant | null = null
let desiredRealtimeParams: ChatRealtimeParams | null = null
let activeInboxSubscription: ActiveInboxSubscription | null = null
let activeConversationSubscription: ActiveConversationSubscription | null = null
let activeRealtimeTransitionId = 0
let realtimeTransitionChain: Promise<void> = Promise.resolve()
let realtimeStatusHandler: ChatRealtimeParams['onStatusChange'] | null = null

function getSharedRealtimeClient() {
	if (sharedRealtimeClient) {
		return sharedRealtimeClient
	}

	sharedRealtimeClient = new Ably.Realtime({
		autoConnect: false,
		closeOnUnload: true,
		authCallback: async (_, callback) => {
			try {
				const tokenGrant = await requestChatAblyToken(requestedConversationIdForAuth)
				lastIssuedChatGrant = tokenGrant
				callback(null, tokenGrant.tokenRequest)
			} catch (error) {
				callback(
					error instanceof Error
						? error.message
						: 'Failed to authorize chat realtime connection',
					null,
				)
			}
		},
	})

	return sharedRealtimeClient
}

async function ensureRealtimeCapability(
	client: Ably.Realtime,
	conversationId: string | null,
): Promise<void> {
	requestedConversationIdForAuth = conversationId
	const nextKey = conversationId ?? '__inbox_only__'

	if (authorizedAuthConversationKey === nextKey) {
		return
	}

	if (client.connection.state !== 'initialized') {
		await client.auth.authorize()
	}

	authorizedAuthConversationKey = nextKey
}

function requireLastInboxChannelName(): string {
	const inboxChannelName = lastIssuedChatGrant?.inboxChannelName

	if (!inboxChannelName) {
		throw new Error('Missing inbox channel name from chat Ably grant')
	}

	return inboxChannelName
}

async function ensureRealtimeConnectionReady(client: Ably.Realtime): Promise<void> {
	if (client.connection.state === 'connected') {
		return
	}

	await new Promise<void>((resolve, reject) => {
		const onConnected = () => {
			cleanup()
			resolve()
		}

		const onFailed = () => {
			cleanup()
			reject(new Error('Chat realtime connection failed'))
		}

		const cleanup = () => {
			client.connection.off('connected', onConnected)
			client.connection.off('failed', onFailed)
			client.connection.off('suspended', onFailed)
		}

		client.connection.on('connected', onConnected)
		client.connection.on('failed', onFailed)
		client.connection.on('suspended', onFailed)
		client.connect()
	})
}

function createTransitionStatusReporter(transitionId: number) {
	return (status: ChatRealtimeStatus) => {
		if (activeRealtimeTransitionId !== transitionId) {
			return
		}

		realtimeStatusHandler?.(status)
	}
}

function enqueueRealtimeTransition(task: () => Promise<void>) {
	const run = realtimeTransitionChain.then(task, task)
	realtimeTransitionChain = run.catch(() => undefined)
	return run
}

function getConversationChannelName(conversationId: string) {
	return `${CHAT_ABLY_CHANNEL_PREFIX}${conversationId}`
}

function isMessageCreatedEvent(value: unknown): value is ChatMessageCreatedEvent {
	if (!value || typeof value !== 'object') {
		return false
	}

	const event = value as Partial<ChatMessageCreatedEvent>

	return (
		event.type === 'message.created' &&
		typeof event.conversationId === 'string' &&
		!!event.message
	)
}

function isPeerMessageReadEvent(value: unknown): value is ChatPeerMessageReadEvent {
	if (!value || typeof value !== 'object') {
		return false
	}

	const event = value as Partial<ChatPeerMessageReadEvent>

	return (
		event.type === 'peer.message.read' &&
		typeof event.conversationId === 'string' &&
		typeof event.readerId === 'string' &&
		!!event.readState
	)
}

function isConversationSummaryEvent(value: unknown): value is ChatConversationSummaryEvent {
	if (!value || typeof value !== 'object') {
		return false
	}

	const event = value as Partial<ChatConversationSummaryEvent>

	return (
		event.type === 'conversation.summary' &&
		!!event.summary &&
		typeof event.totalUnreadMessages === 'number'
	)
}

function createInboxSubscription(
	client: Ably.Realtime,
	inboxChannelName: string,
): ActiveInboxSubscription {
	const channel = client.channels.get(inboxChannelName)

	const subscription: ActiveInboxSubscription = {
		channel,
		channelName: inboxChannelName,
		onSummary: (message) => {
			if (isConversationSummaryEvent(message.data)) {
				desiredRealtimeParams?.onInboxSummary(message.data)
			}
		},
	}

	return subscription
}

function createConversationSubscription(
	client: Ably.Realtime,
	conversationId: string,
	reportStatus: (status: ChatRealtimeStatus) => void,
): ActiveConversationSubscription {
	const channelName = getConversationChannelName(conversationId)
	const channel = client.channels.get(channelName)

	const subscription: ActiveConversationSubscription = {
		channel,
		channelName,
		conversationId,
		onConnected: () => {
			if (
				activeConversationSubscription === subscription &&
				desiredRealtimeParams?.conversationId === subscription.conversationId
			) {
				reportStatus('connected')
			}
		},
		onFailed: () => {
			if (
				activeConversationSubscription === subscription &&
				desiredRealtimeParams?.conversationId === subscription.conversationId
			) {
				reportStatus('error')
			}
		},
		onMessageCreated: (message) => {
			if (isMessageCreatedEvent(message.data)) {
				desiredRealtimeParams?.onConversationEvent(message.data)
			}
		},
		onPeerMessageRead: (message) => {
			if (isPeerMessageReadEvent(message.data)) {
				desiredRealtimeParams?.onConversationEvent(message.data)
			}
		},
	}

	return subscription
}

async function teardownInboxSubscription(
	client: Ably.Realtime,
	subscription: ActiveInboxSubscription | null,
) {
	if (!subscription) {
		return
	}

	subscription.channel.unsubscribe('conversation.summary', subscription.onSummary)

	try {
		await subscription.channel.detach()
	} catch {
		// ignore stale detach races
	} finally {
		client.channels.release(subscription.channelName)
	}

	if (activeInboxSubscription === subscription) {
		activeInboxSubscription = null
	}
}

async function teardownConversationSubscription(
	client: Ably.Realtime,
	subscription: ActiveConversationSubscription | null,
) {
	if (!subscription) {
		return
	}

	subscription.channel.unsubscribe('message.created', subscription.onMessageCreated)
	subscription.channel.unsubscribe('peer.message.read', subscription.onPeerMessageRead)
	client.connection.off('connected', subscription.onConnected)
	client.connection.off('failed', subscription.onFailed)
	client.connection.off('disconnected', subscription.onFailed)
	client.connection.off('suspended', subscription.onFailed)

	try {
		await subscription.channel.detach()
	} catch {
		// ignore stale detach/attach races during serialized cleanup
	} finally {
		client.channels.release(subscription.channelName)
	}

	if (activeConversationSubscription === subscription) {
		activeConversationSubscription = null
	}
}

async function setupDesiredRealtime(params: ChatRealtimeParams) {
	const client = getSharedRealtimeClient()
	const reportStatus = createTransitionStatusReporter(activeRealtimeTransitionId)

	try {
		await ensureRealtimeCapability(client, params.conversationId)
		await ensureRealtimeConnectionReady(client)

		if (desiredRealtimeParams !== params) {
			return
		}

		const inboxChannelName = requireLastInboxChannelName()
		const inboxSubscription = createInboxSubscription(client, inboxChannelName)

		activeInboxSubscription = inboxSubscription

		if (desiredRealtimeParams !== params) {
			await teardownInboxSubscription(client, inboxSubscription)
			return
		}

		await inboxSubscription.channel.attach()

		if (desiredRealtimeParams !== params) {
			await teardownInboxSubscription(client, inboxSubscription)
			return
		}

		await inboxSubscription.channel.subscribe(
			'conversation.summary',
			inboxSubscription.onSummary,
		)

		if (!params.conversationId) {
			if (client.connection.state === 'connected') {
				reportStatus('connected')
			}
			return
		}

		const nextConversationSubscription = createConversationSubscription(
			client,
			params.conversationId,
			reportStatus,
		)

		activeConversationSubscription = nextConversationSubscription
		client.connection.on('connected', nextConversationSubscription.onConnected)
		client.connection.on('failed', nextConversationSubscription.onFailed)
		client.connection.on('disconnected', nextConversationSubscription.onFailed)
		client.connection.on('suspended', nextConversationSubscription.onFailed)

		await nextConversationSubscription.channel.attach()

		if (desiredRealtimeParams !== params) {
			await teardownConversationSubscription(client, nextConversationSubscription)
			return
		}

		await Promise.all([
			nextConversationSubscription.channel.subscribe(
				'message.created',
				nextConversationSubscription.onMessageCreated,
			),
			nextConversationSubscription.channel.subscribe(
				'peer.message.read',
				nextConversationSubscription.onPeerMessageRead,
			),
		])

		if (client.connection.state === 'connected') {
			reportStatus('connected')
		}
	} catch (error) {
		await teardownInboxSubscription(client, activeInboxSubscription)
		await teardownConversationSubscription(client, activeConversationSubscription)

		if (desiredRealtimeParams !== params) {
			return
		}

		reportStatus('error')
		throw error
	}
}

async function syncRealtimeToDesiredState(reportStatus: (status: ChatRealtimeStatus) => void) {
	const client = getSharedRealtimeClient()

	if (!desiredRealtimeParams) {
		await teardownConversationSubscription(client, activeConversationSubscription)
		await teardownInboxSubscription(client, activeInboxSubscription)
		authorizedAuthConversationKey = null
		reportStatus('idle')
		return
	}

	const desiredConversationId = desiredRealtimeParams.conversationId
	const activeConversationId = activeConversationSubscription?.conversationId ?? null

	// subscription callbacks dispatch through desiredRealtimeParams, so matching scopes can reuse them
	if (desiredConversationId === activeConversationId && activeInboxSubscription) {
		if (client.connection.state === 'connected') {
			reportStatus('connected')
		}
		return
	}

	await teardownConversationSubscription(client, activeConversationSubscription)
	await teardownInboxSubscription(client, activeInboxSubscription)
	authorizedAuthConversationKey = null

	await setupDesiredRealtime(desiredRealtimeParams)
}

export async function setChatRealtimeSubscription(params: ChatRealtimeParams): Promise<void> {
	realtimeStatusHandler = params.onStatusChange
	const transitionId = ++activeRealtimeTransitionId
	const reportStatus = createTransitionStatusReporter(transitionId)
	desiredRealtimeParams = params
	reportStatus('connecting')
	await enqueueRealtimeTransition(() => syncRealtimeToDesiredState(reportStatus))
}

export async function clearChatRealtimeSubscription(): Promise<void> {
	const transitionId = ++activeRealtimeTransitionId
	const reportStatus = createTransitionStatusReporter(transitionId)
	desiredRealtimeParams = null
	await enqueueRealtimeTransition(() => syncRealtimeToDesiredState(reportStatus))
}
