import { getSession } from './auth/server'
import {
	countActiveFreelancerApplications,
	countFreelancerPortfolioWorks,
	getOrCreateFreelancerProfileByUserId,
} from './db/queries/freelancers'
import { countActiveClientProjectApplications, countClientProjects } from './db/queries/projects'

type Session = NonNullable<Awaited<ReturnType<typeof getSession>>>
export type AccountRole = 'client' | 'freelancer'
export type AccountSnapshot = {
	role: AccountRole
	projects?: number
	applications?: number
	works?: number
}

export type AccountContext = {
	session: Session
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

export async function getAccountSnapshot(session: Session): Promise<AccountSnapshot> {
	if (session.user.role === 'client') {
		const [projects, applications] = await Promise.all([
			countClientProjects({ clientId: session.user.id }),
			countActiveClientProjectApplications({ clientId: session.user.id }),
		])

		return {
			role: 'client',
			projects,
			applications,
		}
	}

	const [works, applications] = await Promise.all([
		countFreelancerPortfolioWorks({ freelancerId: session.user.id }),
		countActiveFreelancerApplications({ freelancerId: session.user.id }),
	])

	return {
		role: 'freelancer',
		applications,
		works,
	}
}
