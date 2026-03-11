import { notFound } from 'next/navigation'
import { PublicFreelancerProfileView } from './public-profile-view'
import { getPublicFreelancerProfileByProfileId } from '@/lib/db/queries/freelancers'
import { freelancerProfileIdParamSchema } from '@/lib/validations'
import { Avatar, PageShell, Stack, TS } from '@/ui'

type PageProps = {
	params: Promise<{ id: string }>
}

export async function FreelancerProfilePage(props: PageProps) {
	const { id } = await props.params

	const parsedParams = freelancerProfileIdParamSchema.safeParse({ id })
	if (!parsedParams.success) notFound()

	const profile = await getPublicFreelancerProfileByProfileId(parsedParams.data.id)
	if (!profile) notFound()

	return (
		<PageShell preset="content">
			<div>
				<Stack gap={2} align="center" className="mb-8">
					<Avatar
						name={profile.userProfile?.name || 'Freelancer'}
						size="lg"
						src={profile.userProfile?.avatarUrl ?? undefined}
					/>
					<div className="min-w-0">
						<TS
							variant="h4"
							gutterBottom
							content={profile.userProfile?.name || 'Freelancer'}
						/>
						<TS
							variant="body"
							color="secondary"
							className="text-sm"
							content={
								profile.freelancer.specialization || 'Специализация не указана'
							}
						/>
					</div>
				</Stack>
				<PublicFreelancerProfileView profile={profile} />
			</div>
		</PageShell>
	)
}
