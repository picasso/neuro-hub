import { type NextRequest, NextResponse } from 'next/server'

type DebugPattern = {
	pattern: string
	status: number
	message: string
	delay?: number
}

const DEBUG_PATTERNS: DebugPattern[] = [
	{
		pattern: '@user.er',
		status: 400,
		message: 'Пользователь с таким email уже существует',
	},
	{
		pattern: '@server.er',
		status: 500,
		message: 'Внутренняя ошибка сервера',
	},
	{
		pattern: '@slow.er',
		status: 200,
		message: 'Пользователь успешно создан',
		delay: 5000,
	},
]

export async function debugAuthMiddleware(request: NextRequest): Promise<NextResponse | null> {
	const isDebugMode = process.env.DEBUG_AUTH_ERRORS === 'true'

	if (!isDebugMode) {
		return null
	}

	if (request.method !== 'POST') {
		return null
	}

	try {
		const clonedRequest = request.clone()
		const body = await clonedRequest.json()

		const email = body.email

		if (!email || typeof email !== 'string') {
			return null
		}

		for (const debugPattern of DEBUG_PATTERNS) {
			if (email.includes(debugPattern.pattern)) {
				if (debugPattern.delay) {
					await new Promise((resolve) => setTimeout(resolve, debugPattern.delay))
				}

				if (debugPattern.status === 200) {
					return null
				}

				return NextResponse.json(
					{
						error: {
							message: debugPattern.message,
							code: debugPattern.status === 400 ? 'VALIDATION_ERROR' : 'SERVER_ERROR',
							statusCode: debugPattern.status,
						},
					},
					{ status: debugPattern.status },
				)
			}
		}
	} catch (error) {
		console.error('Debug middleware error:', error)
	}

	return null
}
