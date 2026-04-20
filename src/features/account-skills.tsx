import { PendingContent } from './account-pending'
import { AccountSkillsEditor } from './skills/skills-editor'
import { getAccountContext } from '@/lib/account'
import { TS } from '@/ui'

export async function AccountSkillsExperience() {
	const context = await getAccountContext()
	if (!context) return null

	const { session } = context

	if (session.user.role !== 'freelancer') {
		return (
			<div className="w-full min-w-0">
				<TS clean variant="h3" gutterBottom content="Skills & Experience" />
				<PendingContent
					icon="construction"
					description="Этот раздел доступен только фрилансерам."
				/>
			</div>
		)
	}

	return <AccountSkillsEditor />
}
