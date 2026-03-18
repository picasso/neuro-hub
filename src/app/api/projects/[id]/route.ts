import { getSsrSafeSession, requireRole } from '@/lib/auth/server'
import {
	deleteProjectForClient,
	getPublicProjectById,
	updateProjectForClient,
} from '@/lib/db/queries/projects'
import { readJsonBody, requireSameOrigin } from '@/lib/security'
import { projectIdParamSchema, updateProjectSchema } from '@/lib/validations'
import { errorResponse, noContentResponse, successResponse } from '@/utils/api-response'
import { NotFoundError } from '@/utils/errors'

type RouteContext = {
	params: Promise<{ id: string }>
}

/**
 * @swagger
 * /api/projects/{id}:
 *   get:
 *     tags:
 *       - Projects
 *     summary: Get public project detail
 *     responses:
 *       200:
 *         description: Project detail
 *       400:
 *         description: Validation error
 *       404:
 *         description: Project not found
 *
 *   put:
 *     tags:
 *       - Projects
 *     summary: Update project (owner-only)
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Project updated
 *
 *   delete:
 *     tags:
 *       - Projects
 *     summary: Delete project (owner-only)
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       204:
 *         description: Project deleted
 */
export async function GET(_: Request, context: RouteContext) {
	try {
		const { id } = projectIdParamSchema.parse(await context.params)
		const session = await getSsrSafeSession()
		const project = await getPublicProjectById(
			id,
			session?.user.role === 'freelancer' ? session.user.id : undefined,
		)

		if (!project) throw new NotFoundError('Project not found')

		return successResponse(project)
	} catch (error) {
		return errorResponse(error)
	}
}

export async function PUT(request: Request, context: RouteContext) {
	try {
		requireSameOrigin(request)
		const session = await requireRole('client')
		const { id } = projectIdParamSchema.parse(await context.params)
		const body = await readJsonBody(request)
		const validated = updateProjectSchema.parse(body)
		const project = await updateProjectForClient({
			projectId: id,
			clientId: session.user.id,
			input: validated,
		})

		return successResponse(project)
	} catch (error) {
		return errorResponse(error)
	}
}

export async function DELETE(request: Request, context: RouteContext) {
	try {
		requireSameOrigin(request)
		const session = await requireRole('client')
		const { id } = projectIdParamSchema.parse(await context.params)
		await deleteProjectForClient({
			projectId: id,
			clientId: session.user.id,
		})

		return noContentResponse()
	} catch (error) {
		return errorResponse(error)
	}
}
