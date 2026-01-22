import { NextResponse } from 'next/server'
import { testConnection } from '@/lib/db'
import { successResponse, errorResponse } from '@/utils/api-response'

/**
 * @swagger
 * /api/health:
 *   get:
 *     tags:
 *       - Health
 *     summary: Health check endpoint
 *     description: Check if the API and database are operational
 *     responses:
 *       200:
 *         description: Service is healthy
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
 *                     status:
 *                       type: string
 *                       example: healthy
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *                     database:
 *                       type: string
 *                       example: connected
 *       503:
 *         description: Service unavailable
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function GET() {
	try {
		const dbConnected = await testConnection()

		if (!dbConnected) {
			return NextResponse.json(
				{
					success: false,
					error: {
						message: 'Database connection failed',
						code: 'DB_CONNECTION_ERROR',
						statusCode: 503,
					},
				},
				{ status: 503 },
			)
		}

		return successResponse({
			status: 'healthy',
			timestamp: new Date().toISOString(),
			database: 'connected',
		})
	} catch (error) {
		return errorResponse(error)
	}
}
