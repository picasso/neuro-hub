import { map } from 'lodash'
import { PendingContent } from '../account-pending'
import { ApplicationCard } from '../entity-cards/application-card'
import { formatDeadline, formatValue, formatColor } from '../entity-cards/utils'
import { ProjectStartConversationButton } from './project-start-conversation-button'
import type { Route } from 'next'
import { getAccountContext } from '@/lib/account'
import { listClientProjectApplications } from '@/lib/db/queries/projects'
import { Badge, Button, Card, Empty, Link, Stack, TS } from '@/ui'
import { pluralizeRuWithCount } from '@/utils'

export async function ProjectApplications() {
	const context = await getAccountContext()
	if (!context) return null

	if (context.session.user.role !== 'client') {
		return (
			<PendingContent
				icon="construction"
				description="Этот раздел доступен только заказчикам. Для фрилансеров используйте страницу с вашими заявками."
			/>
		)
	}

	const applications = await listClientProjectApplications({
		clientId: context.session.user.id,
	})
	const applicationsCount = applications.items.reduce(
		(total, projectGroup) => total + projectGroup.applications.length,
		0,
	)

	return (
		<div className="w-full min-w-0">
			<Stack vertical gap={5} align="stretch" className="w-full min-w-0">
				<Stack vertical gap={2} align="stretch">
					<TS clean variant="h3" content="Заявки на проекты" />
					<TS
						variant="body"
						color="secondary"
						content="Список активных заявок по вашим проектам. Из каждой строки можно сразу начать обсуждение с кандидатом."
					/>
				</Stack>

				{applicationsCount > 0 ? (
					<TS
						variant="caption"
						color="secondary"
						content={`Доступно ${pluralizeRuWithCount(applications.items.length, 'project')} и ${pluralizeRuWithCount(applicationsCount, 'application')} для быстрого старта обсуждения.`}
					/>
				) : null}

				{applications.items.length === 0 ? (
					<Empty
						outline
						fullWidth
						align="start"
						icon="message-circle-check"
						title="Подходящих заявок пока нет"
						helper="В этом разделе отображаются только активные заявки, для которых уже можно открыть обсуждение."
					/>
				) : (
					<Stack vertical gap={4} align="stretch">
						{applications.items.map((projectGroup) => (
							<Card key={projectGroup.project.id} fullWidth className="max-w-none">
								<Stack vertical gap={4} align="stretch">
									<Stack
										vertical
										gap={2}
										align="stretch"
										className="lg:flex-row lg:items-start lg:justify-between"
									>
										<Stack vertical gap={2} align="stretch" className="min-w-0">
											<Link
												href={projectGroup.project.href as Route}
												hover="underline"
											>
												<TS
													clean
													variant="h5"
													content={projectGroup.project.title}
												/>
											</Link>
											<TS
												variant="caption"
												color="secondary"
												className="capitalize"
												content={`${projectGroup.project.category} · ${formatValue(projectGroup.project.experienceLevel, 'experience')} · дедлайн ${formatDeadline(projectGroup.project.deadline)}`}
											/>
										</Stack>
										<Stack wrap justify="end">
											<Badge
												variant="outline"
												size="sm"
												color={formatColor(
													projectGroup.project.status,
													'projectStatusColor',
												)}
											>
												{formatValue(
													projectGroup.project.status,
													'projectStatus',
												)}
											</Badge>
											<Badge variant="secondary" size="sm">
												{pluralizeRuWithCount(
													projectGroup.applications.length,
													'application',
												)}
											</Badge>
										</Stack>
									</Stack>

									<Stack wrap gap={2} align="start">
										{projectGroup.project.skills.map((skill) => (
											<Badge key={skill.id} variant="outline" size="xs">
												{skill.name}
											</Badge>
										))}
									</Stack>

									<Stack vertical gap={3} align="stretch">
										{map(projectGroup.applications, (application) => (
											<ApplicationCard key={application.id} {...application}>
												<ProjectStartConversationButton
													projectId={projectGroup.project.id}
													freelancerId={application.freelancer.userId}
													className="lg:self-start"
												/>
											</ApplicationCard>
											// <div
											// 	key={application.id}
											// 	className="rounded-xl border border-border/70 bg-muted/20 p-4"
											// >
											// 	<Stack
											// 		vertical
											// 		gap={3}
											// 		align="stretch"
											// 		className="lg:flex-row lg:items-start lg:justify-between"
											// 	>
											// 		<Stack
											// 			vertical
											// 			gap={2}
											// 			align="stretch"
											// 			className="min-w-0"
											// 		>
											// 			<Stack wrap gap={2} align="center">
											// 				<TS
											// 					variant="subtitle"
											// 					content={`Заявка от ${formatFreelancerLabel(
											// 						application.freelancer.name,
											// 						application.freelancer.userId,
											// 					)}`}
											// 				/>
											// 				<Badge
											// 					variant="secondary"
											// 					size="sm"
											// 					color={formatColor(
											// 						application.status,
											// 						'applicationStatusColor',
											// 					)}
											// 				>
											// 					{formatValue(
											// 						application.status,
											// 						'applicationStatus',
											// 					)}
											// 				</Badge>
											// 			</Stack>
											// 			<TS
											// 				variant="caption"
											// 				color="secondary"
											// 				content={`Бюджет кандидата: **${formatBudget({ budgetMin: application.proposedPrice })}**`}
											// 			/>
											// 			{application.proposedDeadline ? (
											// 				<TS
											// 					variant="caption"
											// 					color="secondary"
											// 					content={`Срок кандидата: **${formatDeadline(application.proposedDeadline)}**`}
											// 				/>
											// 			) : null}
											// 			<TS
											// 				variant="body"
											// 				color="secondary"
											// 				className="whitespace-pre-line"
											// 				content={application.coverLetter}
											// 			/>
											// 		</Stack>
											// 		<ProjectStartConversationButton
											// 			projectId={projectGroup.project.id}
											// 			freelancerId={application.freelancer.userId}
											// 			className="lg:self-start"
											// 		/>
											// 	</Stack>
											// </div>
										))}
									</Stack>

									<Stack wrap justify="end">
										<Button
											href={projectGroup.project.href as Route}
											variant="outline"
											label="Открыть проект"
										/>
									</Stack>
								</Stack>
							</Card>
						))}
					</Stack>
				)}
			</Stack>
		</div>
	)
}

// function formatFreelancerLabel(name: string | null, userId: string) {
// 	const normalizedName = name?.trim()
// 	if (normalizedName) return normalizedName

// 	return `User ${userId.slice(0, 8)}`
// }
