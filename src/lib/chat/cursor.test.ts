import { describe, expect, it } from 'vitest'
import { decodeChatMessageCursor, encodeChatMessageCursor } from './cursor'

describe('chat message cursor helpers', () => {
	it('encodes and decodes an opaque cursor', () => {
		const cursor = encodeChatMessageCursor({
			createdAt: '2026-03-30T10:20:30.000Z',
			messageId: 'message_123',
		})

		expect(cursor).not.toContain('2026-03-30T10:20:30.000Z')
		expect(decodeChatMessageCursor(cursor)).toEqual({
			createdAt: '2026-03-30T10:20:30.000Z',
			messageId: 'message_123',
		})
	})

	it('rejects malformed cursors', () => {
		expect(() => decodeChatMessageCursor('not-a-valid-cursor')).toThrow('Invalid chat cursor')
	})
})
