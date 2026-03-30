import type { ApiErrorResponse, ApiSuccessResponse } from '@/utils/api-response'
export const CHAT_CONTEXT_TYPES = ['project'] as const
export const CHAT_PARTICIPANT_ROLES = ['customer', 'freelancer'] as const
export const CHAT_ABLY_CAPABILITY_MODES = ['subscribe'] as const
export const CHAT_ABLY_EVENT_NAMES = ['message.created', 'conversation.read'] as const
export const CHAT_ERROR_CODES = [
	'CHAT_CONTEXT_UNSUPPORTED',
	'CHAT_PROJECT_NOT_FOUND',
	'CHAT_PROJECT_FORBIDDEN',
	'CHAT_PROJECT_CLOSED',
	'CHAT_APPLICATION_NOT_FOUND',
	'CHAT_APPLICATION_WITHDRAWN',
	'CHAT_CONVERSATION_NOT_FOUND',
	'CHAT_CONVERSATION_ACCESS_DENIED',
	'CHAT_MESSAGE_NOT_FOUND',
	'CHAT_CURSOR_INVALID',
	'CHAT_ABLY_TOKEN_FORBIDDEN',
] as const

export const CHAT_MESSAGE_MAX_LENGTH = 4000
export const CHAT_ABLY_CHANNEL_PREFIX = 'chat:conversation:'
export const CHAT_ABLY_CHANNEL_PATTERN = 'chat:conversation:{conversationId}'

export const CHAT_API_ROUTES = {
	conversations: '/api/v1/chat/conversations',
	conversationMessages: '/api/v1/chat/conversations/:conversationId/messages',
	conversationRead: '/api/v1/chat/conversations/:conversationId/read',
	ablyToken: '/api/v1/chat/ably/token',
} as const

export type ChatContextType = (typeof CHAT_CONTEXT_TYPES)[number]
export type ChatParticipantRole = (typeof CHAT_PARTICIPANT_ROLES)[number]
export type ChatAblyCapabilityMode = (typeof CHAT_ABLY_CAPABILITY_MODES)[number]
export type ChatAblyEventName = (typeof CHAT_ABLY_EVENT_NAMES)[number]
export type ChatErrorCode = (typeof CHAT_ERROR_CODES)[number]

export type ChatParticipantSummary = {
	id: string
	name: string
	image: string | null
	role: ChatParticipantRole
}

export type ChatMessage = {
	id: string
	conversationId: string
	senderId: string
	text: string
	createdAt: string
}

export type ChatMessagePreview = Pick<ChatMessage, 'id' | 'senderId' | 'text' | 'createdAt'>

export type ChatConversationSummary = {
	id: string
	contextType: ChatContextType
	contextId: string
	createdAt: string
	updatedAt: string
	otherParticipant: ChatParticipantSummary
	lastMessage: ChatMessagePreview | null
	unreadCount: number
	lastReadMessageId: string | null
	lastReadAt: string | null
}

export type ChatConversationOpenData = {
	conversation: ChatConversationSummary
	created: boolean
}

export type ChatMessagePage = {
	items: ChatMessage[]
	nextCursor: string | null
}

export type ChatReadState = {
	conversationId: string
	lastReadMessageId: string
	readAt: string
}

export type ChatAblyTokenGrant = {
	channelName: string
	mode: ChatAblyCapabilityMode
	capability: string
	tokenRequest: {
		keyName: string
		clientId: string
		ttl: number
		capability: string
		timestamp: number
		nonce: string
		mac: string
	}
}

export type ChatMessageCreatedEvent = {
	type: 'message.created'
	conversationId: string
	message: ChatMessage
}

export type ChatConversationReadEvent = {
	type: 'conversation.read'
	conversationId: string
	readState: ChatReadState
}

export type ChatRealtimeEvent = ChatMessageCreatedEvent | ChatConversationReadEvent

export type ChatCreateConversationResponse =
	| ApiSuccessResponse<ChatConversationOpenData>
	| ApiErrorResponse
export type ChatListConversationsResponse =
	| ApiSuccessResponse<ChatConversationSummary[]>
	| ApiErrorResponse
export type ChatListMessagesResponse = ApiSuccessResponse<ChatMessagePage> | ApiErrorResponse
export type ChatSendMessageResponse = ApiSuccessResponse<ChatMessage> | ApiErrorResponse
export type ChatMarkReadResponse = ApiSuccessResponse<ChatReadState> | ApiErrorResponse
export type ChatIssueAblyTokenResponse = ApiSuccessResponse<ChatAblyTokenGrant> | ApiErrorResponse
