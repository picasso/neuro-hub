import { Skills } from './skills'
import { formatBudget, formatDeadline, formatValue, describeClient, formatList } from './utils'
import type { PublicProjectListItem } from '@/lib/db/queries/projects'
import { Badge, Card, Stack, TimeDetails, TS } from '@/ui'
import { cn } from '@/utils'

type ProjectCardProps = {
	item: PublicProjectListItem
	full?: boolean
}

export function ProjectCard({ item, full }: ProjectCardProps) {
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
			{full && <Skills skills={skills} />}
			<Stack
				justify="space-between"
				gap={3}
				className={cn('w-full', full && 'sm:items-center')}
			>
				<Badge variant="outline" size="xs" color="success" label={formatBudget(item)} />
				<TimeDetails timestamp={createdAt} withTime={false} prefix="Опубликован" />
			</Stack>
		</Stack>
	)
	return (
		<Card
			fullWidth
			hoverable
			className="h-full gap-0 py-0"
			footer={footer}
			header={
				<>
					<Badge
						variant="outline"
						size="xs"
						color="contrast"
						className="absolute bottom-5 left-3"
					>
						{formatValue(experienceLevel, 'experience')}
					</Badge>
					<Badge
						moreContrast
						variant="outline"
						color="contrast"
						size="xs"
						className="absolute top-3 right-3"
						label={formatDeadline(deadline, true)}
					/>
				</>
			}
			image={coverUrl ?? 'project'}
			imageAspect={coverUrl ? (full ? 'video' : '2/1') : undefined}
			compact={!full}
		>
			<Stack vertical gap={3} align="stretch" className="h-full pb-2">
				<Stack vertical gap={1} align="stretch" className="min-w-0">
					<TS clean variant="h4" className="line-clamp-2" content={title} />
					<TS clean variant="subtitle" color="secondary" className="line-clamp-1">
						{formatList([describeClient(client), category], 'building')}
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
		</Card>
	)
}
