import { headers } from 'next/headers'
import { auth } from './config'

export async function getSession() {
	const headersList = await headers()
	return await auth.api.getSession({
		headers: headersList,
	})
}

export async function requireAuth() {
	const session = await getSession()

	if (!session) {
		throw new Error('Unauthorized')
	}

	return session
}

export async function requireRole(role: 'freelancer' | 'client') {
	const session = await requireAuth()

	if (session.user.role !== role) {
		throw new Error('Forbidden: insufficient permissions')
	}

	return session
}
