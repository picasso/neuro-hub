import { requireAuth } from '@/lib/auth/server'
import { listChatMessages, sendChatMessage } from '@/lib/chat/service'
import { readJsonBody, requireSameOrigin } from '@/lib/security'
import {
	chatConversationParamsSchema,
	chatMessagesQuerySchema,
	chatSendMessageSchema,
} from '@/lib/validations'
import { createdResponse, errorResponse, successResponse } from '@/utils/api-response'

type RouteContext = {
	params: Promise<{ conversationId: string }>
}

export async function GET(request: Request, context: RouteContext) {
	try {
		const session = await requireAuth()
		const { conversationId } = chatConversationParamsSchema.parse(await context.params)
		const { searchParams } = new URL(request.url)
		const rawParams = Object.fromEntries(searchParams.entries())
		const input = chatMessagesQuerySchema.parse(rawParams)
		const result = await listChatMessages({
			userId: session.user.id,
			conversationId,
			input,
		})

		return successResponse(result)
	} catch (error) {
		return errorResponse(error)
	}
}

export async function POST(request: Request, context: RouteContext) {
	try {
		requireSameOrigin(request)
		const session = await requireAuth()
		const { conversationId } = chatConversationParamsSchema.parse(await context.params)
		const body = await readJsonBody(request)
		const input = chatSendMessageSchema.parse(body)
		const result = await sendChatMessage({
			userId: session.user.id,
			conversationId,
			input,
		})

		return createdResponse(result)
	} catch (error) {
		return errorResponse(error)
	}
}
