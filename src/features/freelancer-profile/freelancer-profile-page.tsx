import { notFound } from 'next/navigation'
import { FreelancerPublic } from './freelancer-public'
import { getPublicFreelancerProfileByNickname } from '@/lib/db/queries/freelancers'
import { freelancerNicknameParamSchema } from '@/lib/validations'
import { Avatar, PageShell, Stack, TS } from '@/ui'

type PageProps = {
	params: Promise<{ nickname: string }>
}

export async function FreelancerProfilePage(props: PageProps) {
	const { nickname } = await props.params

	const parsedParams = freelancerNicknameParamSchema.safeParse({ nickname })
	if (!parsedParams.success) notFound()

	const profile = await getPublicFreelancerProfileByNickname(parsedParams.data.nickname)
	if (!profile) notFound()

	return (
		<PageShell preset="public">
			<Stack gap={4} className="mb-8">
				<Avatar
					name={profile.userProfile?.name || 'Freelancer'}
					size="lg"
					src={profile.userProfile?.avatarUrl ?? undefined}
				/>
				<div className="min-w-0">
					<TS clean variant="h4" content={profile.userProfile?.name || 'Freelancer'} />
					<TS
						clean
						variant="body"
						color="secondary"
						className="text-sm"
						content={profile.freelancer.specialization || 'Специализация не указана'}
					/>
				</div>
			</Stack>
			<FreelancerPublic profile={profile} />
		</PageShell>
	)
}
