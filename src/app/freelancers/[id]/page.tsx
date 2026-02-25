import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import { notFound } from 'next/navigation'
import { PublicFreelancerProfileView } from '@/components/features/freelancer-profile'
import { TS } from '@/components/ui/text-styled'
import { getPublicFreelancerProfileByProfileId } from '@/lib/db/queries/freelancers'
import { freelancerProfileIdParamSchema } from '@/lib/validations'

type PageProps = {
	params: Promise<{ id: string }>
}

export default async function FreelancerPublicProfilePage(props: PageProps) {
	const { id } = await props.params

	const parsedParams = freelancerProfileIdParamSchema.safeParse({ id })
	if (!parsedParams.success) notFound()

	const profile = await getPublicFreelancerProfileByProfileId(parsedParams.data.id)
	if (!profile) notFound()

	return (
		<Container maxWidth="md">
			<Box sx={{ mt: 6, mb: 8 }}>
				<Stack direction="row" spacing={2} sx={{ mb: 4, alignItems: 'center' }}>
					<Avatar
						src={profile.userProfile?.avatarUrl ?? undefined}
						sx={{ width: 64, height: 64 }}
					/>
					<Box sx={{ minWidth: 0 }}>
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
					</Box>
				</Stack>

				<PublicFreelancerProfileView profile={profile} />
			</Box>
		</Container>
	)
}
