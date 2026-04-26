import { ProfileEditor } from './profile/profile-editor'
import { getAccountContext } from '@/lib/account'
import { listUserProfileLanguages } from '@/lib/db/queries/user-profiles'
import { TS } from '@/ui'

export async function AccountProfile() {
	const context = await getAccountContext()
	if (!context) return null

	const { session, profileHeadline } = context
	const role = session.user.role === 'freelancer' ? 'freelancer' : 'client'

	const availableLanguages = await listUserProfileLanguages()

	return (
		<div className="w-full min-w-0">
			<TS clean variant="h3" gutterBottom content="Профиль" />
			<div className="mt-8">
				<ProfileEditor
					userId={session.user.id}
					role={role}
					availableLanguages={availableLanguages}
					headline={profileHeadline}
				/>
			</div>
		</div>
	)
}
