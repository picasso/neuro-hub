import { requireRole } from '@/lib/auth/server'
import { kysely } from '@/lib/db'
import { getOrCreateFreelancerProfileByUserId } from '@/lib/db/queries/freelancers'
import { ensureUserProfileRow } from '@/lib/db/queries/user-profiles'
import { errorResponse, successResponse } from '@/utils/api-response'
import { UnauthorizedError } from '@/utils/errors'

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

		await ensureUserProfileRow(session.user.id)

		const profile = await getOrCreateFreelancerProfileByUserId(session.user.id)
		if (!profile) throw new UnauthorizedError('User not found (stale session)')

		const userProfile = await kysely
			.selectFrom('user_profiles')
			.select('nickname')
			.where('user_id', '=', session.user.id)
			.executeTakeFirstOrThrow()

		return successResponse({
			nickname: userProfile.nickname,
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
