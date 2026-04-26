import { notFound } from 'next/navigation'
import { PersonCard } from '../entity-cards/person-card'
import { FreelancerPublic } from './freelancer-public'
import { getPublicFreelancerProfileByNickname } from '@/lib/db/queries/freelancers'
import { freelancerNicknameParamSchema } from '@/lib/validations'
import { PageShell, Stack } from '@/ui'

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
			<Stack vertical gap={8} align="stretch">
				<PersonCard full hero forcedEmptyBio freelancer={profile} />
				<FreelancerPublic profile={profile} />
			</Stack>
		</PageShell>
	)
}
