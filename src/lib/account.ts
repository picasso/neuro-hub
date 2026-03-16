import { getSession } from './auth/server'
import { getOrCreateFreelancerProfileByUserId } from './db/queries/freelancers'

export type AccountContext = {
	session: NonNullable<Awaited<ReturnType<typeof getSession>>>
	profileId: string | null
}

export async function getAccountContext(): Promise<AccountContext | null> {
	const session = await getSession()

	if (!session) return null

	const profile =
		session.user.role === 'freelancer'
			? await getOrCreateFreelancerProfileByUserId(session.user.id)
			: null

	return {
		session,
		profileId: profile?.id ?? null,
	}
}
