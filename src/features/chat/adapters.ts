import type { ChatConversationSummary, ChatReadState } from '@/lib/chat/contracts'
import type { ChatUiMessage } from '@/stores'
import type { ChatItem, MessageItem } from '@/ui'
import type { Route } from 'next'

export function toChatConversationRoute(conversationId: string): Route {
	return `/account/chat/${conversationId}` as Route
}

export function toChatListItems(conversations: ChatConversationSummary[]): ChatItem[] {
	return conversations.map((conversation) => ({
		id: conversation.id,
		name: conversation.otherParticipant.name,
		avatar: conversation.otherParticipant.image ?? undefined,
		lastMessage: conversation.lastMessage?.text ?? 'Сообщений пока нет',
		updatedAt: conversation.lastMessage?.createdAt ?? conversation.updatedAt,
		unreadCount: conversation.unreadCount,
	}))
}

export function toChatMessageItems(params: {
	messages: ChatUiMessage[]
	peerId: string
	peerReadState: ChatReadState | null
}): MessageItem[] {
	const { messages, peerId, peerReadState } = params
	const lastPeerReadIndex = peerReadState
		? messages.findIndex((message) => message.id === peerReadState.lastReadMessageId)
		: -1

	return messages.map((message, index) => {
		const isIncoming = message.senderId === peerId
		const isRead =
			!isIncoming &&
			message.status === 'sent' &&
			lastPeerReadIndex >= 0 &&
			index <= lastPeerReadIndex

		return {
			id: message.localId ?? message.id,
			direction: isIncoming ? 'in' : 'out',
			text: message.text,
			timestamp: message.createdAt,
			delivery: message.status,
			read: isRead,
		}
	})
}

export function formatChatParticipantRole(
	role: ChatConversationSummary['otherParticipant']['role'],
) {
	return role === 'customer' ? 'Заказчик' : 'Фрилансер'
}
