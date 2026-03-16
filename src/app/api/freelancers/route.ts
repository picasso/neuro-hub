import { listPublicFreelancers } from '@/lib/db/queries/freelancers'
import { freelancerDirectoryQuerySchema } from '@/lib/validations'
import { errorResponse, successResponse } from '@/utils/api-response'

/**
 * @swagger
 * /api/freelancers:
 *   get:
 *     tags:
 *       - Freelancers
 *     summary: List public freelancer profiles
 *     description: >
 *       Returns a paginated public listing of discoverable freelancer profiles
 *       for the marketplace directory page.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 12
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search by name, bio, specialization, or skill
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [text_generation, image_generation, video_generation, audio_generation, programming, consulting]
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [recommended, rate_asc, rate_desc, newest]
 *       - in: query
 *         name: hasPortfolio
 *         schema:
 *           type: boolean
 *         description: Only return profiles that have portfolio items
 *     responses:
 *       200:
 *         description: Public freelancer directory page
 *       400:
 *         description: Validation error
 */
export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url)
		const rawParams = Object.fromEntries(searchParams.entries())
		const params = freelancerDirectoryQuerySchema.parse(rawParams)
		const result = await listPublicFreelancers(params)

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
