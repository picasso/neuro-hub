import { sql } from 'kysely'
import { requireRole } from '@/lib/auth/server'
import { kysely } from '@/lib/db'
import { getFreelancerProfileRowByNickname } from '@/lib/db/queries/freelancers'
import { createPortfolioItemSchema, freelancerNicknameParamSchema } from '@/lib/validations'
import { createdResponse, errorResponse, successResponse } from '@/utils/api-response'
import { NotFoundError } from '@/utils/errors'

type RouteContext = {
	params: Promise<{ nickname: string }>
}

/**
 * @swagger
 * /api/freelancers/{nickname}/portfolio:
 *   get:
 *     tags:
 *       - Portfolio
 *     summary: List public portfolio items for a freelancer
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
 *         name: nickname
 *         required: true
 *         schema:
 *           type: string
 *         description: Public nickname slug
 *         example: "jane-ai"
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
 *               mediaWidth:
 *                 type: integer
 *                 example: 1200
 *               mediaHeight:
 *                 type: integer
 *                 example: 800
 *               caption:
 *                 type: string
 *                 example: "Скриншот главного экрана"
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
		const { nickname } = freelancerNicknameParamSchema.parse(await context.params)

		const resolved = await getFreelancerProfileRowByNickname(nickname)
		if (!resolved) throw new NotFoundError('Freelancer profile not found')

		const items = await kysely
			.selectFrom('portfolio_items')
			.selectAll()
			.where('freelancer_profile_id', '=', resolved.freelancerProfileId)
			.orderBy('created_at', 'desc')
			.execute()

		return successResponse(
			items.map((p) => ({
				id: p.id,
				title: p.title,
				description: p.description,
				mediaUrl: p.media_url,
				mediaType: p.media_type,
				mediaWidth: p.media_width,
				mediaHeight: p.media_height,
				caption: p.caption,
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
		const { nickname } = freelancerNicknameParamSchema.parse(await context.params)

		const resolved = await getFreelancerProfileRowByNickname(nickname)
		if (!resolved || resolved.userId !== session.user.id) {
			throw new NotFoundError('Freelancer profile not found')
		}

		const freelancerProfileId = resolved.freelancerProfileId

		const body = await request.json()
		const validated = createPortfolioItemSchema.parse(body)
		const imageDimensions = await resolveImageDimensions({
			mediaType: validated.mediaType,
			mediaUrl: validated.mediaUrl,
			mediaWidth: validated.mediaWidth,
			mediaHeight: validated.mediaHeight,
		})

		const inserted = await kysely
			.insertInto('portfolio_items')
			.values({
				freelancer_profile_id: freelancerProfileId,
				title: validated.title,
				description: validated.description ?? null,
				media_url: validated.mediaUrl,
				media_type: validated.mediaType ?? null,
				media_width: imageDimensions?.width ?? validated.mediaWidth ?? null,
				media_height: imageDimensions?.height ?? validated.mediaHeight ?? null,
				caption: validated.caption ?? null,
				category: validated.category ?? null,
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
			mediaWidth: inserted.media_width,
			mediaHeight: inserted.media_height,
			caption: inserted.caption,
			category: inserted.category,
			toolsUsed: inserted.tools_used,
			createdAt: inserted.created_at,
			updatedAt: inserted.updated_at,
		})
	} catch (error) {
		return errorResponse(error)
	}
}

async function resolveImageDimensions({
	mediaType,
	mediaUrl,
	mediaWidth,
	mediaHeight,
}: {
	mediaType?: string
	mediaUrl: string
	mediaWidth?: number
	mediaHeight?: number
}) {
	if (!mediaType?.startsWith('image/')) return null
	if (mediaWidth && mediaHeight) return { width: mediaWidth, height: mediaHeight }

	let url: URL
	try {
		url = new URL(mediaUrl)
	} catch {
		return null
	}

	if (url.protocol !== 'https:' || !url.hostname.endsWith('.public.blob.vercel-storage.com')) {
		return null
	}

	const response = await fetch(url, { cache: 'no-store' })
	if (!response.ok) return null

	const bytes = new Uint8Array(await response.arrayBuffer())
	return parseImageDimensions(bytes)
}

function parseImageDimensions(bytes: Uint8Array) {
	return (
		parsePngDimensions(bytes) ??
		parseGifDimensions(bytes) ??
		parseWebpDimensions(bytes) ??
		parseJpegDimensions(bytes)
	)
}

function parsePngDimensions(bytes: Uint8Array) {
	if (bytes.length < 24) return null
	if (
		bytes[0] !== 0x89 ||
		bytes[1] !== 0x50 ||
		bytes[2] !== 0x4e ||
		bytes[3] !== 0x47 ||
		bytes[4] !== 0x0d ||
		bytes[5] !== 0x0a ||
		bytes[6] !== 0x1a ||
		bytes[7] !== 0x0a
	) {
		return null
	}

	const width = readUint32BE(bytes, 16)
	const height = readUint32BE(bytes, 20)
	return width && height ? { width, height } : null
}

function parseGifDimensions(bytes: Uint8Array) {
	if (bytes.length < 10) return null
	const signature =
		String.fromCharCode(bytes[0], bytes[1], bytes[2]) +
		String.fromCharCode(bytes[3], bytes[4], bytes[5])
	if (signature !== 'GIF87a' && signature !== 'GIF89a') return null

	const width = readUint16LE(bytes, 6)
	const height = readUint16LE(bytes, 8)
	return width && height ? { width, height } : null
}

function parseWebpDimensions(bytes: Uint8Array) {
	if (bytes.length < 30) return null
	const riff = String.fromCharCode(bytes[0], bytes[1], bytes[2], bytes[3])
	const webp = String.fromCharCode(bytes[8], bytes[9], bytes[10], bytes[11])
	if (riff !== 'RIFF' || webp !== 'WEBP') return null

	const chunk = String.fromCharCode(bytes[12], bytes[13], bytes[14], bytes[15])
	if (chunk === 'VP8X') {
		const width = 1 + readUint24LE(bytes, 24)
		const height = 1 + readUint24LE(bytes, 27)
		return width && height ? { width, height } : null
	}
	if (chunk === 'VP8 ' && bytes.length >= 30) {
		const width = readUint16LE(bytes, 26) & 0x3fff
		const height = readUint16LE(bytes, 28) & 0x3fff
		return width && height ? { width, height } : null
	}
	if (chunk === 'VP8L' && bytes.length >= 25) {
		const b1 = bytes[21]
		const b2 = bytes[22]
		const b3 = bytes[23]
		const b4 = bytes[24]
		const width = 1 + (((b2 & 0x3f) << 8) | b1)
		const height = 1 + (((b4 & 0x0f) << 10) | (b3 << 2) | ((b2 & 0xc0) >> 6))
		return width && height ? { width, height } : null
	}
	return null
}

function parseJpegDimensions(bytes: Uint8Array) {
	if (bytes.length < 4 || bytes[0] !== 0xff || bytes[1] !== 0xd8) return null

	let offset = 2
	while (offset + 9 < bytes.length) {
		if (bytes[offset] !== 0xff) {
			offset += 1
			continue
		}

		const marker = bytes[offset + 1]
		offset += 2

		if (marker === 0xd8 || marker === 0xd9) continue
		if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) continue
		if (offset + 1 >= bytes.length) return null

		const segmentLength = readUint16BE(bytes, offset)
		if (segmentLength < 2 || offset + segmentLength > bytes.length) return null

		const isStartOfFrame =
			(marker >= 0xc0 && marker <= 0xc3) ||
			(marker >= 0xc5 && marker <= 0xc7) ||
			(marker >= 0xc9 && marker <= 0xcb) ||
			(marker >= 0xcd && marker <= 0xcf)

		if (isStartOfFrame) {
			const height = readUint16BE(bytes, offset + 3)
			const width = readUint16BE(bytes, offset + 5)
			return width && height ? { width, height } : null
		}

		offset += segmentLength
	}

	return null
}

function readUint16BE(bytes: Uint8Array, offset: number) {
	return (bytes[offset] << 8) | bytes[offset + 1]
}

function readUint16LE(bytes: Uint8Array, offset: number) {
	return bytes[offset] | (bytes[offset + 1] << 8)
}

function readUint24LE(bytes: Uint8Array, offset: number) {
	return bytes[offset] | (bytes[offset + 1] << 8) | (bytes[offset + 2] << 16)
}

function readUint32BE(bytes: Uint8Array, offset: number) {
	return (
		bytes[offset] * 2 ** 24 +
		(bytes[offset + 1] << 16) +
		(bytes[offset + 2] << 8) +
		bytes[offset + 3]
	)
}
