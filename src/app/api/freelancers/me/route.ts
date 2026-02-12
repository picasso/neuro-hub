import { requireRole } from '@/lib/auth/server'
import { getOrCreateFreelancerProfileByUserId } from '@/lib/db/queries/freelancers'
import { errorResponse, successResponse } from '@/utils/api-response'

/**
 * @swagger
 * /api/freelancers/me:
 *   get:
 *     tags:
 *       - Freelancers
 *     summary: Get or create current user's freelancer profile
 *     description: Returns the authenticated user's freelancer profile; creates an empty one if missing.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Freelancer profile (created if absent)
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
export async function GET() {
	try {
		const session = await requireRole('freelancer')

		const profile = await getOrCreateFreelancerProfileByUserId(session.user.id)
		return successResponse({
			profileId: profile.id,
			userId: profile.user_id,
			specialization: profile.specialization,
			hourlyRate: profile.hourly_rate,
			availability: profile.availability,
			experience: profile.experience,
			createdAt: profile.created_at,
			updatedAt: profile.updated_at,
		})
	} catch (error) {
		return errorResponse(error)
	}
}
