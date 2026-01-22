import { db } from '@/lib/db'
import { paginationSchema } from '@/lib/validations/common'
import { successResponse, errorResponse } from '@/utils/api-response'

/**
 * @swagger
 * /api/skills:
 *   get:
 *     tags:
 *       - Skills
 *     summary: Get all skills
 *     description: Retrieve a paginated list of all available skills
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 20
 *           maximum: 100
 *         description: Number of items per page
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [text_generation, image_generation, video_generation, audio_generation, programming, consulting]
 *         description: Filter by skill category
 *     responses:
 *       200:
 *         description: List of skills
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Skill'
 *                 meta:
 *                   $ref: '#/components/schemas/Pagination'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url)
		const params = Object.fromEntries(searchParams.entries())

		const { page, pageSize } = paginationSchema.parse(params)
		const category = searchParams.get('category')

		const offset = (page - 1) * pageSize

		let query = db('skills').select('*')

		if (category) {
			query = query.where('category', category)
		}

		const skills = await query.limit(pageSize).offset(offset).orderBy('name', 'asc')

		const [{ count }] = await db('skills')
			.count('* as count')
			.modify((qb) => {
				if (category) {
					qb.where('category', category)
				}
			})

		const total = Number(count)
		const hasMore = offset + skills.length < total

		return successResponse(skills, {
			page,
			pageSize,
			total,
			hasMore,
		})
	} catch (error) {
		return errorResponse(error)
	}
}
