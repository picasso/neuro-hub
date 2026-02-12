import { map } from 'lodash'
import { nanoid } from 'nanoid'
import { requireAuth } from '@/lib/auth/server'
import { kysely } from '@/lib/db'
import { addUserSkillsSchema } from '@/lib/validations'
import { createdResponse, errorResponse, successResponse } from '@/utils/api-response'

/**
 * @swagger
 * /api/user-skills:
 *   post:
 *     tags:
 *       - User Skills
 *     summary: Add user skills
 *     description: Add multiple skills to the authenticated user's profile
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - skills
 *             properties:
 *               skills:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: object
 *                   required:
 *                     - skillId
 *                     - proficiencyLevel
 *                   properties:
 *                     skillId:
 *                       type: string
 *                       format: uuid
 *                       example: "550e8400-e29b-41d4-a716-446655440000"
 *                     proficiencyLevel:
 *                       type: string
 *                       enum: [beginner, intermediate, advanced, expert]
 *                       example: "intermediate"
 *     responses:
 *       201:
 *         description: Skills added successfully
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
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "V1StGXR8_Z5jdHi6B-myT"
 *                       userId:
 *                         type: string
 *                         example: "usr_2aF9k3LmN0pQ"
 *                       skillId:
 *                         type: string
 *                         format: uuid
 *                       proficiencyLevel:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
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
export async function POST(request: Request) {
	try {
		const session = await requireAuth()

		const body = await request.json()
		const validatedData = addUserSkillsSchema.parse(body)

		const insertedSkills = await kysely.transaction().execute(async (trx) => {
			await trx.deleteFrom('user_skills').where('user_id', '=', session.user.id).execute()

			const userSkillsToInsert = map(validatedData.skills, (skill) => ({
				id: nanoid(),
				user_id: session.user.id,
				skill_id: skill.skillId,
				proficiency_level: skill.proficiencyLevel,
			}))

			return await trx
				.insertInto('user_skills')
				.values(userSkillsToInsert)
				.returningAll()
				.execute()
		})

		const formattedSkills = map(insertedSkills, (skill) => ({
			id: skill.id,
			userId: skill.user_id,
			skillId: skill.skill_id,
			proficiencyLevel: skill.proficiency_level,
			createdAt: skill.created_at,
		}))

		return createdResponse(formattedSkills)
	} catch (error) {
		return errorResponse(error)
	}
}

/**
 * @swagger
 * /api/user-skills:
 *   get:
 *     tags:
 *       - User Skills
 *     summary: Get user skills
 *     description: Get all skills for the authenticated user with skill details
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Skills retrieved successfully
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
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "V1StGXR8_Z5jdHi6B-myT"
 *                       userId:
 *                         type: string
 *                         example: "usr_2aF9k3LmN0pQ"
 *                       skillId:
 *                         type: string
 *                         format: uuid
 *                       proficiencyLevel:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       skill:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             format: uuid
 *                           name:
 *                             type: string
 *                           category:
 *                             type: string
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

		const userSkills = await kysely
			.selectFrom('user_skills')
			.innerJoin('skills', 'user_skills.skill_id', 'skills.id')
			.where('user_skills.user_id', '=', session.user.id)
			.select([
				'user_skills.id',
				'user_skills.user_id',
				'user_skills.skill_id',
				'user_skills.proficiency_level',
				'user_skills.created_at',
				'skills.name as skill_name',
				'skills.category as skill_category',
			])
			.execute()

		const formattedSkills = map(userSkills, (skill) => ({
			id: skill.id,
			userId: skill.user_id,
			skillId: skill.skill_id,
			proficiencyLevel: skill.proficiency_level,
			createdAt: skill.created_at,
			skill: {
				id: skill.skill_id,
				name: skill.skill_name,
				category: skill.skill_category,
			},
		}))

		return successResponse(formattedSkills)
	} catch (error) {
		return errorResponse(error)
	}
}
