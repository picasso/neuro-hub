import { map, startCase } from 'lodash'
import { type ReactNode } from 'react'
import { PersonCardHero } from './person-card-hero'
import { formatList } from './utils'
import type { ChatParticipantSummary } from '@/lib/chat/contracts'
import type {
	PublicFreelancerGridItem,
	PublicFreelancerProfile,
} from '@/lib/db/queries/freelancers'
import type { ProjectClientSummary } from '@/lib/db/queries/projects'
import { Avatar, Card, Stack, TS } from '@/ui'
import { cn } from '@/utils'

type Freelancer = PublicFreelancerGridItem | PublicFreelancerProfile

export type PersonCardProps = {
	full?: boolean
	className?: string
	hero?: boolean
	actions?: ReactNode
	forcedEmpty?: boolean
} & (
	| { client: ProjectClientSummary; chat?: never; freelancer?: never }
	| { client?: never; chat: ChatParticipantSummary; freelancer?: never }
	| { client?: never; chat?: never; freelancer: Freelancer }
)

export function PersonCard({
	className,
	full,
	hero,
	actions,
	forcedEmpty,
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

	// if (props.variant === 'client') {
	// 	return (
	// 		<PersonCardClientShell href={props.href} className={className} full={full}>
	// 			<PersonCardClientBody client={props.client} full={full} />
	// 		</PersonCardClientShell>
	// 	)
	// }
	// if (props.variant === 'participant') {
	// 	return (
	// 		<Card
	// 			fullWidth
	// 			size="sm"
	// 			className={cn('max-w-none gap-0 py-3', className)}
	// 			contentClassName="p-0"
	// 		>
	// 			<PersonCardParticipantBody participant={props.participant} full={full} />
	// 		</Card>
	// 	)
	// }

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
				forcedBio={forcedEmpty}
				name={name}
				nickname={nickname}
				headline={headline}
				avatarUrl={avatarUrl}
				location={location}
				languages={languages}
			/>
		)
	}

	return (
		<Card
			data-entity={id}
			hoverable
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
			<Stack vertical gap={full ? 4 : 3} align="stretch" className="px-4">
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
							color="secondary"
							className={cn(full ? 'line-clamp-2 leading-normal' : 'line-clamp-1')}
						>
							{formatList(
								client ? [company, companyRole] : [subtitle],
								client ? 'building' : 'brain-circuit',
							)}
						</TS>
					</Stack>
				</Stack>
				{/* {full ? (
					<>
						<TS
							clean
							variant="subtitle"
							color="secondary"
							className="line-clamp-3"
							content={
								toSnippet(freelancer.bio) ||
								'Пользователь еще не добавил описание, но уже доступен для просмотра профиля.'
							}
						/>
						<Stack wrap gap={1.5} align="start">
							{visibleSkills.map((skill) => (
								<Badge key={skill.id} variant="secondary" size="xs">
									{skill.name}
								</Badge>
							))}
							{remainingSkills > 0 ? (
								<Badge variant="outline" size="xs">
									+{remainingSkills}
								</Badge>
							) : null}
						</Stack>
					</>
				) : null} */}
			</Stack>
		</Card>
	)
}

function toSnippet(value: string | null, maxLength = 160) {
	if (!value) return null

	const normalized = value.replace(/\s+/g, ' ').trim()
	if (normalized.length <= maxLength) return normalized
	return `${normalized.slice(0, maxLength - 1).trimEnd()}…`
}

type FreelancerData = Pick<
	PublicFreelancerGridItem,
	| 'name'
	| 'nickname'
	| 'avatarUrl'
	| 'location'
	| 'languages'
	| 'bio'
	| 'specialization'
	| 'hourlyRate'
	| 'availability'
	| 'topSkills'
	| 'portfolioCount'
	| 'latestPortfolioItem'
>

function getFreelancerData(freelancer: Freelancer | null): FreelancerData {
	if (!freelancer) return {} as FreelancerData
	if ('userProfile' in freelancer)
		return {
			nickname: freelancer.nickname,
			name: freelancer.userProfile?.name ?? null,
			avatarUrl: freelancer.userProfile?.avatarUrl ?? null,
			location: freelancer.userProfile?.location ?? null,
			bio: freelancer.userProfile?.bio ?? null,
			languages: freelancer.languages,
			...freelancer.freelancer,
			topSkills: map(freelancer.skills, (skill) => ({
				id: skill.skillId,
				name: skill.skill.name,
				category: skill.skill.category,
				proficiencyLevel: skill.proficiencyLevel,
			})),
			portfolioCount: freelancer.portfolio.length,
			latestPortfolioItem: freelancer.portfolio[0]
				? {
						id: freelancer.portfolio[0].id,
						title: freelancer.portfolio[0].title,
						mediaUrl: freelancer.portfolio[0].mediaUrl,
						mediaType: freelancer.portfolio[0].mediaType,
						category: freelancer.portfolio[0].category,
					}
				: null,
		}

	return freelancer
}

// function PersonCardClientShell({
// 	href,
// 	className,
// 	full,
// 	children,
// }: {
// 	href?: Route
// 	className?: string
// 	full: boolean
// 	children: ReactNode
// }) {
// 	const inner = (
// 		<Card
// 			fullWidth
// 			size="sm"
// 			hoverable={!!href}
// 			className={cn(full ? 'max-w-none gap-0 py-4' : 'max-w-none gap-0 py-3', className)}
// 			contentClassName="p-0"
// 		>
// 			{children}
// 		</Card>
// 	)
// 	if (!href) return inner
// 	return (
// 		<Link href={href} hover="underline" className="block no-underline hover:no-underline">
// 			{inner}
// 		</Link>
// 	)
// }

// function PersonCardClientBody({ client, full }: { client: ProjectClientSummary; full: boolean }) {
// 	const { title, subtitle } = clientCardLines(client)
// 	return (
// 		<Stack gap={3} align="center" className="px-4">
// 			<Avatar name={title} src={client.avatarUrl ?? undefined} size="lg" />
// 			<Stack vertical gap={full ? 1 : 0} align="stretch" className="min-w-0 flex-1">
// 				<TS clean variant="subtitle" className="truncate font-semibold" content={title} />
// 				{subtitle ? (
// 					<TS
// 						clean
// 						variant="caption"
// 						color="secondary"
// 						className={cn(full ? 'line-clamp-2' : 'line-clamp-1')}
// 						content={subtitle}
// 					/>
// 				) : null}
// 				{full && client.companyRole ? (
// 					<Badge variant="outline" size="xs" className="w-fit">
// 						{client.companyRole}
// 					</Badge>
// 				) : null}
// 			</Stack>
// 		</Stack>
// 	)
// }

// function PersonCardParticipantBody({
// 	participant,
// 	full,
// }: {
// 	participant: ChatParticipantSummary
// 	full: boolean
// }) {
// 	return (
// 		<Stack gap={3} align="center" className="px-4">
// 			<Avatar name={participant.name} src={participant.image ?? undefined} size="lg" />
// 			<Stack vertical gap={1} align="stretch" className="min-w-0 flex-1">
// 				<Stack gap={2} align="center" wrap>
// 					<TS
// 						clean
// 						variant="subtitle"
// 						className="min-w-0 truncate font-semibold"
// 						content={participant.name}
// 					/>
// 					<Badge variant={full ? 'secondary' : 'outline'} size="xs">
// 						{participantRoleLabel(participant.role)}
// 					</Badge>
// 				</Stack>
// 				{full ? (
// 					<TS
// 						clean
// 						variant="caption"
// 						color="secondary"
// 						className="line-clamp-2"
// 						content={`Роль в чате: ${participantRoleLabel(participant.role)}`}
// 					/>
// 				) : null}
// 			</Stack>
// 		</Stack>
// 	)
// }

// function PersonCardFreelancerBody({
// 	freelancer,
// 	full,
// }: {
// 	freelancer: PersonCardFreelancerProps['freelancer']
// 	full: boolean
// }) {
// 	const title = freelancer.name || 'Фрилансер'
// 	const visibleSkills = freelancer.topSkills.slice(0, 3)
// 	const remainingSkills = freelancer.topSkills.length - visibleSkills.length
// 	return (
// 		<Stack vertical={full} gap={full ? 4 : 3} align="stretch" className="px-4">
// 			<Stack gap={3} align="center">
// 				<Avatar name={title} src={freelancer.avatarUrl ?? undefined} size="lg" />
// 				<Stack vertical gap={0} align="stretch" className="min-w-0 flex-1">
// 					<TS
// 						clean
// 						variant="subtitle"
// 						className="truncate font-semibold"
// 						content={title}
// 					/>
// 					<TS
// 						clean
// 						variant="caption"
// 						color="secondary"
// 						className={cn(full ? 'line-clamp-2 leading-normal' : 'line-clamp-1')}
// 						content={freelancer.specialization || 'Специализация не указана'}
// 					/>
// 				</Stack>
// 			</Stack>
// 			{full ? (
// 				<>
// 					<TS
// 						clean
// 						variant="subtitle"
// 						color="secondary"
// 						className="line-clamp-3"
// 						content={
// 							freelancer.bioSnippet ||
// 							'Пользователь еще не добавил описание, но уже доступен для просмотра профиля.'
// 						}
// 					/>
// 					<Stack wrap gap={1.5} align="start">
// 						{visibleSkills.map((skill) => (
// 							<Badge key={skill.id} variant="secondary" size="xs">
// 								{skill.name}
// 							</Badge>
// 						))}
// 						{remainingSkills > 0 ? (
// 							<Badge variant="outline" size="xs">
// 								+{remainingSkills}
// 							</Badge>
// 						) : null}
// 					</Stack>
// 				</>
// 			) : null}
// 		</Stack>
// 	)
// }

// function clientCardLines(client: ProjectClientSummary) {
// 	const title = client.name ?? client.companyName ?? 'Заказчик'
// 	const subtitleParts: string[] = []
// 	if (client.companyName && client.name) subtitleParts.push(client.companyName)
// 	if (client.companyRole) subtitleParts.push(client.companyRole)
// 	const subtitle = subtitleParts.length ? subtitleParts.join(' · ') : null
// 	return { title, subtitle }
// }

// function participantRoleLabel(role: ChatParticipantSummary['role']) {
// 	switch (role) {
// 		case 'customer':
// 			return 'Заказчик'
// 		case 'freelancer':
// 			return 'Исполнитель'
// 		default:
// 			return role
// 	}
// }

// function freelancerMeta(freelancer: PersonCardFreelancerProps['freelancer']) {
// 	return [formatRate(freelancer.hourlyRate), freelancer.availability].filter(Boolean).join(' · ')
// }

// function renderPreview(freelancer: PersonCardFreelancerProps['freelancer']) {
// 	const portfolio = freelancer.latestPortfolioItem
// 	if (portfolio && isImagePreview(portfolio.mediaUrl, portfolio.mediaType)) {
// 		return portfolio.mediaUrl
// 	}

// 	return (
// 		<Stack
// 			vertical
// 			align="center"
// 			justify="center"
// 			className="h-full w-full bg-linear-to-br from-muted/80 via-muted/50 to-background px-4 text-center"
// 		>
// 			<Stack vertical gap={2} align="center">
// 				<div className="mx-auto flex size-12 items-center justify-center rounded-full bg-background/80 shadow-sm">
// 					<Icon
// 						name={portfolio ? mediaPlaceholderIcon(portfolio.mediaType) : 'image'}
// 						size="md"
// 					/>
// 				</div>
// 				<TS
// 					clean
// 					thin
// 					variant="subtitle"
// 					content={portfolio ? portfolio.title : 'Портфолио скоро появится'}
// 				/>
// 				<TS
// 					clean
// 					variant="caption"
// 					color="secondary"
// 					content={
// 						portfolio
// 							? 'Последняя работа пока без image preview'
// 							: 'Пока без опубликованных работ'
// 					}
// 				/>
// 			</Stack>
// 		</Stack>
// 	)
// }

// function formatRate(rate: number | null) {
// 	if (!rate) return null
// 	return `$${rate === -1 ? '' : rate}/hr`
// }

// function isImagePreview(url: string, mediaType: string | null) {
// 	if (mediaType?.startsWith('image/')) return true
// 	return /\.(png|jpe?g|webp|gif|avif|svg)$/i.test(url)
// }

// function mediaPlaceholderIcon(mediaType: string | null) {
// 	if (mediaType?.startsWith('video/')) return 'video'
// 	if (mediaType?.startsWith('audio/')) return 'volume'
// 	return 'image'
// }
