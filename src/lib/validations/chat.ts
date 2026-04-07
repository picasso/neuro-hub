import { z } from 'zod'
import { idSchema, paginationSchema, uuidSchema } from './common'
import { CHAT_CONTEXT_TYPES, CHAT_MESSAGE_MAX_LENGTH } from '@/lib/chat/contracts'

export const chatContextTypeSchema = z.enum(CHAT_CONTEXT_TYPES)

export const chatConversationParamsSchema = z.object({
	conversationId: idSchema,
})

export const chatCreateConversationSchema = z.object({
	contextType: chatContextTypeSchema,
	contextId: uuidSchema,
	freelancerId: idSchema,
})

export const chatConversationListQuerySchema = paginationSchema.extend({
	contextType: chatContextTypeSchema.optional(),
	contextId: uuidSchema.optional(),
	unreadOnly: z.coerce.boolean().optional().default(false),
})

export const chatMessagesQuerySchema = z.object({
	cursor: z.string().trim().min(1).optional(),
	limit: z.coerce.number().int().positive().max(100).default(30),
})

export const chatMessageTextSchema = z
	.string()
	.trim()
	.min(1, 'Message must not be empty')
	.max(CHAT_MESSAGE_MAX_LENGTH, `Message must not exceed ${CHAT_MESSAGE_MAX_LENGTH} characters`)

export const chatSendMessageSchema = z.object({
	messageId: uuidSchema,
	text: chatMessageTextSchema,
})

export const chatMarkReadSchema = z.object({
	lastReadMessageId: idSchema,
})

export const chatAblyTokenSchema = z.object({
	conversationId: idSchema,
})

export type ChatContextTypeInput = z.infer<typeof chatContextTypeSchema>
export type ChatConversationParams = z.infer<typeof chatConversationParamsSchema>
export type ChatCreateConversationInput = z.infer<typeof chatCreateConversationSchema>
export type ChatConversationListQueryInput = z.infer<typeof chatConversationListQuerySchema>
export type ChatMessageListQueryInput = z.infer<typeof chatMessagesQuerySchema>
export type ChatSendMessageInput = z.infer<typeof chatSendMessageSchema>
export type ChatMarkReadInput = z.infer<typeof chatMarkReadSchema>
export type ChatAblyTokenInput = z.infer<typeof chatAblyTokenSchema>
