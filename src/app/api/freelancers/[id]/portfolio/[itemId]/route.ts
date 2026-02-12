import { requireRole } from '@/lib/auth/server'
import { kysely } from '@/lib/db'
import { freelancerProfileIdParamSchema, portfolioItemIdParamSchema } from '@/lib/validations'
import { errorResponse, noContentResponse } from '@/utils/api-response'
import { NotFoundError } from '@/utils/errors'

type RouteContext = {
	params: Promise<{ id: string; itemId: string }>
}

/**
 * @swagger
 * /api/freelancers/{id}/portfolio/{itemId}:
 *   delete:
 *     tags:
 *       - Portfolio
 *     summary: Delete a portfolio item (owner-only)
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Freelancer profile id (UUID)
 *         example: "550e8400-e29b-41d4-a716-446655440000"
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
		const { id, itemId } = await context.params

		freelancerProfileIdParamSchema.parse({ id })
		portfolioItemIdParamSchema.parse({ itemId })

		const profile = await kysely
			.selectFrom('freelancer_profiles')
			.select(['id', 'user_id'])
			.where('id', '=', id)
			.executeTakeFirst()

		if (!profile || profile.user_id !== session.user.id) {
			throw new NotFoundError('Freelancer profile not found')
		}

		await kysely
			.deleteFrom('portfolio_items')
			.where('id', '=', itemId)
			.where('freelancer_profile_id', '=', id)
			.executeTakeFirst()

		return noContentResponse()
	} catch (error) {
		return errorResponse(error)
	}
}
