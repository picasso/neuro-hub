import { notFound } from 'next/navigation'
import { ProjectApplicationForm } from './project-application-form'
import {
	applicationStatusColor,
	canWithdrawApplication,
	describeClient,
	formatApplicationStatus,
	formatBudget,
	formatExperienceLevel,
	formatProjectDeadline,
	formatProjectStatus,
	statusColor,
} from './project-helpers'
import { WithdrawApplicationButton } from './project-withdraw-button'
import type { Route } from 'next'
import { getSsrSafeSession } from '@/lib/auth/server'
import { getPublicProjectById } from '@/lib/db/queries/projects'
import { projectIdParamSchema } from '@/lib/validations'
import { Badge, Button, Card, Empty, Link, PageShell, Stack, TS } from '@/ui'

type PageProps = {
	params: Promise<{ id: string }>
}

export async function ProjectDetailPage(props: PageProps) {
	const { id } = await props.params
	const parsedParams = projectIdParamSchema.safeParse({ id })
	if (!parsedParams.success) notFound()

	const session = await getSsrSafeSession()
	const project = await getPublicProjectById(
		parsedParams.data.id,
		session?.user.role === 'freelancer' ? session.user.id : undefined,
	)
	if (!project) notFound()

	const isExpired = project.deadline.getTime() <= Date.now()
	const canApply = session?.user.role === 'freelancer' && !project.viewerApplication && !isExpired
	const loginHref = `/login?from=/projects/${project.id}` as Route

	return (
		<PageShell preset="wide" spacing="lgb">
			<Stack vertical gap={6} align="stretch">
				<Card fullWidth image="project" imageAspect="none">
					<div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
						<Stack vertical gap={4} align="stretch">
							<Stack wrap>
								<Badge
									capitalize
									variant="secondary"
									color={statusColor[project.status]}
								>
									{formatProjectStatus(project.status)}
								</Badge>
								<Badge capitalize variant="outline">
									{project.category}
								</Badge>
								<Badge capitalize variant="outline">
									{formatExperienceLevel(project.experienceLevel)}
								</Badge>
							</Stack>

							<Stack vertical gap={2} align="stretch">
								<TS clean variant="h2" content={project.title} />
								<TS
									variant="body"
									color="secondary"
									content={`${describeClient(project.client)} · до ${formatProjectDeadline(project.deadline)}`}
								/>
							</Stack>

							<TS
								variant="body"
								color="secondary"
								className="whitespace-pre-line"
								content={project.description}
							/>
						</Stack>

						<Card
							fullWidth
							title="Заявка"
							description={
								project.viewerApplication
									? 'Проверьте текущий статус своей заявки или отзовите её.'
									: 'Подайте заявку, чтобы стать участником проекта.'
							}
							className="h-full"
						>
							<Stack vertical align="stretch" className="h-full">
								<TS variant="subtitle" content={formatBudget(project)} />
								<TS
									variant="subtitle"
									color="secondary"
									content={`Дедлайн проекта: **${formatProjectDeadline(project.deadline)}**`}
								/>

								{project.viewerApplication ? (
									<Stack vertical gap={3} align="stretch" className="h-full">
										<Badge
											variant="secondary"
											color={
												applicationStatusColor[
													project.viewerApplication.status
												]
											}
										>
											Статус заявки:{' '}
											{formatApplicationStatus(
												project.viewerApplication.status,
											)}
										</Badge>
										<TS
											variant="caption"
											color="secondary"
											content={`Заявка подана ${project.viewerApplication.createdAt ? formatProjectDeadline(project.viewerApplication.createdAt) : 'недавно'}`}
										/>
										{canWithdrawApplication(
											project.viewerApplication.status,
										) ? (
											<WithdrawApplicationButton
												applicationId={project.viewerApplication.id}
												className="mt-auto"
											/>
										) : null}
									</Stack>
								) : isExpired ? (
									<Empty
										outline
										compact
										fullWidth
										align="start"
										title="Приём заявок закрыт"
										helper="Дедлайн проекта уже прошёл, поэтому новые заявки больше не принимаются."
									/>
								) : !session ? (
									<Button href={loginHref}>Войти, чтобы подать заявку</Button>
								) : session.user.role !== 'freelancer' ? (
									<Empty
										error
										outline
										compact
										fullWidth
										align="start"
										icon="nobody"
										iconOptions={{ size: 60, accent: '#ef4444' }}
										title="Подать заявку могут только фрилансеры"
										helper="В текущем MVP заявки на проекты могут подавать только фрилансеры."
									/>
								) : canApply ? (
									<ProjectApplicationForm projectId={project.id} />
								) : null}
							</Stack>
						</Card>
					</div>
				</Card>

				<div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
					<Stack vertical gap={6} align="stretch">
						<Card
							fullWidth
							title="Навыки проекта"
							description="Требуемые компетенции для успешного выполнения задачи."
							badge={String(project.skills.length)}
						>
							{project.skills.length === 0 ? (
								<Empty
									dark
									icon="missing-more"
									outline
									compact
									fullWidth
									align="start"
									title="Навыки пока не указаны"
									helper="Заказчик еще не привязал навыки к проекту."
								/>
							) : (
								<Stack wrap gap={2} align="start">
									{project.skills.map((skill) => (
										<Badge key={skill.id} variant="outline" size="xs">
											{skill.name}
										</Badge>
									))}
								</Stack>
							)}
						</Card>

						<Card
							fullWidth
							title="Вложения"
							description="Файлы и дополнительные материалы по задаче."
							badge={String(project.attachments.length)}
						>
							{project.attachments.length === 0 ? (
								<Empty
									dark
									outline
									compact
									fullWidth
									icon="missing"
									iconOptions={{ size: 60 }}
									align="start"
									title="Вложений пока нет"
									helper="В текущем проекте заказчик не добавил файлов."
								/>
							) : (
								<Stack vertical gap={2} align="stretch">
									{project.attachments.map((attachment) => (
										<Link
											key={attachment.id}
											href={attachment.fileUrl}
											target="_blank"
											rel="noreferrer"
											hover="underline"
										>
											{attachment.filename}
										</Link>
									))}
								</Stack>
							)}
						</Card>
					</Stack>

					<Card
						fullWidth
						title="О заказчике"
						description="Краткая информация о клиенте, опубликованная в профиле."
					>
						<Stack vertical gap={3} align="stretch" className="h-full">
							<TS clean variant="subtitle" content={describeClient(project.client)} />
							{project.client.companyRole ? (
								<TS
									variant="caption"
									color="secondary"
									content={project.client.companyRole}
								/>
							) : null}
							{project.client.name && project.client.companyName ? (
								<TS
									variant="caption"
									color="secondary"
									content={`Контакт: ${project.client.name}`}
								/>
							) : null}
							<Button href="/projects" variant="outline" className="mt-auto">
								Назад к проектам
							</Button>
						</Stack>
					</Card>
				</div>
			</Stack>
		</PageShell>
	)
}
