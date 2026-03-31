import type {
	ChatConversationReadEvent,
	ChatConversationSummary,
	ChatMessage,
} from '@/lib/chat/contracts'

export type ChatUiMessageStatus = 'sent' | 'sending' | 'failed'

export type ChatUiMessage = ChatMessage & {
	status: ChatUiMessageStatus
	localId?: string
}

type ConversationMessagePatchOptions = {
	keepUnread?: boolean
}

export function toChatUiMessage(
	message: ChatMessage,
	status: ChatUiMessageStatus = 'sent',
): ChatUiMessage {
	return {
		...message,
		status,
	}
}

export function createOptimisticChatMessage(params: {
	conversationId: string
	text: string
	senderId: string
	localId: string
}): ChatUiMessage {
	const createdAt = new Date().toISOString()

	return {
		id: params.localId,
		localId: params.localId,
		conversationId: params.conversationId,
		senderId: params.senderId,
		text: params.text,
		createdAt,
		status: 'sending',
	}
}

export function mergeChatMessages(
	currentMessages: ChatUiMessage[],
	nextMessages: ChatMessage[],
): ChatUiMessage[] {
	const messageMap = new Map(currentMessages.map((message) => [message.id, message]))

	for (const message of nextMessages) {
		messageMap.set(message.id, toChatUiMessage(message))
	}

	return sortChatMessages(Array.from(messageMap.values()))
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
		localId: string
		message: ChatMessage
	},
): ChatUiMessage[] {
	const replacedMessage = toChatUiMessage(params.message)
	const nextMessages = currentMessages.filter((message) => message.id !== params.message.id)
	const optimisticIndex = nextMessages.findIndex((message) => message.localId === params.localId)

	if (optimisticIndex === -1) {
		return appendChatMessage(nextMessages, params.message)
	}

	nextMessages.splice(optimisticIndex, 1, replacedMessage)
	return sortChatMessages(nextMessages)
}

export function markOptimisticChatMessageFailed(
	currentMessages: ChatUiMessage[],
	localId: string,
): ChatUiMessage[] {
	return currentMessages.map((message) =>
		message.localId === localId ? { ...message, status: 'failed' } : message,
	)
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

export function upsertChatConversation(
	conversations: ChatConversationSummary[],
	nextConversation: ChatConversationSummary,
): ChatConversationSummary[] {
	const existingConversationIndex = conversations.findIndex(
		(conversation) => conversation.id === nextConversation.id,
	)

	if (existingConversationIndex === -1) {
		return sortChatConversations([...conversations, nextConversation])
	}

	const nextConversations = [...conversations]
	nextConversations.splice(existingConversationIndex, 1, nextConversation)

	return sortChatConversations(nextConversations)
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

	const latestMessage = [...messages]
		.reverse()
		.find((message) => message.senderId === conversation.otherParticipant.id)

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

export function formatChatDateTime(
	value: string,
	options?: {
		withDate?: boolean
	},
) {
	const date = new Date(value)

	if (Number.isNaN(date.getTime())) {
		return ''
	}

	return new Intl.DateTimeFormat('ru-RU', {
		...(options?.withDate
			? {
					day: '2-digit',
					month: '2-digit',
				}
			: {}),
		hour: '2-digit',
		minute: '2-digit',
	}).format(date)
}

export function formatChatParticipantRole(
	role: ChatConversationSummary['otherParticipant']['role'],
) {
	return role === 'customer' ? 'Заказчик' : 'Фрилансер'
}
