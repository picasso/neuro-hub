import { sql } from 'kysely'
import { requireRole } from '@/lib/auth/server'
import { kysely } from '@/lib/db'
import { createPortfolioItemSchema, freelancerProfileIdParamSchema } from '@/lib/validations'
import { createdResponse, errorResponse, successResponse } from '@/utils/api-response'
import { NotFoundError } from '@/utils/errors'

type RouteContext = {
	params: Promise<{ id: string }>
}

/**
 * @swagger
 * /api/freelancers/{id}/portfolio:
 *   get:
 *     tags:
 *       - Portfolio
 *     summary: List public portfolio items for a freelancer
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Freelancer profile id (UUID)
 *         example: "550e8400-e29b-41d4-a716-446655440000"
 *     responses:
 *       200:
 *         description: Portfolio items
 *       400:
 *         description: Validation error
 *
 *   post:
 *     tags:
 *       - Portfolio
 *     summary: Create a portfolio item (owner-only)
 *     description: >
 *       Creates a portfolio item for the authenticated freelancer.
 *       Media should be uploaded directly to Vercel Blob first; `mediaUrl` must be a final public URL.
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, mediaUrl]
 *             properties:
 *               title:
 *                 type: string
 *                 example: "RAG Chatbot MVP"
 *               description:
 *                 type: string
 *                 example: "Built a RAG pipeline with evals and observability"
 *               mediaUrl:
 *                 type: string
 *                 format: uri
 *                 example: "https://<your-blob>.public.blob.vercel-storage.com/portfolio/demo.png"
 *               mediaType:
 *                 type: string
 *                 example: "image/png"
 *               category:
 *                 type: string
 *                 example: "chatbots"
 *               toolsUsed:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["LangChain", "Postgres", "OpenAI"]
 *     responses:
 *       201:
 *         description: Portfolio item created
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Freelancer profile not found (also returned when profile is not owned by the authenticated user)
 */
export async function GET(_: Request, context: RouteContext) {
	try {
		const { id } = freelancerProfileIdParamSchema.parse(await context.params)

		const items = await kysely
			.selectFrom('portfolio_items')
			.selectAll()
			.where('freelancer_profile_id', '=', id)
			.orderBy('created_at', 'desc')
			.execute()

		return successResponse(
			items.map((p) => ({
				id: p.id,
				title: p.title,
				description: p.description,
				mediaUrl: p.media_url,
				mediaType: p.media_type,
				category: p.category,
				toolsUsed: p.tools_used,
				createdAt: p.created_at,
				updatedAt: p.updated_at,
			})),
		)
	} catch (error) {
		return errorResponse(error)
	}
}

export async function POST(request: Request, context: RouteContext) {
	try {
		const session = await requireRole('freelancer')
		const { id } = freelancerProfileIdParamSchema.parse(await context.params)

		const profile = await kysely
			.selectFrom('freelancer_profiles')
			.select(['id', 'user_id'])
			.where('id', '=', id)
			.executeTakeFirst()

		if (!profile || profile.user_id !== session.user.id) {
			throw new NotFoundError('Freelancer profile not found')
		}

		const body = await request.json()
		const validated = createPortfolioItemSchema.parse(body)

		const inserted = await kysely
			.insertInto('portfolio_items')
			.values({
				freelancer_profile_id: id,
				title: validated.title,
				description: validated.description ?? null,
				media_url: validated.mediaUrl,
				media_type: validated.mediaType ?? null,
				category: validated.category ?? null,
				// `tools_used` is jsonb; pg will serialize arrays as PG array literals unless we cast explicitly.
				tools_used: validated.toolsUsed?.length
					? sql`${JSON.stringify(validated.toolsUsed)}::jsonb`
					: null,
				updated_at: new Date(),
			})
			.returningAll()
			.executeTakeFirstOrThrow()

		return createdResponse({
			id: inserted.id,
			title: inserted.title,
			description: inserted.description,
			mediaUrl: inserted.media_url,
			mediaType: inserted.media_type,
			category: inserted.category,
			toolsUsed: inserted.tools_used,
			createdAt: inserted.created_at,
			updatedAt: inserted.updated_at,
		})
	} catch (error) {
		return errorResponse(error)
	}
}
