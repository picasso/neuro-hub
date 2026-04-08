import { requireAuth } from '@/lib/auth/server'
import { markChatConversationRead } from '@/lib/chat/service'
import { readJsonBody, requireSameOrigin } from '@/lib/security'
import { chatConversationParamsSchema, chatMarkReadSchema } from '@/lib/validations'
import { errorResponse, successResponse } from '@/utils/api-response'

type RouteContext = {
	params: Promise<{ conversationId: string }>
}

export async function POST(request: Request, context: RouteContext) {
	try {
		requireSameOrigin(request)
		const session = await requireAuth()
		const { conversationId } = chatConversationParamsSchema.parse(await context.params)
		const body = await readJsonBody(request)
		const input = chatMarkReadSchema.parse(body)
		const result = await markChatConversationRead({
			userId: session.user.id,
			conversationId,
			input,
		})

		return successResponse(result)
	} catch (error) {
		return errorResponse(error)
	}
}
