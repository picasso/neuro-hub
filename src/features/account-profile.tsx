import { PendingContent } from './account-pending'
import { FreelancerProfileEditor } from './freelancer-profile/freelancer-profile-editor'
import { getAccountContext } from '@/lib/account'
import { Link, TS } from '@/ui'

export async function AccountProfile() {
	const context = await getAccountContext()
	if (!context) return null

	const { session, nickname } = context

	return (
		<div className="w-full min-w-0">
			<TS clean variant="h3" gutterBottom content="Профиль" />
			{/* <TS
				variant="body"
				color="secondary"
				className="mb-4"
				content={`Вы вошли как ${session.user.email}`}
			/> */}

			{session.user.role === 'freelancer' && nickname ? (
				<div className="mt-8">
					<TS
						variant="body"
						color="secondary"
						className="mb-2 text-sm"
						content="Публичная страница профиля:"
					/>
					<Link
						color="primary"
						hover="underline"
						href={`/freelancers/${nickname}`}
						className="break-all"
					>
						{`/freelancers/${nickname}`}
					</Link>

					<div className="mt-8">
						<FreelancerProfileEditor />
					</div>
				</div>
			) : (
				<PendingContent
					icon="construction"
					description="Редактирование профиля клиента будет добавлено позже."
				/>
			)}
		</div>
	)
}
