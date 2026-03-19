import { requireRole } from '@/lib/auth/server'
import { createProjectApplicationForFreelancer } from '@/lib/db/queries/projects'
import { readJsonBody, requireSameOrigin } from '@/lib/security'
import { createApplicationSchema, projectIdParamSchema } from '@/lib/validations'
import { createdResponse, errorResponse } from '@/utils/api-response'

type RouteContext = {
	params: Promise<{ id: string }>
}

/**
 * @swagger
 * /api/projects/{id}/applications:
 *   post:
 *     tags:
 *       - Projects
 *     summary: Apply to a project (freelancer-only)
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       201:
 *         description: Application created
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Project not found
 *       409:
 *         description: Duplicate application
 */
export async function POST(request: Request, context: RouteContext) {
	try {
		requireSameOrigin(request)
		const session = await requireRole('freelancer')
		const { id } = projectIdParamSchema.parse(await context.params)
		const body = await readJsonBody(request)
		const validated = createApplicationSchema.parse(body)
		const application = await createProjectApplicationForFreelancer({
			projectId: id,
			freelancerId: session.user.id,
			input: validated,
		})

		return createdResponse(application)
	} catch (error) {
		return errorResponse(error)
	}
}
