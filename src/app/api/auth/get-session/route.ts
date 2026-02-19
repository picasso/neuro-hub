import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth/config'

export const runtime = 'nodejs'

/**
 * Development guardrail.
 *
 * This endpoint is used by server-side proxy/middleware (`src/proxy.ts`) on many requests.
 * When local Postgres isn't running, Better Auth session lookup can throw, which would otherwise
 * spam errors and potentially break navigation/redirects during development.
 *
 * Behavior:
 * - development: return `null` on any failure (log once)
 * - production: rethrow (fail fast)
 */
let didWarnDev = false

export async function GET(request: Request) {
	try {
		const session = await auth.api.getSession({
			headers: request.headers,
		})
		return NextResponse.json(session)
	} catch (error) {
		if (process.env.NODE_ENV === 'development') {
			if (!didWarnDev) {
				didWarnDev = true
				// eslint-disable-next-line no-console
				console.log('[auth] /api/auth/get-session failed (returning null in development).')
			}
			return NextResponse.json(null)
		}

		throw error
	}
}
