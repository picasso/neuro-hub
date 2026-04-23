import { ProfileEditor } from './profile/profile-editor'
import { getAccountContext } from '@/lib/account'
import { kysely } from '@/lib/db'
import { ensureUserProfileRow, listUserProfileLanguages } from '@/lib/db/queries/user-profiles'
import { TS } from '@/ui'

export async function AccountProfile() {
	const context = await getAccountContext()
	if (!context) return null

	const { session } = context
	await ensureUserProfileRow(session.user.id)
	const role = session.user.role === 'freelancer' ? 'freelancer' : 'client'

	const availableLanguages = await listUserProfileLanguages()
	const freelancerProfile =
		role === 'freelancer'
			? await kysely
					.selectFrom('freelancer_profiles')
					.select(['specialization'])
					.where('user_id', '=', session.user.id)
					.executeTakeFirst()
			: null

	return (
		<div className="w-full min-w-0">
			<TS clean variant="h3" gutterBottom content="Профиль" />
			<div className="mt-8">
				<ProfileEditor
					userId={session.user.id}
					role={role}
					availableLanguages={availableLanguages}
					headline={freelancerProfile?.specialization ?? null}
				/>
			</div>
		</div>
	)
}
