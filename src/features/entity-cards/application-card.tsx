import { formatBudget, formatDeadline, formatList, formatValue } from './utils'
import type {
	ClientProjectApplicationListItem,
	FreelancerApplicationListItem,
} from '@/lib/db/queries/projects'
import type { Route } from 'next'
import { Badge, Card, Link, Stack, TimeDetails, TS } from '@/ui'
import { cn } from '@/utils'

// id: string;
//     status: string;
//     coverLetter: string;
//     proposedPrice: number;
//     proposedDeadline: Date | null;
//     createdAt: Date | null;
//     updatedAt: Date | null;

// 	id: string;
//     status: string;
//     coverLetter: string;
//     proposedPrice: number;
//     proposedDeadline: Date | null;
//     createdAt: Date | null;
//     updatedAt: Date | null;
type BaseApplication = Pick<
	FreelancerApplicationListItem,
	| 'id'
	| 'status'
	| 'coverLetter'
	| 'proposedPrice'
	| 'proposedDeadline'
	| 'createdAt'
	| 'updatedAt'
>
export type ApplicationCardProps = BaseApplication & {
	project?: FreelancerApplicationListItem['project']
	freelancer?: ClientProjectApplicationListItem['freelancer']
	full?: boolean
	className?: string
}

export function ApplicationCard({
	project,
	coverLetter,
	proposedPrice,
	proposedDeadline,
	status,
	createdAt,
	freelancer,
	full = false,
	className,
}: ApplicationCardProps) {
	const visibleSkills = project ? project.skills.slice(0, 4) : []
	const remainingSkills = project ? project.skills.length - visibleSkills.length : 0

	const footer = (
		<Stack vertical gap={3} align="stretch" className="w-full text-xs">
			{project &&
				full &&
				formatList(
					[
						'Бюджет проекта:',
						<Badge
							variant="outline"
							size="xs"
							color="success"
							label={formatBudget(project)}
						/>,
					],
					null,
					null,
				)}
			{formatList(
				[
					'Предложение:',
					<Badge
						variant="outline"
						size="xs"
						color="warning"
						label={formatBudget(proposedPrice)}
					/>,
				],
				null,
				null,
			)}

			<Stack
				justify="space-between"
				gap={3}
				className={cn('w-full', full && 'sm:items-center')}
			>
				{formatList(
					[
						'Cрок:',
						<Badge
							variant="outline"
							size="xs"
							color="info"
							label={
								proposedDeadline ? formatDeadline(proposedDeadline) : 'не указан'
							}
						/>,
					],
					null,
					null,
				)}
				<TimeDetails timestamp={createdAt} withTime={false} prefix="Подана" />
			</Stack>
		</Stack>
	)

	return (
		<Card
			fullWidth
			className={cn('h-full gap-0 py-0', className)}
			image="request"
			header={
				<>
					<Badge
						moreContrast
						variant="outline"
						color="contrast"
						size="xs"
						className="absolute top-3 right-3"
						label={formatValue(status, 'applicationStatus')}
					/>
				</>
			}
			footer={footer}
		>
			<Stack vertical gap={3} align="stretch" className="h-full pb-2">
				<Stack vertical gap={1} align="stretch" className="min-w-0">
					{project && full && (
						<Stack wrap gap={2} justify="space-between" align="start">
							<Link
								href={project.href as Route}
								hover="underline"
								className="min-w-0"
							>
								<TS
									clean
									variant="h5"
									className="line-clamp-2"
									content={project.title}
								/>
							</Link>
						</Stack>
					)}
					{freelancer?.name && (
						<TS clean variant="subtitle" color="secondary" className="line-clamp-1">
							{formatList(['Андрей Рублев'], 'user-plus')}
						</TS>
					)}
					{project && (
						<TS clean variant="subtitle" color="secondary" className="line-clamp-1">
							{formatList(
								[
									project.category,
									formatValue(project.experienceLevel, 'experience'),
									formatDeadline(project.deadline, true, 'дедлайн'),
								],
								'cog',
							)}
						</TS>
					)}
				</Stack>
				{full && visibleSkills.length > 0 && (
					<Stack wrap gap={1.5} align="start">
						{visibleSkills.map((skill) => (
							<Badge key={skill.id} variant="outline" size="xs">
								{skill.name}
							</Badge>
						))}
						{remainingSkills > 0 ? (
							<Badge variant="outline" size="xs">
								+{remainingSkills}
							</Badge>
						) : null}
					</Stack>
				)}
				<TS
					clean
					variant={full ? 'body' : 'caption'}
					color="secondary"
					className={full ? 'line-clamp-4' : 'line-clamp-2'}
					content={coverLetter}
				/>
			</Stack>
		</Card>
	)
}
