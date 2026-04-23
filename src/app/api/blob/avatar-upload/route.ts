import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'
import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth/server'
import { errorResponse } from '@/utils/api-response'
import { ForbiddenError } from '@/utils/errors'

const ALLOWED_CONTENT_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024 // 10MB

/**
 * @swagger
 * /api/blob/avatar-upload:
 *   post:
 *     tags:
 *       - Blob Uploads
 *     summary: Create a client-upload token for profile avatar images
 *     description: >
 *       Exchanges an authenticated user's session for a short-lived client upload token.
 *       Use as `handleUploadUrl` with `upload()` from `@vercel/blob/client`.
 *       Files are stored under `avatars/{userId}/...`. After upload, persist the returned URL
 *       via `PUT /api/user/profile` as `avatarUrl`.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Upload token created
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
export async function POST(request: Request): Promise<NextResponse> {
	const body = (await request.json()) as HandleUploadBody

	try {
		const jsonResponse = await handleUpload({
			body,
			request,
			onBeforeGenerateToken: async (pathname) => {
				const session = await requireAuth()

				const expectedPrefix = `avatars/${session.user.id}/`
				if (!pathname.startsWith(expectedPrefix)) {
					throw new ForbiddenError('Invalid upload pathname')
				}

				return {
					allowedContentTypes: ALLOWED_CONTENT_TYPES,
					maximumSizeInBytes: MAX_FILE_SIZE_BYTES,
					addRandomSuffix: true,
					tokenPayload: JSON.stringify({
						userId: session.user.id,
					}),
				}
			},
			onUploadCompleted: async ({ blob }) => {
				console.warn('avatar blob upload completed', {
					url: blob.url,
					pathname: blob.pathname,
					contentType: blob.contentType,
				})
			},
		})

		return NextResponse.json(jsonResponse)
	} catch (error) {
		return errorResponse(error)
	}
}
