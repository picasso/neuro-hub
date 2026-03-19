import {
	describeClient,
	formatBudget,
	formatExperienceLevel,
	formatProjectDeadline,
} from './project-helpers'
import type { Route } from 'next'
import { Badge, Card, Link, Stack, TS } from '@/ui'

type ProjectCardProps = {
	item: {
		id: string
		href: string
		title: string
		descriptionSnippet: string
		category: string
		experienceLevel: string
		budgetType: string
		budgetMin: number
		budgetMax: number
		deadline: Date
		status: string
		createdAt: Date | null
		client: {
			userId: string
			name: string | null
			companyName: string | null
			companyRole: string | null
			avatarUrl: string | null
		}
		skills: Array<{
			id: string
			name: string
			category: string | null
		}>
	}
}

export function ProjectCard({ item }: ProjectCardProps) {
	const visibleSkills = item.skills.slice(0, 4)
	const remainingSkills = item.skills.length - visibleSkills.length

	return (
		<Link
			href={item.href as Route}
			hover="underline"
			className="group block h-full no-underline hover:no-underline"
		>
			<Card
				fullWidth
				className="h-full gap-0 rounded-lg border-border/70 py-0 transition-all group-hover:-translate-y-1 group-hover:shadow-lg"
				contentClassName="h-full p-4"
				image="project"
			>
				<Stack vertical gap={4} align="stretch" className="h-full">
					<Stack wrap justify="space-between" className="gap-2">
						<Badge variant="secondary" size="xs">
							{formatExperienceLevel(item.experienceLevel)}
						</Badge>
						<Badge variant="outline" size="xs">
							До {formatProjectDeadline(item.deadline)}
						</Badge>
					</Stack>

					<Stack vertical gap={2} align="stretch" className="min-w-0">
						<TS clean variant="h5" className="line-clamp-2" content={item.title} />
						<TS
							clean
							variant="caption"
							color="secondary"
							className="line-clamp-1"
							content={`${describeClient(item.client)} · ${item.category}`}
						/>
					</Stack>

					<TS
						clean
						variant="subtitle"
						color="secondary"
						className="line-clamp-4"
						content={item.descriptionSnippet}
					/>

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

					<Stack justify="space-between" gap={3} className="mt-auto">
						<TS
							clean
							variant="caption"
							color="secondary"
							content={formatBudget(item)}
						/>
						<TS
							clean
							variant="caption"
							color="secondary"
							content={`Опубликован ${item.createdAt ? formatProjectDeadline(item.createdAt) : 'недавно'}`}
						/>
					</Stack>
				</Stack>
			</Card>
		</Link>
	)
}
