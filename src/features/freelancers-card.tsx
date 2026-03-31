import type { PublicFreelancerGridItem } from '@/lib/db/queries/freelancers'
import type { Route } from 'next'
import { Avatar, Badge, Card, Icon, Link, Stack, TS } from '@/ui'
import { pluralizeRuWithCount } from '@/utils'

type FreelancerGridCardProps = {
	item: PublicFreelancerGridItem
}

export function FreelancerGridCard({ item }: FreelancerGridCardProps) {
	const rate = formatRate(item.hourlyRate)
	const meta = [rate, item.availability].filter(Boolean).join(' · ')
	const visibleSkills = item.topSkills.slice(0, 3)
	const remainingSkills = item.topSkills.length - visibleSkills.length

	return (
		<Link
			href={item.href as Route}
			hover="underline"
			className="group block h-full no-underline hover:no-underline"
		>
			<Card
				image={renderPreview(item)}
				imageAspect="3/2"
				badge={item.latestPortfolioItem ? 'Latest work' : 'Portfolio soon'}
				className="h-full gap-1 overflow-hidden transition-all group-hover:-translate-y-1 group-hover:shadow-xs"
				titleOver={true}
				title={item.latestPortfolioItem?.title}
			>
				<Stack vertical gap={4} align="stretch" className="flex-1 p-0">
					<Stack gap={3}>
						<Avatar
							name={item.name || 'Freelancer'}
							src={item.avatarUrl ?? undefined}
							size="lg"
						/>
						<Stack vertical gap={0} align="stretch" className="min-w-0 flex-1">
							<TS
								clean
								variant="subtitle"
								className="truncate font-semibold text-foreground"
								content={item.name || 'Freelancer'}
							/>
							<TS
								clean
								variant="caption"
								color="secondary"
								className="line-clamp-2 leading-normal"
								content={
									item.specialization || 'Специализация будет добавлена позже'
								}
							/>
						</Stack>
					</Stack>

					<TS
						clean
						variant="subtitle"
						color="secondary"
						className="line-clamp-3"
						content={
							item.bioSnippet ||
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

					<Stack justify="space-between" gap={3} className="mt-auto">
						<TS
							clean
							variant="caption"
							color="secondary"
							content={meta || `ставки (${formatRate(-1)}) не указаны`}
						/>
						<TS
							clean
							variant="caption"
							color="secondary"
							content={pluralizeRuWithCount(item.portfolioCount, 'work')}
						/>
					</Stack>
				</Stack>
			</Card>
		</Link>
	)
}

function renderPreview(item: PublicFreelancerGridItem) {
	const portfolio = item.latestPortfolioItem
	if (portfolio && isImagePreview(portfolio.mediaUrl, portfolio.mediaType)) {
		return portfolio.mediaUrl
	}

	return (
		<Stack
			vertical
			align="center"
			justify="center"
			className="h-full w-full bg-linear-to-br from-muted/80 via-muted/50 to-background px-4 text-center"
		>
			<Stack vertical gap={2} align="center">
				<div className="mx-auto flex size-12 items-center justify-center rounded-full bg-background/80 shadow-sm">
					<Icon
						name={portfolio ? mediaPlaceholderIcon(portfolio.mediaType) : 'image'}
						size="md"
					/>
				</div>
				<TS
					clean
					thin
					variant="subtitle"
					content={portfolio ? portfolio.title : 'Портфолио скоро появится'}
				/>
				<TS
					clean
					variant="caption"
					color="secondary"
					content={
						portfolio
							? 'Последняя работа пока без image preview'
							: 'Пока без опубликованных работ'
					}
				/>
			</Stack>
		</Stack>
	)
}

function formatRate(rate: number | null) {
	if (!rate) return null
	return `$${rate === -1 ? '' : rate}/hr`
}

function isImagePreview(url: string, mediaType: string | null) {
	if (mediaType?.startsWith('image/')) return true
	return /\.(png|jpe?g|webp|gif|avif|svg)$/i.test(url)
}

function mediaPlaceholderIcon(mediaType: string | null) {
	if (mediaType?.startsWith('video/')) return 'video'
	if (mediaType?.startsWith('audio/')) return 'volume'
	return 'image'
}
