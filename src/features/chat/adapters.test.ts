import { formatChatParticipantRole, toChatListItems, toChatMessageItems } from './adapters'
import type { ChatConversationSummary, ChatReadState } from '@/lib/chat/contracts'
import type { ChatUiMessage } from '@/stores'

const conversation: ChatConversationSummary = {
	id: 'conversation-1',
	contextType: 'project',
	contextId: 'project-1',
	createdAt: '2026-03-30T10:00:00.000Z',
	updatedAt: '2026-03-30T10:05:00.000Z',
	otherParticipant: {
		id: 'user-peer',
		name: 'Alex Doe',
		image: null,
		role: 'freelancer',
	},
	lastMessage: {
		id: 'message-2',
		senderId: 'user-peer',
		text: 'Последнее сообщение',
		createdAt: '2026-03-30T10:10:00.000Z',
	},
	unreadCount: 3,
	lastReadMessageId: null,
	lastReadAt: null,
}

describe('chat adapters', () => {
	it('maps conversations to chat list items with raw server timestamp', () => {
		const items = toChatListItems([conversation])

		expect(items[0]).toMatchObject({
			id: conversation.id,
			name: conversation.otherParticipant.name,
			lastMessageText: conversation.lastMessage?.text,
			updatedAt: conversation.lastMessage?.createdAt,
			unreadCount: conversation.unreadCount,
		})
	})

	it('maps messages to ui items and keeps raw timestamps', () => {
		const messages: ChatUiMessage[] = [
			{
				id: 'message-1',
				conversationId: conversation.id,
				senderId: 'self',
				text: 'Привет',
				createdAt: '2026-03-30T10:00:00.000Z',
				status: 'sent',
			},
			{
				id: 'message-2',
				conversationId: conversation.id,
				senderId: 'user-peer',
				text: 'Ответ',
				createdAt: '2026-03-30T10:01:00.000Z',
				status: 'sent',
			},
			{
				id: 'message-3',
				conversationId: conversation.id,
				senderId: 'self',
				text: 'Ещё сообщение',
				createdAt: '2026-03-30T10:02:00.000Z',
				status: 'sending',
			},
		]
		const peerReadState: ChatReadState = {
			conversationId: conversation.id,
			lastReadMessageId: 'message-2',
			readAt: '2026-03-30T10:03:00.000Z',
		}

		const items = toChatMessageItems({
			messages,
			peerId: conversation.otherParticipant.id,
			peerReadState,
		})

		expect(items[0]).toMatchObject({
			id: 'message-1',
			direction: 'out',
			createdAt: '2026-03-30T10:00:00.000Z',
			read: true,
		})
		expect(items[1]).toMatchObject({
			id: 'message-2',
			direction: 'in',
			createdAt: '2026-03-30T10:01:00.000Z',
		})
		expect(items[2]).toMatchObject({
			id: 'message-3',
			direction: 'out',
			status: 'sending',
			read: false,
		})
	})

	it('formats participant role labels', () => {
		expect(formatChatParticipantRole('customer')).toBe('Заказчик')
		expect(formatChatParticipantRole('freelancer')).toBe('Фрилансер')
	})
})
