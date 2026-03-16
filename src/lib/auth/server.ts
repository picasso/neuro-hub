import { headers } from 'next/headers'
import { cache } from 'react'
import { auth } from './config'
import { kysely } from '@/lib/db'
import { ForbiddenError, UnauthorizedError } from '@/utils/errors'

async function readSession() {
	const headersList = await headers()
	const session = await auth.api.getSession({
		headers: headersList,
	})

	// handle the case when a user was deleted but a stale session still exists (e.g. cookie cache)
	if (!session) return null

	const user = await kysely
		.selectFrom('users')
		.select(['id'])
		.where('id', '=', session.user.id)
		.executeTakeFirst()

	if (!user) return null

	return session
}

export const getSession = cache(async function getSession() {
	return readSession()
})

let didWarnDevSsrSession = false

export const getSsrSafeSession = cache(async function getSsrSafeSession() {
	try {
		return await readSession()
	} catch (error) {
		if (process.env.NODE_ENV === 'development') {
			if (!didWarnDevSsrSession) {
				didWarnDevSsrSession = true
				console.warn(
					'[auth] SSR session lookup failed (returning null in development).',
					error,
				)
			}
			return null
		}

		throw error
	}
})

export async function requireAuth() {
	const session = await getSession()

	if (!session) throw new UnauthorizedError()

	return session
}

export async function requireRole(role: 'freelancer' | 'client') {
	const session = await requireAuth()

	if (session.user.role !== role) {
		throw new ForbiddenError('Forbidden: insufficient permissions')
	}

	return session
}
