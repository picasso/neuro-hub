import Ably from 'ably'
import {
	CHAT_ABLY_CHANNEL_PREFIX,
	CHAT_ABLY_EVENT_NAMES,
	type ChatAblyTokenGrant,
	type ChatConversationReadEvent,
	type ChatMessageCreatedEvent,
} from './contracts'
import { createChatAblyTokenForbiddenError } from './errors'
import type { ChatReadState, ChatMessage } from '@/lib/chat/contracts'
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

function createChatAblyCapability(channelName: string) {
	return JSON.stringify({
		[channelName]: ['subscribe'],
	})
}

export async function issueChatAblyToken(params: {
	clientId: string
	conversationId: string
}): Promise<ChatAblyTokenGrant> {
	const { clientId, conversationId } = params
	const channelName = getChatAblyChannelName(conversationId)
	const capability = createChatAblyCapability(channelName)
	const ttl = Number(process.env.ABLY_TOKEN_TTL_MS ?? DEFAULT_ABLY_TOKEN_TTL_MS)

	if (!clientId || !conversationId) {
		throw createChatAblyTokenForbiddenError()
	}

	const tokenRequest = await getAblyClient().auth.createTokenRequest({
		clientId,
		capability,
		ttl,
	})

	return {
		channelName,
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

export async function publishChatConversationReadEvent(params: {
	conversationId: string
	readState: ChatReadState
}) {
	const payload: ChatConversationReadEvent = {
		type: CHAT_ABLY_EVENT_NAMES[1],
		conversationId: params.conversationId,
		readState: params.readState,
	}

	await getAblyClient()
		.channels.get(getChatAblyChannelName(params.conversationId))
		.publish(payload.type, payload)
}

function requireAblyField<T>(value: T | undefined, fieldName: string): T {
	if (value === undefined) {
		throw new AppError(`Ably token request is missing ${fieldName}`, 500, 'INTERNAL_ERROR')
	}

	return value
}

export type { ChatMessageCreatedEvent, ChatConversationReadEvent }
