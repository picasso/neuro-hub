import { getSession } from './auth/server'
import { kysely } from './db'
import { countUnreadChatMessagesForUser } from './db/queries/chat'
import {
	countActiveFreelancerApplications,
	countFreelancerPortfolioWorks,
	getOrCreateFreelancerProfileByUserId,
} from './db/queries/freelancers'
import { countActiveClientProjectApplications, countClientProjects } from './db/queries/projects'
import { ensureUserProfileRow } from './db/queries/user-profiles'

type Session = NonNullable<Awaited<ReturnType<typeof getSession>>>
export type AccountRole = 'client' | 'freelancer'
export type AccountSnapshot = {
	role: AccountRole
	projects?: number
	applications?: number
	works?: number
	messages?: number
}
export type AccountViewer = {
	email: string
	displayName: string
	avatarUrl: string | null
}
export type AccountShellState = {
	viewer: AccountViewer
	snapshot: AccountSnapshot
}
export type AuthHeaderState = AccountShellState

export type AccountContext = {
	session: Session
	profileId: string | null
	nickname: string | null
	profileHeadline: string | null
}

export async function getAccountContext(): Promise<AccountContext | null> {
	const session = await getSession()

	if (!session) return null

	await ensureUserProfileRow(session.user.id)

	const userProfile = await kysely
		.selectFrom('user_profiles')
		.select(['nickname', 'company_name as companyName', 'company_role as companyRole'])
		.where('user_id', '=', session.user.id)
		.executeTakeFirst()

	const profileHeadline =
		session.user.role === 'client'
			? [userProfile?.companyName, userProfile?.companyRole]
					.map((value) => value?.trim())
					.filter(Boolean)
					.join(' ✶ ') || null
			: null

	if (session.user.role !== 'freelancer') {
		return {
			session,
			profileId: null,
			nickname: null,
			profileHeadline,
		}
	}

	const profile = await getOrCreateFreelancerProfileByUserId(session.user.id)

	return {
		session,
		profileId: profile?.id ?? null,
		nickname: userProfile?.nickname ?? null,
		profileHeadline: profile?.specialization ?? null,
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

export async function getAccountShellState(session: Session): Promise<AccountShellState> {
	const [snapshot, viewer] = await Promise.all([
		getAccountSnapshot(session),
		getAccountViewer(session),
	])

	return {
		viewer,
		snapshot,
	}
}

async function getAccountViewer(session: Session): Promise<AccountViewer> {
	const profile = await kysely
		.selectFrom('user_profiles')
		.select(['name', 'avatar_url as avatarUrl'])
		.where('user_id', '=', session.user.id)
		.executeTakeFirst()

	return {
		email: session.user.email,
		displayName: profile?.name?.trim() || session.user.name?.trim() || session.user.email,
		avatarUrl: profile?.avatarUrl ?? session.user.image ?? null,
	}
}
