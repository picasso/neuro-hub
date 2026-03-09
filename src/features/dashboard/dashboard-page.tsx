import { redirect } from 'next/navigation'
import { FreelancerProfileEditor } from '@/features/freelancer-profile/freelancer-profile-editor'
import { PortfolioEditor } from '@/features/portfolio/portfolio-editor'
import { getSession } from '@/lib/auth/server'
import { getOrCreateFreelancerProfileByUserId } from '@/lib/db/queries/freelancers'
import { Link, TS } from '@/ui'

export async function DashboardPage() {
	const session = await getSession()

	if (!session) redirect('/login?next=/dashboard')

	const freelancerProfile =
		session.user.role === 'freelancer'
			? await getOrCreateFreelancerProfileByUserId(session.user.id)
			: null

	// safety: user can be deleted while a stale session cookie still exists
	if (session.user.role === 'freelancer' && !freelancerProfile) redirect('/login?next=/dashboard')

	return (
		<div className="container max-w-3xl mx-auto px-4">
			<div className="mt-16 mb-16">
				<TS variant="h3" gutterBottom content="Личный кабинет" />
				<TS
					variant="body"
					color="secondary"
					className="mb-4"
					content={`Вы вошли как ${session.user.email}`}
				/>

				{session.user.role === 'freelancer' && freelancerProfile ? (
					<div className="mt-8">
						<TS
							variant="body"
							color="secondary"
							className="text-sm mb-2"
							content="Публичная страница профиля:"
						/>
						<Link
							color="primary"
							hover="underline"
							href={`/freelancers/${freelancerProfile.id}`}
						>
							{`/freelancers/${freelancerProfile.id}`}
						</Link>

						<div className="mt-8">
							<FreelancerProfileEditor />
						</div>

						<div className="mt-10">
							<PortfolioEditor
								userId={session.user.id}
								profileId={freelancerProfile.id}
							/>
						</div>
					</div>
				) : (
					<TS
						variant="body"
						color="secondary"
						className="text-sm"
						content="Редактирование профиля клиента будет добавлено позже."
					/>
				)}
			</div>
		</div>
	)
}
