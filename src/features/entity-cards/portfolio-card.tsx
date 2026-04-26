import { find } from 'lodash'
import { PersonCard } from './person-card'
import { Skills } from './skills'
import {
	type CommonProps,
	formatCaps,
	formatRate,
	type Freelancer,
	getFreelancerData,
	isImage,
	placeholderIcon,
} from './utils'
import { Badge, Card, type CardProps, Icon, Stack, TS } from '@/ui'
import { cn, pluralizeRuWithCount } from '@/utils'

export type PortfolioCardProps = CommonProps & {
	item: 'last' | string
	className?: string
	imageAspect?: CardProps['imageAspect']
	// display even empty bio block
	forcedEmptyBio?: boolean
	bioSnippet?: true | number
	freelancer: Freelancer
}

export function PortfolioCard({
	item: id,
	className,
	imageAspect,
	full,
	hoverable,
	forcedEmptyBio,
	splitTagsAt,
	bioSnippet,
	freelancer,
}: PortfolioCardProps) {
	const fdata = getFreelancerData(freelancer)
	const profileId = freelancer?.freelancerProfileId
	const item = id === 'last' ? fdata.latestPortfolioItem : find(fdata.portfolio, { id })

	const badge = formatCaps(item?.category)
	const title = item?.title
	const footer = (
		<Stack vertical gap={3} align="stretch" className="w-full">
			{full && <Skills skills={fdata.topSkills} splitAt={splitTagsAt} />}
			<Stack justify="space-between" gap={3} className="mt-auto">
				<Badge
					variant="outline"
					size="xs"
					color="success"
					label={formatRate(fdata.hourlyRate) ?? 'ставки не указаны'}
					// we need a wrapper to avoid gaps between currency and value
					md={{ container: true }}
				/>
				<Badge
					variant="secondary"
					size="xs"
					label={pluralizeRuWithCount(fdata.portfolioCount, 'work')}
				/>
			</Stack>
		</Stack>
	)

	return (
		<Card
			data-entity={profileId}
			hoverable={hoverable}
			image={renderPreview(item?.mediaUrl, item?.mediaType, item?.title)}
			imageAspect={imageAspect ?? (full ? '3/2' : '3/1')}
			badge={badge}
			badgeProps={{ color: 'cta', wider: true }}
			titleOver={true}
			title={title}
			footer={footer}
			className={cn('h-full gap-1 overflow-hidden', className)}
		>
			<PersonCard
				full={full}
				innerOnly
				freelancer={freelancer}
				forcedEmptyBio={forcedEmptyBio}
				bioSnippet={bioSnippet}
			/>
		</Card>
	)
}

function renderPreview(mediaUrl?: string, mediaType?: string | null, title?: string) {
	if (mediaUrl && isImage(mediaUrl, mediaType)) {
		return mediaUrl
	}

	return (
		<Stack
			vertical
			align="center"
			justify="center"
			className="h-full w-full bg-linear-to-br from-accent to-accent-foreground/80 px-4 text-center"
		>
			<Stack vertical gap={2} align="center">
				<div className="mx-auto flex size-12 items-center justify-center rounded-full bg-background/80 shadow-sm">
					<Icon name={mediaUrl ? placeholderIcon(mediaType) : 'image'} size="md" />
				</div>
				<TS
					clean
					thin
					variant="subtitle"
					content={title ? title : 'Портфолио скоро появится'}
				/>
			</Stack>
		</Stack>
	)
}
