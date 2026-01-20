import { type NextRequest, NextResponse } from 'next/server'

const RATE_LIMIT_MAP = new Map<string, { count: number; resetTime: number }>()

const RATE_LIMIT_CONFIG = {
	windowMs: 60 * 1000,
	maxRequests: 100,
}

function getRateLimitKey(request: NextRequest): string {
	const forwarded = request.headers.get('x-forwarded-for')
	const ip = forwarded ? forwarded.split(',')[0] : 'unknown'
	return `${ip}`
}

function checkRateLimit(key: string): boolean {
	const now = Date.now()
	const userLimit = RATE_LIMIT_MAP.get(key)

	if (!userLimit || now > userLimit.resetTime) {
		RATE_LIMIT_MAP.set(key, {
			count: 1,
			resetTime: now + RATE_LIMIT_CONFIG.windowMs,
		})
		return true
	}

	if (userLimit.count >= RATE_LIMIT_CONFIG.maxRequests) {
		return false
	}

	userLimit.count++
	return true
}

export function proxy(request: NextRequest) {
	const response = NextResponse.next()

	if (request.nextUrl.pathname.startsWith('/api')) {
		const rateLimitKey = getRateLimitKey(request)
		const allowed = checkRateLimit(rateLimitKey)

		if (!allowed) {
			return NextResponse.json(
				{
					success: false,
					error: {
						message: 'Too many requests',
						code: 'RATE_LIMIT_EXCEEDED',
						statusCode: 429,
					},
				},
				{
					status: 429,
					headers: {
						'Retry-After': '60',
					},
				},
			)
		}

		response.headers.set('Access-Control-Allow-Origin', '*')
		response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
		response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
		response.headers.set('Access-Control-Max-Age', '86400')

		response.headers.set(
			'Content-Security-Policy',
			"default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;",
		)
		response.headers.set('X-Content-Type-Options', 'nosniff')
		response.headers.set('X-Frame-Options', 'DENY')
		response.headers.set('X-XSS-Protection', '1; mode=block')
		response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

		const start = Date.now()
		response.headers.set('X-Response-Time', `${Date.now() - start}ms`)
	}

	return response
}

export const config = {
	matcher: ['/api/:path*'],
}
