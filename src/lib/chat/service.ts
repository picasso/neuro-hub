import {
	issueChatAblyToken,
	publishChatConversationSummaryEvent,
	publishChatMessageCreatedEvent,
	publishChatPeerMessageReadEvent,
} from './ably'
import type {
	ChatConversationListQueryInput,
	ChatCreateConversationInput,
	ChatMarkReadInput,
	ChatMessageListQueryInput,
	ChatSendMessageInput,
} from '@/lib/validations'
import {
	countUnreadChatMessagesForUser,
	ensureConversationAccess,
	listConversationMemberUserIds,
	listConversationsForUser,
	listMessagesForUser,
	loadConversationSummaryForUser,
	markConversationReadForUser,
	openOrCreateConversationForClient,
	sendMessageInConversation,
} from '@/lib/db/queries/chat'

async function publishInboxSummariesForConversation(conversationId: string) {
	const memberIds = await listConversationMemberUserIds(conversationId)

	await Promise.all(
		memberIds.map(async (userId) => {
			const [summary, totalUnreadMessages] = await Promise.all([
				loadConversationSummaryForUser({
					userId,
					conversationId,
				}),
				countUnreadChatMessagesForUser(userId),
			])

			if (!summary) {
				return
			}

			try {
				await publishChatConversationSummaryEvent({
					userId,
					summary,
					totalUnreadMessages,
				})
			} catch (error) {
				console.error('Failed to publish chat inbox summary event', error)
			}
		}),
	)
}

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

	try {
		await publishInboxSummariesForConversation(params.conversationId)
	} catch (error) {
		console.error('Failed to publish chat inbox summaries after send', error)
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
			await publishChatPeerMessageReadEvent({
				conversationId: params.conversationId,
				readerId: params.userId,
				readState: result.readState,
			})
		} catch (error) {
			console.error('Failed to publish chat peer read event', error)
		}

		try {
			await publishInboxSummariesForConversation(params.conversationId)
		} catch (error) {
			console.error('Failed to publish chat inbox summaries after read', error)
		}
	}

	return result.readState
}

export async function issueChatRealtimeToken(params: {
	userId: string
	conversationId?: string | null
}) {
	if (params.conversationId) {
		await ensureConversationAccess({
			userId: params.userId,
			conversationId: params.conversationId,
		})
	}

	return issueChatAblyToken({
		clientId: params.userId,
		conversationId: params.conversationId ?? null,
	})
}
