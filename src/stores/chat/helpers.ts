import { produce } from 'immer'
import { forEachRight } from 'lodash'
import type {
	ChatConversationReadEvent,
	ChatConversationSummary,
	ChatMessage,
} from '@/lib/chat/contracts'

export type ChatUiMessageStatus = 'sent' | 'sending' | 'failed'

export type ChatUiMessage = ChatMessage & {
	status: ChatUiMessageStatus
}

type ConversationMessagePatchOptions = {
	keepUnread?: boolean
}

export function toChatUiMessage(
	message: ChatMessage,
	status: ChatUiMessageStatus = 'sent',
	overrides: Omit<Partial<ChatUiMessage>, 'status'> = {},
): ChatUiMessage {
	return {
		...message,
		status,
		...overrides,
	}
}

export function createOptimisticChatMessage(params: {
	id: string
	conversationId: string
	text: string
	senderId: string
}): ChatUiMessage {
	const createdAt = new Date().toISOString()

	return {
		...params,
		createdAt,
		status: 'sending',
	}
}

export function appendChatMessage(
	currentMessages: ChatUiMessage[],
	nextMessage: ChatMessage,
): ChatUiMessage[] {
	if (currentMessages.some((message) => message.id === nextMessage.id)) {
		return currentMessages.map((message) =>
			message.id === nextMessage.id ? toChatUiMessage(nextMessage) : message,
		)
	}

	return sortChatMessages([...currentMessages, toChatUiMessage(nextMessage)])
}

export function appendOptimisticChatMessage(
	currentMessages: ChatUiMessage[],
	nextMessage: ChatUiMessage,
): ChatUiMessage[] {
	return sortChatMessages([...currentMessages, nextMessage])
}

export function replaceOptimisticChatMessage(
	currentMessages: ChatUiMessage[],
	params: {
		message: ChatMessage
	},
): ChatUiMessage[] {
	return appendChatMessage(currentMessages, params.message)
}

export function markOptimisticChatMessageFailed(
	currentMessages: ChatUiMessage[],
	messageId: string,
): ChatUiMessage[] {
	return produce(currentMessages, (draft) => {
		const optimisticMessage = draft.find((message) => message.id === messageId)

		if (optimisticMessage) {
			optimisticMessage.status = 'failed'
		}
	})
}

export function sortChatMessages(messages: ChatUiMessage[]): ChatUiMessage[] {
	return [...messages].sort((left, right) => {
		const timestampDiff = Date.parse(left.createdAt) - Date.parse(right.createdAt)

		if (timestampDiff !== 0) {
			return timestampDiff
		}

		return left.id.localeCompare(right.id)
	})
}

export function sortChatConversations(
	conversations: ChatConversationSummary[],
): ChatConversationSummary[] {
	return [...conversations].sort((left, right) => {
		const timestampDiff = Date.parse(right.updatedAt) - Date.parse(left.updatedAt)

		if (timestampDiff !== 0) {
			return timestampDiff
		}

		return right.id.localeCompare(left.id)
	})
}

export function patchConversationWithMessage(
	conversations: ChatConversationSummary[],
	params: {
		conversationId: string
		message: ChatMessage
		incrementUnread?: boolean
		options?: ConversationMessagePatchOptions
	},
): ChatConversationSummary[] {
	return sortChatConversations(
		conversations.map((conversation) => {
			if (conversation.id !== params.conversationId) {
				return conversation
			}

			return {
				...conversation,
				updatedAt: params.message.createdAt,
				lastMessage: {
					id: params.message.id,
					senderId: params.message.senderId,
					text: params.message.text,
					createdAt: params.message.createdAt,
				},
				unreadCount: params.options?.keepUnread
					? conversation.unreadCount
					: conversation.unreadCount + Number(Boolean(params.incrementUnread)),
			}
		}),
	)
}

export function patchConversationReadState(
	conversations: ChatConversationSummary[],
	params: {
		conversationId: string
		lastReadMessageId: string
		readAt: string
	},
): ChatConversationSummary[] {
	return conversations.map((conversation) => {
		if (conversation.id !== params.conversationId) {
			return conversation
		}

		return {
			...conversation,
			lastReadMessageId: params.lastReadMessageId,
			lastReadAt: params.readAt,
			unreadCount: 0,
		}
	})
}

export function getLatestReadableMessageId(params: {
	conversation: ChatConversationSummary | null
	messages: ChatUiMessage[]
	pendingReadMessageId?: string | null
}): string | null {
	const { conversation, messages, pendingReadMessageId } = params

	if (!conversation) {
		return null
	}

	let latestMessage: ChatUiMessage | undefined

	forEachRight(messages, (message) => {
		if (message.senderId === conversation.otherParticipant.id) {
			latestMessage = message
			return false
		}
	})

	if (!latestMessage) {
		return null
	}

	if (latestMessage.id === conversation.lastReadMessageId) {
		return null
	}

	if (latestMessage.id === pendingReadMessageId) {
		return null
	}

	return latestMessage.id
}

export function shouldUseIncomingReadEventAsPeerUpdate(params: {
	event: ChatConversationReadEvent
	pendingReadMessageId?: string | null
}): boolean {
	return params.event.readState.lastReadMessageId !== params.pendingReadMessageId
}
