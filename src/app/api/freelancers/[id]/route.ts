import { requireRole } from '@/lib/auth/server'
import { kysely } from '@/lib/db'
import { getPublicFreelancerProfileByProfileId } from '@/lib/db/queries/freelancers'
import { freelancerProfileIdParamSchema, updateFreelancerProfileSchema } from '@/lib/validations'
import { errorResponse, successResponse } from '@/utils/api-response'
import { NotFoundError } from '@/utils/errors'

type RouteContext = {
	params: Promise<{ id: string }>
}

/**
 * @swagger
 * /api/freelancers/{id}:
 *   get:
 *     tags:
 *       - Freelancers
 *     summary: Get public freelancer profile
 *     description: >
 *       Returns public profile for a freelancer addressed by `freelancer_profiles.id` (UUID),
 *       including basic user profile info, freelancer profile fields, skills, and portfolio items.
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
		const { id } = freelancerProfileIdParamSchema.parse(await context.params)

		const publicProfile = await getPublicFreelancerProfileByProfileId(id)
		if (!publicProfile) throw new NotFoundError('Freelancer profile not found')

		return successResponse(publicProfile)
	} catch (error) {
		return errorResponse(error)
	}
}

/**
 * Update freelancer profile by user id (owner-only).
 */
export async function PUT(request: Request, context: RouteContext) {
	try {
		const session = await requireRole('freelancer')
		const { id } = freelancerProfileIdParamSchema.parse(await context.params)

		const body = await request.json()
		const validated = updateFreelancerProfileSchema.parse(body)

		const existing = await kysely
			.selectFrom('freelancer_profiles')
			.selectAll()
			.where('id', '=', id)
			.executeTakeFirst()

		if (!existing || existing.user_id !== session.user.id) {
			// hide existence details
			throw new NotFoundError('Freelancer profile not found')
		}

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
