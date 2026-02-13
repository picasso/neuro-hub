import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Link from '@mui/material/Link'
import { redirect } from 'next/navigation'
import { FreelancerProfileEditor } from '@/components/features/freelancer-profile'
import { PortfolioEditor } from '@/components/forms/portfolio'
import { TS } from '@/components/ui/text-styled'
import { getSession } from '@/lib/auth/server'
import { getOrCreateFreelancerProfileByUserId } from '@/lib/db/queries/freelancers'

export default async function DashboardPage() {
	const session = await getSession()

	if (!session) redirect('/login?next=/dashboard')

	const freelancerProfile =
		session.user.role === 'freelancer'
			? await getOrCreateFreelancerProfileByUserId(session.user.id)
			: null

	// safety: user can be deleted while a stale session cookie still exists
	if (session.user.role === 'freelancer' && !freelancerProfile) redirect('/login?next=/dashboard')

	return (
		<Container maxWidth="md">
			<Box sx={{ mt: 8, mb: 8 }}>
				<TS variant="h3" gutterBottom content="Личный кабинет" />
				<TS
					variant="body1"
					color="text.secondary"
					content={`Вы вошли как ${session.user.email}`}
					sx={{ mb: 2 }}
				/>

				{session.user.role === 'freelancer' && freelancerProfile ? (
					<Box sx={{ mt: 4 }}>
						<TS
							variant="body2"
							color="text.secondary"
							content="Публичная страница профиля:"
							sx={{ mb: 1 }}
						/>
						<Link href={`/freelancers/${freelancerProfile.id}`} underline="hover">
							{`/freelancers/${freelancerProfile.id}`}
						</Link>

						<Box sx={{ mt: 4 }}>
							<FreelancerProfileEditor />
						</Box>

						<Box sx={{ mt: 5 }}>
							<PortfolioEditor
								userId={session.user.id}
								profileId={freelancerProfile.id}
							/>
						</Box>
					</Box>
				) : (
					<TS
						variant="body2"
						color="text.secondary"
						content="Редактирование профиля клиента будет добавлено позже."
					/>
				)}
			</Box>
		</Container>
	)
}
