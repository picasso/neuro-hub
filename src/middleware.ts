import { betterFetch } from '@better-fetch/fetch'
import { NextResponse, type NextRequest } from 'next/server'
import type { Session } from 'better-auth/types'

const publicPaths = ['/', '/api/auth', '/api/health', '/api/docs', '/api/reference']
const authPaths = ['/login', '/register', '/forgot-password']

export async function middleware(request: NextRequest) {
	const pathname = request.nextUrl.pathname

	if (publicPaths.some((path) => pathname.startsWith(path))) {
		return NextResponse.next()
	}

	const { data: session } = await betterFetch<Session>('/api/auth/get-session', {
		baseURL: request.nextUrl.origin,
		headers: {
			cookie: request.headers.get('cookie') || '',
		},
	})

	if (!session) {
		if (authPaths.some((path) => pathname.startsWith(path))) {
			return NextResponse.next()
		}
		const loginUrl = new URL('/login', request.url)
		loginUrl.searchParams.set('from', pathname)
		return NextResponse.redirect(loginUrl)
	}

	if (authPaths.some((path) => pathname.startsWith(path))) {
		return NextResponse.redirect(new URL('/dashboard', request.url))
	}

	return NextResponse.next()
}

export const config = {
	matcher: [
		'/((?!_next/static|_next/image|favicon.ico|public|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
	],
}
