import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'
import { NextResponse } from 'next/server'
import { requireRole } from '@/lib/auth/server'
import { errorResponse } from '@/utils/api-response'
import { ForbiddenError } from '@/utils/errors'

const ALLOWED_CONTENT_TYPES = [
	'image/jpeg',
	'image/png',
	'image/webp',
	'image/gif',
	'video/mp4',
	'video/webm',
	'audio/mpeg',
	'audio/wav',
	'audio/webm',
	'application/pdf',
]

// Client uploads go directly browser -> Blob. Keep a reasonable per-file cap for MVP.
const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024 // 50MB

/**
 * @swagger
 * /api/blob/portfolio-upload:
 *   post:
 *     tags:
 *       - Blob Uploads
 *     summary: Create a client-upload token for portfolio media
 *     description: >
 *       Exchanges an authenticated user's session for a short-lived client upload token.
 *       Use this endpoint as `handleUploadUrl` with `upload()` from `@vercel/blob/client`.
 *       Files are uploaded under `portfolio/{userId}/...` (auth user id). After upload, create a
 *       portfolio item via `POST /api/freelancers/{nickname}/portfolio` (public nickname slug).
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
			onBeforeGenerateToken: async (pathname, clientPayload) => {
				const session = await requireRole('freelancer')

				// Enforce per-user folder isolation so one user can't generate tokens
				// for uploading into another user's folder.
				const expectedPrefix = `portfolio/${session.user.id}/`
				if (!pathname.startsWith(expectedPrefix)) {
					throw new ForbiddenError('Invalid upload pathname')
				}

				return {
					allowedContentTypes: ALLOWED_CONTENT_TYPES,
					maximumSizeInBytes: MAX_FILE_SIZE_BYTES,
					addRandomSuffix: true,
					tokenPayload: JSON.stringify({
						userId: session.user.id,
						clientPayload,
					}),
				}
			},
			onUploadCompleted: async ({ blob }) => {
				// Called by Vercel on upload completion (won't run on localhost without a tunnel).
				// Portfolio DB write happens explicitly via POST /api/freelancers/:nickname/portfolio.
				console.warn('portfolio blob upload completed', {
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
