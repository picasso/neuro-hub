import { requireRole } from '@/lib/auth/server'
import { listFreelancerApplications } from '@/lib/db/queries/projects'
import { applicationsQuerySchema } from '@/lib/validations'
import { errorResponse, successResponse } from '@/utils/api-response'

/**
 * @swagger
 * /api/applications:
 *   get:
 *     tags:
 *       - Projects
 *     summary: List current freelancer applications
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Applications listing
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
export async function GET(request: Request) {
	try {
		const session = await requireRole('freelancer')
		const { searchParams } = new URL(request.url)
		const rawParams = Object.fromEntries(searchParams.entries())
		const params = applicationsQuerySchema.parse(rawParams)
		const result = await listFreelancerApplications({
			freelancerId: session.user.id,
			input: params,
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
