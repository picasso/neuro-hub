import {
	issueChatAblyToken,
	publishChatConversationReadEvent,
	publishChatMessageCreatedEvent,
} from './ably'
import type {
	ChatConversationListQueryInput,
	ChatCreateConversationInput,
	ChatMarkReadInput,
	ChatMessageListQueryInput,
	ChatSendMessageInput,
} from '@/lib/validations'
import {
	ensureConversationAccess,
	listConversationsForUser,
	listMessagesForUser,
	markConversationReadForUser,
	openOrCreateConversationForClient,
	sendMessageInConversation,
} from '@/lib/db/queries/chat'

export async function openOrCreateChatConversation(params: {
	clientId: string
	input: ChatCreateConversationInput
}) {
	return openOrCreateConversationForClient(params)
}

export async function listChatConversations(params: {
	userId: string
	input: ChatConversationListQueryInput
}) {
	return listConversationsForUser(params)
}

export async function listChatMessages(params: {
	userId: string
	conversationId: string
	input: ChatMessageListQueryInput
}) {
	return listMessagesForUser(params)
}

export async function sendChatMessage(params: {
	userId: string
	conversationId: string
	input: ChatSendMessageInput
}) {
	const message = await sendMessageInConversation(params)

	try {
		await publishChatMessageCreatedEvent({
			conversationId: params.conversationId,
			message,
		})
	} catch (error) {
		console.error('Failed to publish chat message event', error)
	}

	return message
}

export async function markChatConversationRead(params: {
	userId: string
	conversationId: string
	input: ChatMarkReadInput
}) {
	const result = await markConversationReadForUser(params)

	if (result.changed) {
		try {
			await publishChatConversationReadEvent({
				conversationId: params.conversationId,
				readState: result.readState,
			})
		} catch (error) {
			console.error('Failed to publish chat read event', error)
		}
	}

	return result.readState
}

export async function issueChatRealtimeToken(params: { userId: string; conversationId: string }) {
	await ensureConversationAccess({
		userId: params.userId,
		conversationId: params.conversationId,
	})

	return issueChatAblyToken({
		clientId: params.userId,
		conversationId: params.conversationId,
	})
}
