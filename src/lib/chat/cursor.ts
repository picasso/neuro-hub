import { createChatCursorInvalidError } from './errors'

export type ChatMessageCursor = {
	createdAt: string
	messageId: string
}

const CHAT_CURSOR_SEPARATOR = '::'

export function encodeChatMessageCursor(cursor: ChatMessageCursor) {
	return Buffer.from(
		`${cursor.createdAt}${CHAT_CURSOR_SEPARATOR}${cursor.messageId}`,
		'utf8',
	).toString('base64url')
}

export function decodeChatMessageCursor(cursor: string): ChatMessageCursor {
	try {
		const decoded = Buffer.from(cursor, 'base64url').toString('utf8')
		const separatorIndex = decoded.indexOf(CHAT_CURSOR_SEPARATOR)

		if (separatorIndex <= 0) {
			throw createChatCursorInvalidError()
		}

		const createdAt = decoded.slice(0, separatorIndex)
		const messageId = decoded.slice(separatorIndex + CHAT_CURSOR_SEPARATOR.length)

		if (!createdAt || !messageId) {
			throw createChatCursorInvalidError()
		}

		const timestamp = Date.parse(createdAt)
		if (Number.isNaN(timestamp)) {
			throw createChatCursorInvalidError()
		}

		return { createdAt, messageId }
	} catch (error) {
		if (error instanceof Error && error.message === 'Invalid chat cursor') {
			throw error
		}

		throw createChatCursorInvalidError()
	}
}
