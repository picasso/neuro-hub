import { type ReactNode } from 'react'
import { Skills } from './skills'
import {
	formatBudget,
	formatDeadline,
	formatValue,
	describeClient,
	type CommonProps,
	formatTruncated,
	formatCaps,
} from './utils'
import type { PublicProjectListItem } from '@/lib/db/queries/projects'
import { Badge, Card, Stack, TimeDetails, TS } from '@/ui'
import { cn } from '@/utils'

type ProjectItem = Omit<PublicProjectListItem, 'href' | 'descriptionSnippet'> & {
	href?: PublicProjectListItem['href']
	descriptionSnippet?: PublicProjectListItem['descriptionSnippet']
}

type ProjectCardProps = CommonProps & {
	item: ProjectItem
	children?: ReactNode
	slimFooter?: boolean
}

export function ProjectCard({
	item,
	full,
	hoverable,
	splitTagsAt,
	children,
	slimFooter,
}: CommonProps & ProjectCardProps) {
	const {
		experienceLevel,
		deadline,
		createdAt,
		skills,
		title,
		coverUrl,
		descriptionSnippet,
		client,
		category,
	} = item

	const footer = (
		<Stack vertical gap={3} align="stretch" className="w-full">
			{full && !slimFooter && <Skills skills={skills} splitAt={splitTagsAt} />}

			<Stack
				justify={slimFooter ? 'end' : 'space-between'}
				gap={3}
				className={cn('w-full', full && 'sm:items-center')}
			>
				{!slimFooter && (
					<Badge
						variant="outline"
						size="xs"
						color="success"
						label={formatBudget(item)}
						// we need a wrapper to avoid gaps between currency and value
						md={{ container: true }}
					/>
				)}
				<TimeDetails timestamp={createdAt} withTime={false} prefix="Опубликован" />
			</Stack>
		</Stack>
	)
	return (
		<Card
			fullWidth
			hoverable={hoverable}
			className="h-full gap-0 py-0"
			footer={footer}
			header={
				<>
					<Badge
						variant="outline"
						size="xs"
						color="contrast"
						className={cn(
							'absolute bottom-12 left-3 tracking-wide',
							full && 'bottom-16 left-6',
						)}
					>
						{formatValue(experienceLevel, 'experience')}
					</Badge>
					<Badge
						variant="outline"
						size="xs"
						color="cta"
						wider
						className={cn('absolute bottom-5 left-3', full && 'bottom-8 left-6')}
						label={formatCaps(category)}
					/>
					<Badge
						moreContrast
						variant="outline"
						color="contrast"
						size="xs"
						className={cn('absolute top-3 right-3', full && 'top-6 right-6')}
						label={formatDeadline(deadline, true)}
					/>
				</>
			}
			image={coverUrl ?? 'project'}
			imageAspect={coverUrl ? (full ? 'video' : '2/1') : undefined}
			compact={!full}
		>
			{children}
			{!children && (
				<Stack vertical gap={3} align="stretch" className="h-full pb-2">
					<Stack vertical gap={1} align="stretch" className="min-w-0">
						<TS clean variant="h4" className="line-clamp-2" content={title} />
						<TS clean variant="subtitle" color="secondary" className="line-clamp-1">
							{formatTruncated(describeClient(client), 'building')}
						</TS>
					</Stack>

					<TS
						clean
						variant="caption"
						color="dimmed"
						className={cn(full ? 'line-clamp-4' : 'line-clamp-2')}
						content={descriptionSnippet}
					/>
				</Stack>
			)}
		</Card>
	)
}
