import { requireRole } from '@/lib/auth/server'
import { kysely } from '@/lib/db'
import {
	getFreelancerProfileRowByNickname,
	getPublicFreelancerProfileByNickname,
} from '@/lib/db/queries/freelancers'
import { freelancerNicknameParamSchema, updateFreelancerProfileSchema } from '@/lib/validations'
import { errorResponse, successResponse } from '@/utils/api-response'
import { NotFoundError } from '@/utils/errors'

type RouteContext = {
	params: Promise<{ nickname: string }>
}

/**
 * @swagger
 * /api/freelancers/{nickname}:
 *   get:
 *     tags:
 *       - Freelancers
 *     summary: Get public freelancer profile
 *     description: >
 *       Returns public profile for a freelancer addressed by `user_profiles.nickname`,
 *       including user profile fields, languages, skills, and portfolio items.
 *     parameters:
 *       - in: path
 *         name: nickname
 *         required: true
 *         schema:
 *           type: string
 *         description: Public nickname slug
 *         example: "jane-ai"
 *     responses:
 *       200:
 *         description: Public freelancer profile
 *       400:
 *         description: Validation error
 *       404:
 *         description: Freelancer profile not found
 *
 *   put:
 *     tags:
 *       - Freelancers
 *     summary: Update freelancer profile (owner-only)
 *     description: Updates the authenticated freelancer's own profile. Only available to role `freelancer`.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: nickname
 *         required: true
 *         schema:
 *           type: string
 *         description: Public nickname slug of the freelancer profile to update
 *         example: "jane-ai"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               specialization:
 *                 type: string
 *                 example: "AI Consultant"
 *               hourlyRate:
 *                 type: integer
 *                 example: 120
 *               availability:
 *                 type: string
 *                 example: "10-20 hrs/week"
 *               experience:
 *                 type: string
 *                 example: "5+ years building ML/LLM products"
 *     responses:
 *       200:
 *         description: Freelancer profile updated
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
		const { nickname } = freelancerNicknameParamSchema.parse(await context.params)

		const publicProfile = await getPublicFreelancerProfileByNickname(nickname)
		if (!publicProfile) throw new NotFoundError('Freelancer profile not found')

		return successResponse(publicProfile)
	} catch (error) {
		return errorResponse(error)
	}
}

export async function PUT(request: Request, context: RouteContext) {
	try {
		const session = await requireRole('freelancer')
		const { nickname } = freelancerNicknameParamSchema.parse(await context.params)

		const body = await request.json()
		const validated = updateFreelancerProfileSchema.parse(body)

		const resolved = await getFreelancerProfileRowByNickname(nickname)
		if (!resolved || resolved.userId !== session.user.id) {
			throw new NotFoundError('Freelancer profile not found')
		}

		const id = resolved.freelancerProfileId

		const patch: {
			specialization?: string | null
			hourly_rate?: number | null
			availability?: string | null
			experience?: string | null
			updated_at: Date
		} = {
			updated_at: new Date(),
		}

		if (validated.specialization !== undefined)
			patch.specialization = validated.specialization ?? null
		if (validated.hourlyRate !== undefined) patch.hourly_rate = validated.hourlyRate ?? null
		if (validated.availability !== undefined)
			patch.availability = validated.availability ?? null
		if (validated.experience !== undefined) patch.experience = validated.experience ?? null

		const saved = await kysely
			.updateTable('freelancer_profiles')
			.set(patch)
			.where('id', '=', id)
			.returningAll()
			.executeTakeFirstOrThrow()

		return successResponse({
			userId: saved.user_id,
			freelancerProfileId: saved.id,
			specialization: saved.specialization,
			hourlyRate: saved.hourly_rate,
			availability: saved.availability,
			experience: saved.experience,
			createdAt: saved.created_at,
			updatedAt: saved.updated_at,
		})
	} catch (error) {
		return errorResponse(error)
	}
}
