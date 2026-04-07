import type { ApiResponse } from '@/utils'
import {
	CHAT_API_ROUTES,
	type ChatAblyTokenGrant,
	type ChatContextType,
	type ChatConversationOpenData,
	type ChatConversationSummary,
	type ChatMessage,
	type ChatMessagePage,
	type ChatReadState,
	type ChatSendMessagePayload,
} from '@/lib/chat/contracts'

const CHAT_CONVERSATIONS_PAGE_SIZE = 50
const CHAT_MESSAGES_PAGE_SIZE = 30

export type ChatRequestError = Error & {
	code?: string
	statusCode?: number
}

type ChatApiSuccess<T> = {
	data: T
	meta?: {
		page?: number
		pageSize?: number
		total?: number
		hasMore?: boolean
	}
}

export async function fetchChatConversations(): Promise<ChatApiSuccess<ChatConversationSummary[]>> {
	const searchParams = new URLSearchParams({
		page: '1',
		pageSize: String(CHAT_CONVERSATIONS_PAGE_SIZE),
	})

	return requestChatApi<ChatConversationSummary[]>(
		`${CHAT_API_ROUTES.conversations}?${searchParams.toString()}`,
	)
}

export async function openChatConversation(params: {
	contextType: ChatContextType
	contextId: string
	freelancerId: string
}): Promise<ChatConversationOpenData> {
	const result = await requestChatApi<ChatConversationOpenData>(CHAT_API_ROUTES.conversations, {
		method: 'POST',
		body: JSON.stringify(params),
	})

	return result.data
}

export async function fetchChatMessages(params: {
	conversationId: string
	cursor?: string | null
}): Promise<ChatMessagePage> {
	const searchParams = new URLSearchParams({
		limit: String(CHAT_MESSAGES_PAGE_SIZE),
	})

	if (params.cursor) {
		searchParams.set('cursor', params.cursor)
	}

	const path = CHAT_API_ROUTES.conversationMessages.replace(
		':conversationId',
		encodeURIComponent(params.conversationId),
	)

	const result = await requestChatApi<ChatMessagePage>(`${path}?${searchParams.toString()}`)
	return result.data
}

export async function sendChatMessage(params: {
	conversationId: string
	input: ChatSendMessagePayload
}): Promise<ChatMessage> {
	const path = CHAT_API_ROUTES.conversationMessages.replace(
		':conversationId',
		encodeURIComponent(params.conversationId),
	)

	const result = await requestChatApi<ChatMessage>(path, {
		method: 'POST',
		body: JSON.stringify(params.input),
	})

	return result.data
}

export async function markChatConversationRead(params: {
	conversationId: string
	lastReadMessageId: string
}): Promise<ChatReadState> {
	const path = CHAT_API_ROUTES.conversationRead.replace(
		':conversationId',
		encodeURIComponent(params.conversationId),
	)

	const result = await requestChatApi<ChatReadState>(path, {
		method: 'POST',
		body: JSON.stringify({
			lastReadMessageId: params.lastReadMessageId,
		}),
	})

	return result.data
}

export async function requestChatAblyToken(conversationId: string): Promise<ChatAblyTokenGrant> {
	const result = await requestChatApi<ChatAblyTokenGrant>(CHAT_API_ROUTES.ablyToken, {
		method: 'POST',
		body: JSON.stringify({ conversationId }),
	})

	return result.data
}

async function requestChatApi<T>(input: string, init?: RequestInit): Promise<ChatApiSuccess<T>> {
	const response = await fetch(input, {
		...init,
		headers: {
			'content-type': 'application/json',
			...init?.headers,
		},
	})

	const json = (await response.json().catch(() => null)) as ApiResponse<T> | null

	if (!response.ok || !json?.success) {
		throw createChatRequestError(json, response.status)
	}

	return {
		data: json.data,
		meta: json.meta,
	}
}

function createChatRequestError(
	json: ApiResponse<unknown> | null,
	statusCode: number,
): ChatRequestError {
	const fallbackMessage =
		statusCode >= 500 ? 'Не удалось выполнить запрос чата' : 'Запрос чата завершился с ошибкой'

	if (!json || json.success) {
		return Object.assign(new Error(fallbackMessage), { statusCode })
	}

	return Object.assign(new Error(mapChatErrorMessage(json.error.code, json.error.message)), {
		code: json.error.code,
		statusCode: json.error.statusCode,
	})
}

function mapChatErrorMessage(code?: string, fallbackMessage?: string): string {
	if (!code) {
		return fallbackMessage ?? 'Не удалось выполнить действие в чате'
	}

	switch (code) {
		case 'CHAT_CONVERSATION_NOT_FOUND':
			return 'Диалог не найден или недоступен'
		case 'CHAT_CONVERSATION_ACCESS_DENIED':
			return 'У вас нет доступа к этому диалогу'
		case 'CHAT_CURSOR_INVALID':
			return 'Не удалось загрузить следующую страницу истории'
		case 'CHAT_MESSAGE_NOT_FOUND':
			return 'Сообщение для отметки прочитанным не найдено'
		case 'CHAT_ABLY_TOKEN_FORBIDDEN':
			return 'Не удалось получить realtime-доступ к диалогу'
		default:
			return fallbackMessage ?? 'Не удалось выполнить действие в чате'
	}
}
