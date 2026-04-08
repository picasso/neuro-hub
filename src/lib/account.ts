import { getSession } from './auth/server'
import { countUnreadChatMessagesForUser } from './db/queries/chat'
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
	messages?: number
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
	const userId = session.user.id

	if (session.user.role === 'client') {
		const [projects, applications, messages] = await Promise.all([
			countClientProjects({ clientId: userId }),
			countActiveClientProjectApplications({ clientId: userId }),
			countUnreadChatMessagesForUser(userId),
		])

		return {
			role: 'client',
			projects,
			applications,
			messages,
		}
	}

	const [works, applications, messages] = await Promise.all([
		countFreelancerPortfolioWorks({ freelancerId: userId }),
		countActiveFreelancerApplications({ freelancerId: userId }),
		countUnreadChatMessagesForUser(userId),
	])

	return {
		role: 'freelancer',
		applications,
		works,
		messages,
	}
}
