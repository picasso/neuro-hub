import { requireAuth } from '@/lib/auth/server'
import { kysely } from '@/lib/db'
import { generateFallbackNickname } from '@/lib/user-profile/nickname'
import { updateUserProfileSchema } from '@/lib/validations'
import { errorResponse, successResponse } from '@/utils/api-response'
import { ConflictError, ValidationError } from '@/utils/errors'

function isUniqueViolation(error: unknown) {
	return (error as { code?: string })?.code === '23505'
}

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
 *               nickname:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 30
 *               location:
 *                 type: string
 *                 maxLength: 255
 *                 nullable: true
 *               bio:
 *                 type: string
 *                 maxLength: 500
 *               avatarUrl:
 *                 oneOf:
 *                   - type: string
 *                     format: uri
 *                   - type: string
 *                     pattern: ^/
 *                 description: Absolute URL or root-relative path (starts with "/")
 *               companyName:
 *                 type: string
 *               companyRole:
 *                 type: string
 *               languages:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required: [languageCode, langLevel]
 *                   properties:
 *                     languageCode:
 *                       type: string
 *                     langLevel:
 *                       type: string
 *                       enum: [basic, conversational, fluent, native]
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       401:
 *         description: Unauthorized
 *       400:
 *         description: Validation error
 *       409:
 *         description: Nickname already taken
 */
export async function PUT(request: Request) {
	try {
		const session = await requireAuth()

		const body = await request.json()
		const validatedData = updateUserProfileSchema.parse(body)

		const profile = await kysely.transaction().execute(async (trx) => {
			const patch: Record<string, unknown> = {
				updated_at: new Date(),
			}

			if (validatedData.name !== undefined) patch.name = validatedData.name
			if (validatedData.nickname !== undefined) patch.nickname = validatedData.nickname
			if (validatedData.location !== undefined) patch.location = validatedData.location
			if (validatedData.bio !== undefined) patch.bio = validatedData.bio
			if (validatedData.avatarUrl !== undefined) patch.avatar_url = validatedData.avatarUrl
			if (validatedData.companyName !== undefined)
				patch.company_name = validatedData.companyName
			if (validatedData.companyRole !== undefined)
				patch.company_role = validatedData.companyRole

			const inserted = await trx
				.insertInto('user_profiles')
				.values({
					id: session.user.id,
					user_id: session.user.id,
					name: validatedData.name ?? null,
					nickname:
						validatedData.nickname ??
						generateFallbackNickname(
							validatedData.name ?? session.user.name,
							session.user.id,
						),
					location: validatedData.location ?? null,
					bio: validatedData.bio ?? null,
					avatar_url: validatedData.avatarUrl ?? null,
					company_name: validatedData.companyName ?? null,
					company_role: validatedData.companyRole ?? null,
					updated_at: new Date(),
				})
				.onConflict((oc) => oc.column('user_id').doUpdateSet(patch))
				.returningAll()
				.executeTakeFirstOrThrow()

			if (validatedData.languages !== undefined) {
				const codes = validatedData.languages.map((l) => l.languageCode)
				const known =
					codes.length > 0
						? await trx
								.selectFrom('languages')
								.select('code')
								.where('code', 'in', codes)
								.execute()
						: []
				const knownSet = new Set(known.map((r) => r.code))
				for (const code of codes) {
					if (!knownSet.has(code)) {
						throw new ValidationError(`Unknown language code: ${code}`)
					}
				}

				await trx
					.deleteFrom('user_languages')
					.where('user_id', '=', session.user.id)
					.execute()

				if (validatedData.languages.length > 0) {
					await trx
						.insertInto('user_languages')
						.values(
							validatedData.languages.map((l) => ({
								user_id: session.user.id,
								language_code: l.languageCode,
								lang_level: l.langLevel,
								created_at: new Date(),
							})),
						)
						.execute()
				}
			}

			return inserted
		})

		const languageRows = await kysely
			.selectFrom('user_languages')
			.innerJoin('languages', 'languages.code', 'user_languages.language_code')
			.where('user_languages.user_id', '=', session.user.id)
			.select([
				'languages.code as languageCode',
				'languages.name as name',
				'languages.native_name as nativeName',
				'user_languages.lang_level as langLevel',
			])
			.orderBy('languages.sort_order', 'asc')
			.execute()

		return successResponse({
			id: profile.user_id,
			userId: profile.user_id,
			name: profile.name,
			nickname: profile.nickname,
			location: profile.location,
			bio: profile.bio,
			avatarUrl: profile.avatar_url,
			companyName: profile.company_name,
			companyRole: profile.company_role,
			languages: languageRows.map((l) => ({
				languageCode: l.languageCode,
				name: l.name,
				nativeName: l.nativeName,
				langLevel: l.langLevel,
			})),
			createdAt: profile.created_at,
			updatedAt: profile.updated_at,
		})
	} catch (error) {
		if (isUniqueViolation(error)) {
			return errorResponse(new ConflictError('This nickname is already taken'))
		}
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
 *       401:
 *         description: Unauthorized
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

		const languageRows = await kysely
			.selectFrom('user_languages')
			.innerJoin('languages', 'languages.code', 'user_languages.language_code')
			.where('user_languages.user_id', '=', session.user.id)
			.select([
				'languages.code as languageCode',
				'languages.name as name',
				'languages.native_name as nativeName',
				'user_languages.lang_level as langLevel',
			])
			.orderBy('languages.sort_order', 'asc')
			.execute()

		return successResponse({
			id: profile.user_id,
			userId: profile.user_id,
			name: profile.name,
			nickname: profile.nickname,
			location: profile.location,
			bio: profile.bio,
			avatarUrl: profile.avatar_url,
			companyName: profile.company_name,
			companyRole: profile.company_role,
			languages: languageRows.map((l) => ({
				languageCode: l.languageCode,
				name: l.name,
				nativeName: l.nativeName,
				langLevel: l.langLevel,
			})),
			createdAt: profile.created_at,
			updatedAt: profile.updated_at,
		})
	} catch (error) {
		return errorResponse(error)
	}
}
