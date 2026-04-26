import { startCase } from 'lodash'
import { type ReactNode } from 'react'
import { PersonCardBio } from './person-card-bio'
import { PersonCardHero } from './person-card-hero'
import { type CommonProps, formatTruncated, getFreelancerData, toSnippet } from './utils'
import type { ChatParticipantSummary } from '@/lib/chat/contracts'
import type {
	PublicFreelancerGridItem,
	PublicFreelancerProfile,
} from '@/lib/db/queries/freelancers'
import type { ProjectClientSummary } from '@/lib/db/queries/projects'
import { Avatar, Card, Stack, TS } from '@/ui'
import { cn } from '@/utils'

type Freelancer = PublicFreelancerGridItem | PublicFreelancerProfile

export type PersonCardProps = CommonProps & {
	className?: string
	hero?: boolean
	actions?: ReactNode
	// display even empty bio block
	forcedEmptyBio?: boolean
	bioSnippet?: boolean
	innerOnly?: boolean
	multiline?: boolean
} & (
		| { client: ProjectClientSummary; chat?: never; freelancer?: never }
		| { client?: never; chat: ChatParticipantSummary; freelancer?: never }
		| { client?: never; chat?: never; freelancer: Freelancer }
	)

export function PersonCard({
	className,
	full,
	hoverable,
	hero,
	actions,
	forcedEmptyBio,
	bioSnippet,
	innerOnly,
	multiline,
	splitTagsAt: _,
	client,
	chat,
	freelancer,
}: PersonCardProps) {
	const isClient = !!client
	const isChat = !!chat
	const isFreelancer = !!freelancer

	const fdata = getFreelancerData(isFreelancer ? freelancer : null)
	const fallbackName = isClient ? 'Заказчик' : isChat ? 'Участник' : 'Фрилансер'
	const id = client?.userId ?? chat?.id ?? freelancer?.freelancerProfileId
	const name = client?.name ?? chat?.name ?? fdata.name ?? fallbackName
	const avatarUrl = client ? client.avatarUrl : chat ? chat.image : fdata.avatarUrl
	const nickname = isClient ? client.nickname : (fdata.nickname ?? '')
	const headline = isClient ? client?.companyRole : (fdata.specialization ?? null)
	const location = isClient ? client?.location : (fdata.location ?? null)
	const languages = isClient ? client?.languages : (fdata.languages ?? null)
	const rawBio = isClient ? client?.bio : (fdata.bio ?? null)
	const bio = full ? rawBio : toSnippet(rawBio)

	const badge = fdata.latestPortfolioItem ? 'Latest work' : 'Portfolio soon'
	const title = fdata.latestPortfolioItem?.title
	const subtitle = fdata.specialization ?? 'Специализация не указана'
	const company = isClient ? client?.companyName : null
	const companyRole = isClient && client?.companyRole ? startCase(client.companyRole) : null

	if (hero) {
		return (
			<PersonCardHero
				full={full}
				isClient={isClient}
				bio={bio}
				forcedBio={forcedEmptyBio}
				name={name}
				nickname={nickname}
				headline={headline}
				avatarUrl={avatarUrl}
				location={location}
				languages={languages}
			/>
		)
	}

	const inner = (
		<Stack
			vertical
			gap={full ? 4 : 3}
			align="stretch"
			className={cn('px-4', innerOnly && 'p-0')}
		>
			<Stack gap={3} align="center">
				<Avatar name={name} src={avatarUrl} color="auto" size="lg" />
				<Stack vertical gap={0} align="stretch" className="min-w-0 flex-1">
					<TS
						clean
						variant="subtitle"
						className="truncate font-semibold"
						content={name}
					/>
					<TS
						clean
						variant="caption"
						color="dimmed"
						className={cn(full && 'leading-normal')}
					>
						{formatTruncated(
							client ? [company, companyRole] : subtitle,
							client ? 'building' : 'brain-circuit',
							multiline,
						)}
					</TS>
				</Stack>
			</Stack>
			{full && (
				<PersonCardBio
					value={rawBio}
					innerOnly={innerOnly}
					forcedEmpty={forcedEmptyBio}
					snippet={bioSnippet}
				/>
			)}
		</Stack>
	)

	return innerOnly ? (
		inner
	) : (
		<Card
			data-entity={id}
			hoverable={hoverable}
			fullWidth
			size={full ? 'default' : 'sm'}
			// className="max-w-none gap-0 py-3"
			className={cn('h-full gap-1 overflow-hidden', className)}
			contentClassName="p-0 pb-2"
			// image={renderPreview(props.freelancer)}
			imageAspect="3/2"
			badge={isFreelancer && full ? badge : undefined}
			titleOver={full}
			title={title}
			footer={
				actions
				// <Stack justify="space-between" gap={3} className="w-full">
				// 	<TS
				// 		clean
				// 		variant="caption"
				// 		color="secondary"
				// 		content={
				// 			freelancerMeta(props.freelancer) ||
				// 			`ставки (${formatRate(-1)}) не указаны`
				// 		}
				// 	/>
				// 	<TS
				// 		clean
				// 		variant="caption"
				// 		color="secondary"
				// 		content={pluralizeRuWithCount(props.freelancer.portfolioCount, 'work')}
				// 	/>
				// </Stack>
			}
		>
			{inner}
		</Card>
	)
}
