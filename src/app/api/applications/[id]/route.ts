import { requireRole } from '@/lib/auth/server'
import { withdrawApplicationForFreelancer } from '@/lib/db/queries/projects'
import { requireSameOrigin } from '@/lib/security'
import { applicationIdParamSchema } from '@/lib/validations'
import { errorResponse, successResponse } from '@/utils/api-response'

type RouteContext = {
	params: Promise<{ id: string }>
}

/**
 * @swagger
 * /api/applications/{id}:
 *   delete:
 *     tags:
 *       - Projects
 *     summary: Withdraw current freelancer application
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Application withdrawn
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Application not found
 */
export async function DELETE(request: Request, context: RouteContext) {
	try {
		requireSameOrigin(request)
		const session = await requireRole('freelancer')
		const { id } = applicationIdParamSchema.parse(await context.params)
		const updated = await withdrawApplicationForFreelancer({
			applicationId: id,
			freelancerId: session.user.id,
		})

		return successResponse(updated)
	} catch (error) {
		return errorResponse(error)
	}
}
