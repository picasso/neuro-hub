import Ably from 'ably'
import {
	CHAT_ABLY_CHANNEL_PREFIX,
	CHAT_ABLY_EVENT_NAMES,
	CHAT_ABLY_USER_CHANNEL_PREFIX,
	type ChatAblyTokenGrant,
	type ChatConversationSummary,
	type ChatConversationSummaryEvent,
	type ChatMessage,
	type ChatMessageCreatedEvent,
	type ChatPeerMessageReadEvent,
	type ChatReadState,
} from './contracts'
import { createChatAblyTokenForbiddenError } from './errors'
import { AppError } from '@/utils/errors'

const DEFAULT_ABLY_TOKEN_TTL_MS = 60 * 60 * 1000

let ablyClient: Ably.Rest | null = null

function getAblyApiKey() {
	const apiKey = process.env.ABLY_API_KEY

	if (!apiKey) {
		throw new AppError('Ably is not configured', 500, 'INTERNAL_ERROR')
	}

	return apiKey
}

function getAblyClient() {
	if (!ablyClient) {
		ablyClient = new Ably.Rest({
			key: getAblyApiKey(),
		})
	}

	return ablyClient
}

export function getChatAblyChannelName(conversationId: string) {
	return `${CHAT_ABLY_CHANNEL_PREFIX}${conversationId}`
}

export function getChatAblyUserChannelName(userId: string) {
	return `${CHAT_ABLY_USER_CHANNEL_PREFIX}${userId}`
}

function createChatAblyCapability(channelNames: string[]) {
	const capability: Record<string, string[]> = {}

	for (const name of channelNames) {
		capability[name] = ['subscribe']
	}

	return JSON.stringify(capability)
}

export async function issueChatAblyToken(params: {
	clientId: string
	conversationId?: string | null
}): Promise<ChatAblyTokenGrant> {
	const { clientId, conversationId } = params
	const inboxChannelName = getChatAblyUserChannelName(clientId)
	const channelNames: string[] = [inboxChannelName]
	let conversationChannelName: string | null = null

	if (conversationId) {
		conversationChannelName = getChatAblyChannelName(conversationId)
		channelNames.push(conversationChannelName)
	}

	const capability = createChatAblyCapability(channelNames)
	const ttl = Number(process.env.ABLY_TOKEN_TTL_MS ?? DEFAULT_ABLY_TOKEN_TTL_MS)

	if (!clientId) {
		throw createChatAblyTokenForbiddenError()
	}

	const tokenRequest = await getAblyClient().auth.createTokenRequest({
		clientId,
		capability,
		ttl,
	})

	return {
		inboxChannelName,
		conversationChannelName,
		mode: 'subscribe',
		capability,
		tokenRequest: {
			keyName: requireAblyField(tokenRequest.keyName, 'keyName'),
			clientId: requireAblyField(tokenRequest.clientId, 'clientId'),
			ttl: requireAblyField(tokenRequest.ttl, 'ttl'),
			capability: requireAblyField(tokenRequest.capability, 'capability'),
			timestamp: requireAblyField(tokenRequest.timestamp, 'timestamp'),
			nonce: requireAblyField(tokenRequest.nonce, 'nonce'),
			mac: requireAblyField(tokenRequest.mac, 'mac'),
		},
	}
}

export async function publishChatMessageCreatedEvent(params: {
	conversationId: string
	message: ChatMessage
}) {
	const payload: ChatMessageCreatedEvent = {
		type: CHAT_ABLY_EVENT_NAMES[0],
		conversationId: params.conversationId,
		message: params.message,
	}

	await getAblyClient()
		.channels.get(getChatAblyChannelName(params.conversationId))
		.publish(payload.type, payload)
}

export async function publishChatPeerMessageReadEvent(params: {
	conversationId: string
	readerId: string
	readState: ChatReadState
}) {
	const payload: ChatPeerMessageReadEvent = {
		type: CHAT_ABLY_EVENT_NAMES[1],
		conversationId: params.conversationId,
		readerId: params.readerId,
		readState: params.readState,
	}

	await getAblyClient()
		.channels.get(getChatAblyChannelName(params.conversationId))
		.publish(payload.type, payload)
}

export async function publishChatConversationSummaryEvent(params: {
	userId: string
	summary: ChatConversationSummary
	totalUnreadMessages: number
}) {
	const payload: ChatConversationSummaryEvent = {
		type: CHAT_ABLY_EVENT_NAMES[2],
		summary: params.summary,
		totalUnreadMessages: params.totalUnreadMessages,
	}

	await getAblyClient()
		.channels.get(getChatAblyUserChannelName(params.userId))
		.publish(payload.type, payload)
}

function requireAblyField<T>(value: T | undefined, fieldName: string): T {
	if (value === undefined) {
		throw new AppError(`Ably token request is missing ${fieldName}`, 500, 'INTERNAL_ERROR')
	}

	return value
}

export type { ChatMessageCreatedEvent, ChatPeerMessageReadEvent, ChatConversationSummaryEvent }
