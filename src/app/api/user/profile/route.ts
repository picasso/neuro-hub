import { requireAuth } from '@/lib/auth/server'
import { kysely } from '@/lib/db'
import { updateUserProfileSchema } from '@/lib/validations'
import { errorResponse, successResponse } from '@/utils/api-response'

/**
 * @swagger
 * /api/user/profile:
 *   put:
 *     tags:
 *       - User Profile
 *     summary: Update user profile
 *     description: Update the authenticated user's profile information
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 example: "John Doe"
 *               bio:
 *                 type: string
 *                 maxLength: 500
 *                 example: "Experienced AI consultant"
 *               avatarUrl:
 *                 type: string
 *                 format: uri
 *                 example: "https://example.com/avatar.jpg"
 *               companyName:
 *                 type: string
 *                 example: "Tech Corp"
 *               companyRole:
 *                 type: string
 *                 example: "CTO"
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "usr_2aF9k3LmN0pQ"
 *                     userId:
 *                       type: string
 *                       example: "usr_2aF9k3LmN0pQ"
 *                     name:
 *                       type: string
 *                     bio:
 *                       type: string
 *                     avatarUrl:
 *                       type: string
 *                     companyName:
 *                       type: string
 *                     companyRole:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function PUT(request: Request) {
	try {
		const session = await requireAuth()

		const body = await request.json()
		const validatedData = updateUserProfileSchema.parse(body)

		const profile = await kysely
			.insertInto('user_profiles')
			.values({
				id: session.user.id,
				user_id: session.user.id,
				name: validatedData.name,
				bio: validatedData.bio,
				avatar_url: validatedData.avatarUrl,
				company_name: validatedData.companyName,
				company_role: validatedData.companyRole,
				updated_at: new Date(),
			})
			.onConflict((oc) =>
				oc.column('user_id').doUpdateSet({
					name: validatedData.name,
					bio: validatedData.bio,
					avatar_url: validatedData.avatarUrl,
					company_name: validatedData.companyName,
					company_role: validatedData.companyRole,
					updated_at: new Date(),
				}),
			)
			.returningAll()
			.executeTakeFirstOrThrow()

		return successResponse({
			id: profile.user_id,
			userId: profile.user_id,
			name: profile.name,
			bio: profile.bio,
			avatarUrl: profile.avatar_url,
			companyName: profile.company_name,
			companyRole: profile.company_role,
			createdAt: profile.created_at,
			updatedAt: profile.updated_at,
		})
	} catch (error) {
		return errorResponse(error)
	}
}

/**
 * @swagger
 * /api/user/profile:
 *   get:
 *     tags:
 *       - User Profile
 *     summary: Get user profile
 *     description: Get the authenticated user's profile information
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   description: Profile or null if profile is not created yet
 *                   nullable: true
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "usr_2aF9k3LmN0pQ"
 *                     userId:
 *                       type: string
 *                       example: "usr_2aF9k3LmN0pQ"
 *                     name:
 *                       type: string
 *                     bio:
 *                       type: string
 *                     avatarUrl:
 *                       type: string
 *                     companyName:
 *                       type: string
 *                     companyRole:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function GET() {
	try {
		const session = await requireAuth()

		const profile = await kysely
			.selectFrom('user_profiles')
			.selectAll()
			.where('user_id', '=', session.user.id)
			.executeTakeFirst()

		if (!profile) {
			return successResponse(null)
		}

		return successResponse({
			id: profile.user_id,
			userId: profile.user_id,
			name: profile.name,
			bio: profile.bio,
			avatarUrl: profile.avatar_url,
			companyName: profile.company_name,
			companyRole: profile.company_role,
			createdAt: profile.created_at,
			updatedAt: profile.updated_at,
		})
	} catch (error) {
		return errorResponse(error)
	}
}
