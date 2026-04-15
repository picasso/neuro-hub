import { requireRole } from '@/lib/auth/server'
import { kysely } from '@/lib/db'
import { getFreelancerProfileRowByNickname } from '@/lib/db/queries/freelancers'
import { freelancerNicknameParamSchema, portfolioItemIdParamSchema } from '@/lib/validations'
import { errorResponse, noContentResponse } from '@/utils/api-response'
import { NotFoundError } from '@/utils/errors'

type RouteContext = {
	params: Promise<{ nickname: string; itemId: string }>
}

/**
 * @swagger
 * /api/freelancers/{nickname}/portfolio/{itemId}:
 *   delete:
 *     tags:
 *       - Portfolio
 *     summary: Delete a portfolio item (owner-only)
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: nickname
 *         required: true
 *         schema:
 *           type: string
 *         description: Public nickname slug
 *         example: "jane-ai"
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Portfolio item id (UUID)
 *         example: "550e8400-e29b-41d4-a716-446655440000"
 *     responses:
 *       204:
 *         description: Deleted
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Freelancer profile not found (also returned when profile is not owned by the authenticated user)
 */
export async function DELETE(_: Request, context: RouteContext) {
	try {
		const session = await requireRole('freelancer')
		const params = await context.params

		const { nickname } = freelancerNicknameParamSchema.parse({ nickname: params.nickname })
		const { itemId } = portfolioItemIdParamSchema.parse({ itemId: params.itemId })

		const resolved = await getFreelancerProfileRowByNickname(nickname)
		if (!resolved || resolved.userId !== session.user.id) {
			throw new NotFoundError('Freelancer profile not found')
		}

		const freelancerProfileId = resolved.freelancerProfileId

		await kysely
			.deleteFrom('portfolio_items')
			.where('id', '=', itemId)
			.where('freelancer_profile_id', '=', freelancerProfileId)
			.executeTakeFirst()

		return noContentResponse()
	} catch (error) {
		return errorResponse(error)
	}
}
