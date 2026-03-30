import { requireAuth, requireRole } from '@/lib/auth/server'
import { openOrCreateChatConversation, listChatConversations } from '@/lib/chat/service'
import { readJsonBody, requireSameOrigin } from '@/lib/security'
import { chatConversationListQuerySchema, chatCreateConversationSchema } from '@/lib/validations'
import { createdResponse, errorResponse, successResponse } from '@/utils/api-response'

export async function GET(request: Request) {
	try {
		const session = await requireAuth()
		const { searchParams } = new URL(request.url)
		const rawParams = Object.fromEntries(searchParams.entries())
		const input = chatConversationListQuerySchema.parse(rawParams)
		const result = await listChatConversations({
			userId: session.user.id,
			input,
		})

		return successResponse(result.items, {
			page: result.page,
			pageSize: result.pageSize,
			total: result.total,
			hasMore: result.hasMore,
		})
	} catch (error) {
		return errorResponse(error)
	}
}

export async function POST(request: Request) {
	try {
		requireSameOrigin(request)
		const session = await requireRole('client')
		const body = await readJsonBody(request)
		const input = chatCreateConversationSchema.parse(body)
		const result = await openOrCreateChatConversation({
			clientId: session.user.id,
			input,
		})

		return result.created ? createdResponse(result) : successResponse(result)
	} catch (error) {
		return errorResponse(error)
	}
}
