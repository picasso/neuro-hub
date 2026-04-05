import Ably from 'ably'
import { requestChatAblyToken } from './api'
import {
	CHAT_ABLY_CHANNEL_PREFIX,
	type ChatConversationReadEvent,
	type ChatMessageCreatedEvent,
	type ChatRealtimeEvent,
} from '@/lib/chat/contracts'

export type ChatRealtimeStatus = 'idle' | 'connecting' | 'connected' | 'error'

type ChatRealtimeParams = {
	conversationId: string
	onEvent: (event: ChatRealtimeEvent) => void
	onStatusChange: (status: ChatRealtimeStatus) => void
}

type ActiveRealtimeSubscription = {
	channel: Ably.RealtimeChannel
	channelName: string
	conversationId: string
	onConnected: () => void
	onFailed: () => void
	onMessageCreated: (message: { data?: unknown }) => void
	onConversationRead: (message: { data?: unknown }) => void
}

let sharedRealtimeClient: Ably.Realtime | null = null
let requestedConversationIdForAuth: string | null = null
let authorizedConversationId: string | null = null
let desiredRealtimeParams: ChatRealtimeParams | null = null
let activeRealtimeSubscription: ActiveRealtimeSubscription | null = null
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
				if (!requestedConversationIdForAuth) {
					throw new Error('Missing conversation id for chat realtime auth')
				}

				const tokenGrant = await requestChatAblyToken(requestedConversationIdForAuth)
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
	conversationId: string,
): Promise<void> {
	requestedConversationIdForAuth = conversationId

	if (authorizedConversationId === conversationId) {
		return
	}

	if (client.connection.state !== 'initialized') {
		await client.auth.authorize()
	}

	authorizedConversationId = conversationId
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

function isConversationReadEvent(value: unknown): value is ChatConversationReadEvent {
	if (!value || typeof value !== 'object') {
		return false
	}

	const event = value as Partial<ChatConversationReadEvent>

	return (
		event.type === 'conversation.read' &&
		typeof event.conversationId === 'string' &&
		!!event.readState
	)
}

function createRealtimeSubscription(
	client: Ably.Realtime,
	params: ChatRealtimeParams,
	reportStatus: (status: ChatRealtimeStatus) => void,
): ActiveRealtimeSubscription {
	const channelName = getConversationChannelName(params.conversationId)
	const channel = client.channels.get(channelName)

	const subscription: ActiveRealtimeSubscription = {
		channel,
		channelName,
		conversationId: params.conversationId,
		onConnected: () => {
			if (
				activeRealtimeSubscription === subscription &&
				desiredRealtimeParams?.conversationId === subscription.conversationId
			) {
				reportStatus('connected')
			}
		},
		onFailed: () => {
			if (
				activeRealtimeSubscription === subscription &&
				desiredRealtimeParams?.conversationId === subscription.conversationId
			) {
				reportStatus('error')
			}
		},
		onMessageCreated: (message) => {
			if (isMessageCreatedEvent(message.data)) {
				params.onEvent(message.data)
			}
		},
		onConversationRead: (message) => {
			if (isConversationReadEvent(message.data)) {
				params.onEvent(message.data)
			}
		},
	}

	return subscription
}

async function teardownRealtimeSubscription(
	client: Ably.Realtime,
	subscription: ActiveRealtimeSubscription | null,
) {
	if (!subscription) {
		return
	}

	subscription.channel.unsubscribe('message.created', subscription.onMessageCreated)
	subscription.channel.unsubscribe('conversation.read', subscription.onConversationRead)
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

	if (activeRealtimeSubscription === subscription) {
		activeRealtimeSubscription = null
	}
}

async function setupDesiredRealtime(params: ChatRealtimeParams) {
	const client = getSharedRealtimeClient()
	const reportStatus = createTransitionStatusReporter(activeRealtimeTransitionId)
	const nextSubscription = createRealtimeSubscription(client, params, reportStatus)

	activeRealtimeSubscription = nextSubscription
	client.connection.on('connected', nextSubscription.onConnected)
	client.connection.on('failed', nextSubscription.onFailed)
	client.connection.on('disconnected', nextSubscription.onFailed)
	client.connection.on('suspended', nextSubscription.onFailed)

	try {
		await ensureRealtimeCapability(client, params.conversationId)
		await ensureRealtimeConnectionReady(client)

		if (desiredRealtimeParams?.conversationId !== params.conversationId) {
			await teardownRealtimeSubscription(client, nextSubscription)
			return
		}

		await nextSubscription.channel.attach()

		if (desiredRealtimeParams?.conversationId !== params.conversationId) {
			await teardownRealtimeSubscription(client, nextSubscription)
			return
		}

		await Promise.all([
			nextSubscription.channel.subscribe(
				'message.created',
				nextSubscription.onMessageCreated,
			),
			nextSubscription.channel.subscribe(
				'conversation.read',
				nextSubscription.onConversationRead,
			),
		])

		if (client.connection.state === 'connected') {
			reportStatus('connected')
		}
	} catch (error) {
		await teardownRealtimeSubscription(client, nextSubscription)

		if (desiredRealtimeParams?.conversationId !== params.conversationId) {
			return
		}

		reportStatus('error')
		throw error
	}
}

async function syncRealtimeToDesiredState(reportStatus: (status: ChatRealtimeStatus) => void) {
	const client = getSharedRealtimeClient()
	const desiredConversationId = desiredRealtimeParams?.conversationId ?? null
	const activeConversationId = activeRealtimeSubscription?.conversationId ?? null

	if (desiredConversationId === activeConversationId) {
		if (!desiredConversationId) {
			reportStatus('idle')
		} else if (client.connection.state === 'connected') {
			reportStatus('connected')
		}
		return
	}

	await teardownRealtimeSubscription(client, activeRealtimeSubscription)

	if (!desiredRealtimeParams) {
		reportStatus('idle')
		return
	}

	await setupDesiredRealtime(desiredRealtimeParams)
}

export async function setActiveConversationRealtime(params: ChatRealtimeParams): Promise<void> {
	realtimeStatusHandler = params.onStatusChange
	const transitionId = ++activeRealtimeTransitionId
	const reportStatus = createTransitionStatusReporter(transitionId)
	desiredRealtimeParams = params
	reportStatus('connecting')
	await enqueueRealtimeTransition(() => syncRealtimeToDesiredState(reportStatus))
}

export async function clearActiveConversationRealtime(): Promise<void> {
	const transitionId = ++activeRealtimeTransitionId
	const reportStatus = createTransitionStatusReporter(transitionId)
	desiredRealtimeParams = null
	await enqueueRealtimeTransition(() => syncRealtimeToDesiredState(reportStatus))
}
