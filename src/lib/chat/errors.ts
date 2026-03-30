import { AppError } from '@/utils/errors'

export function createChatError(message: string, statusCode: number, code: string) {
	return new AppError(message, statusCode, code)
}

export function createChatConversationNotFoundError() {
	return createChatError('Conversation not found', 404, 'CHAT_CONVERSATION_NOT_FOUND')
}

export function createChatCursorInvalidError() {
	return createChatError('Invalid chat cursor', 400, 'CHAT_CURSOR_INVALID')
}

export function createChatProjectNotFoundError() {
	return createChatError('Project not found', 404, 'CHAT_PROJECT_NOT_FOUND')
}

export function createChatProjectForbiddenError() {
	return createChatError('Project access denied', 403, 'CHAT_PROJECT_FORBIDDEN')
}

export function createChatProjectClosedError() {
	return createChatError(
		'Chat cannot be created for the current project status',
		409,
		'CHAT_PROJECT_CLOSED',
	)
}

export function createChatApplicationNotFoundError() {
	return createChatError('Application not found', 404, 'CHAT_APPLICATION_NOT_FOUND')
}

export function createChatApplicationRejectedError() {
	return createChatError(
		'Chat cannot be created because the application is rejected',
		409,
		'CHAT_APPLICATION_REJECTED',
	)
}

export function createChatApplicationWithdrawnError() {
	return createChatError(
		'Chat cannot be created because the application is withdrawn',
		409,
		'CHAT_APPLICATION_WITHDRAWN',
	)
}

export function createChatAblyTokenForbiddenError() {
	return createChatError('Ably token access denied', 403, 'CHAT_ABLY_TOKEN_FORBIDDEN')
}
