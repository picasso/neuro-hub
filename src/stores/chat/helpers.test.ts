import {
	appendChatMessage,
	createOptimisticChatMessage,
	getLatestReadableMessageId,
	markOptimisticChatMessageFailed,
	patchConversationReadState,
	replaceOptimisticChatMessage,
	shouldUseIncomingReadEventAsPeerUpdate,
} from './helpers'
import type { ChatConversationSummary, ChatMessage } from '@/lib/chat/contracts'

const baseConversation: ChatConversationSummary = {
	id: 'conversation-1',
	contextType: 'project',
	contextId: 'project-1',
	createdAt: '2026-03-30T10:00:00.000Z',
	updatedAt: '2026-03-30T10:00:00.000Z',
	otherParticipant: {
		id: 'user-freelancer',
		name: 'Alex Doe',
		image: null,
		role: 'freelancer',
	},
	lastMessage: null,
	unreadCount: 2,
	lastReadMessageId: 'message-1',
	lastReadAt: '2026-03-30T10:01:00.000Z',
}

const sentMessage: ChatMessage = {
	id: 'message-2',
	conversationId: 'conversation-1',
	senderId: 'user-freelancer',
	text: 'Привет!',
	createdAt: '2026-03-30T10:02:00.000Z',
}

describe('chat store helpers', () => {
	it('replaces optimistic message with persisted message without duplicates', () => {
		const optimisticMessage = createOptimisticChatMessage({
			id: 'message-100',
			conversationId: 'conversation-1',
			text: 'Hello world',
			senderId: 'self',
		})

		const nextMessages = replaceOptimisticChatMessage([optimisticMessage], {
			message: {
				id: 'message-100',
				conversationId: 'conversation-1',
				senderId: 'user-self',
				text: 'Hello world',
				createdAt: '2026-03-30T10:05:00.000Z',
			},
		})

		expect(nextMessages).toHaveLength(1)
		expect(nextMessages[0]).toMatchObject({
			id: 'message-100',
			status: 'sent',
		})
	})

	it('marks optimistic message as failed', () => {
		const optimisticMessage = createOptimisticChatMessage({
			id: 'message-local-2',
			conversationId: 'conversation-1',
			text: 'Hello world',
			senderId: 'self',
		})

		const nextMessages = markOptimisticChatMessageFailed([optimisticMessage], 'message-local-2')

		expect(nextMessages[0]?.status).toBe('failed')
	})

	it('reconciles optimistic and persisted message by canonical id', () => {
		const optimisticMessage = createOptimisticChatMessage({
			id: 'message-200',
			conversationId: 'conversation-1',
			text: 'Canonical id message',
			senderId: 'self',
		})

		const nextMessages = appendChatMessage([optimisticMessage], {
			id: 'message-200',
			conversationId: 'conversation-1',
			senderId: 'user-self',
			text: 'Canonical id message',
			createdAt: '2026-03-30T10:06:00.000Z',
		})

		expect(nextMessages).toHaveLength(1)
		expect(nextMessages[0]).toMatchObject({
			id: 'message-200',
			status: 'sent',
		})
	})

	it('appends persisted message only once', () => {
		const firstPass = appendChatMessage([], sentMessage)
		const secondPass = appendChatMessage(firstPass, sentMessage)

		expect(secondPass).toHaveLength(1)
		expect(secondPass[0]?.id).toBe(sentMessage.id)
	})

	it('returns latest readable incoming message id', () => {
		const readableMessageId = getLatestReadableMessageId({
			conversation: baseConversation,
			messages: [
				{
					id: 'message-1',
					conversationId: 'conversation-1',
					senderId: 'user-self',
					text: 'Первое сообщение',
					createdAt: '2026-03-30T10:01:00.000Z',
					status: 'sent',
				},
				{
					id: 'message-2',
					conversationId: 'conversation-1',
					senderId: 'user-freelancer',
					text: 'Входящее сообщение',
					createdAt: '2026-03-30T10:02:00.000Z',
					status: 'sent',
				},
			],
			pendingReadMessageId: null,
		})

		expect(readableMessageId).toBe('message-2')
	})

	it('patches local read state and resets unread count', () => {
		const nextConversations = patchConversationReadState([baseConversation], {
			conversationId: 'conversation-1',
			lastReadMessageId: 'message-2',
			readAt: '2026-03-30T10:03:00.000Z',
		})

		expect(nextConversations[0]).toMatchObject({
			lastReadMessageId: 'message-2',
			unreadCount: 0,
		})
	})

	it('ignores read events that match local pending read', () => {
		const shouldUseEvent = shouldUseIncomingReadEventAsPeerUpdate({
			event: {
				type: 'conversation.read',
				conversationId: 'conversation-1',
				readState: {
					conversationId: 'conversation-1',
					lastReadMessageId: 'message-2',
					readAt: '2026-03-30T10:03:00.000Z',
				},
			},
			pendingReadMessageId: 'message-2',
		})

		expect(shouldUseEvent).toBe(false)
	})
})
