import {
	chatConversationListQuerySchema,
	chatCreateConversationSchema,
	chatSendMessageSchema,
} from './chat'
import { CHAT_MESSAGE_MAX_LENGTH } from '@/lib/chat/contracts'

describe('chatCreateConversationSchema', () => {
	it('accepts a valid project conversation payload', () => {
		const result = chatCreateConversationSchema.parse({
			contextType: 'project',
			contextId: '550e8400-e29b-41d4-a716-446655440000',
			freelancerId: 'user_freelancer_1',
		})

		expect(result.contextType).toBe('project')
	})
})

describe('chatConversationListQuerySchema', () => {
	it('parses defaults and booleans from query params', () => {
		const result = chatConversationListQuerySchema.parse({
			page: '2',
			pageSize: '15',
			unreadOnly: 'true',
		})

		expect(result.page).toBe(2)
		expect(result.pageSize).toBe(15)
		expect(result.unreadOnly).toBe(true)
	})
})

describe('chatSendMessageSchema', () => {
	it('rejects too long messages', () => {
		expect(() =>
			chatSendMessageSchema.parse({
				text: 'x'.repeat(CHAT_MESSAGE_MAX_LENGTH + 1),
			}),
		).toThrow(`Message must not exceed ${CHAT_MESSAGE_MAX_LENGTH} characters`)
	})
})
