import { requireAuth } from '@/lib/auth/server'
import { issueChatRealtimeToken } from '@/lib/chat/service'
import { readJsonBody, requireSameOrigin } from '@/lib/security'
import { chatAblyTokenSchema } from '@/lib/validations'
import { errorResponse, successResponse } from '@/utils/api-response'

export async function POST(request: Request) {
	try {
		requireSameOrigin(request)
		const session = await requireAuth()
		const body = await readJsonBody(request)
		const input = chatAblyTokenSchema.parse(body)
		const result = await issueChatRealtimeToken({
			userId: session.user.id,
			conversationId: input.conversationId,
		})

		return successResponse(result)
	} catch (error) {
		return errorResponse(error)
	}
}
