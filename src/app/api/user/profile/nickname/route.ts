import { requireAuth } from '@/lib/auth/server'
import { isNicknameAvailableForUser } from '@/lib/db/queries/user-profiles'
import { nicknameSchema } from '@/lib/validations'
import { errorResponse, successResponse } from '@/utils/api-response'

export async function GET(request: Request) {
	try {
		const session = await requireAuth()
		const { searchParams } = new URL(request.url)
		const nickname = nicknameSchema.parse(searchParams.get('nickname') ?? '')
		const available = await isNicknameAvailableForUser(session.user.id, nickname)

		return successResponse({
			nickname,
			available,
		})
	} catch (error) {
		return errorResponse(error)
	}
}
