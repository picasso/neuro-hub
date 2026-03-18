import { requireRole } from '@/lib/auth/server'
import { createProjectForClient, listPublicProjects } from '@/lib/db/queries/projects'
import { readJsonBody, requireSameOrigin } from '@/lib/security'
import { createProjectSchema, projectDirectoryQuerySchema } from '@/lib/validations'
import { createdResponse, errorResponse, successResponse } from '@/utils/api-response'

/**
 * @swagger
 * /api/projects:
 *   get:
 *     tags:
 *       - Projects
 *     summary: List public projects
 *     description: Returns a paginated public listing of published projects.
 *     responses:
 *       200:
 *         description: Public projects listing
 *       400:
 *         description: Validation error
 *
 *   post:
 *     tags:
 *       - Projects
 *     summary: Create project (client-only)
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       201:
 *         description: Project created
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url)
		const rawParams = Object.fromEntries(searchParams.entries())
		const params = projectDirectoryQuerySchema.parse(rawParams)
		const result = await listPublicProjects(params)

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
		const validated = createProjectSchema.parse(body)
		const created = await createProjectForClient({
			clientId: session.user.id,
			input: validated,
		})

		return createdResponse(created)
	} catch (error) {
		return errorResponse(error)
	}
}
