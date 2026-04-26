import { notFound } from 'next/navigation'
import { Attachments } from '../entity-cards/attachments'
import { PersonCard } from '../entity-cards/person-card'
import { ProjectCard } from '../entity-cards/project-card'
import { Skills } from '../entity-cards/skills'
import {
	canWithdrawApplication,
	describeClient,
	formatBudget,
	formatDeadline,
	formatValue,
	formatColor,
	formatTruncated,
} from '../entity-cards/utils'
import { ProjectApplicationForm } from './project-application-form'
import { WithdrawApplicationButton } from './project-withdraw-button'
import type { Route } from 'next'
import { getSsrSafeSession } from '@/lib/auth/server'
import { getPublicProjectById } from '@/lib/db/queries/projects'
import { projectIdParamSchema } from '@/lib/validations'
import { Badge, Button, Card, Empty, PageShell, Stack, TS } from '@/ui'

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
				<ProjectCard full slimFooter item={project} splitTagsAt={8}>
					<div className="mt-2 grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
						<Stack vertical gap={4} align="stretch">
							<Stack wrap>
								<Badge
									capitalize
									size="sm"
									variant="primary"
									color={formatColor(project.status, 'projectStatusColor')}
								>
									{formatValue(project.status, 'projectStatus')}
								</Badge>
							</Stack>

							<Stack vertical gap={2} align="stretch">
								<TS clean variant="h2" content={project.title} />
								<TS variant="body" color="dimmed">
									{formatTruncated(describeClient(project.client), 'building')}
								</TS>
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
								<Badge
									variant="outline"
									size="sm"
									color="success"
									label={formatBudget(project)}
									// we need a wrapper to avoid gaps between currency and value
									md={{ container: true }}
								/>
								<TS
									variant="subtitle"
									color="secondary"
									content={`Дедлайн: **${formatDeadline(project.deadline)}**`}
								/>

								{project.viewerApplication ? (
									<Stack vertical gap={3} align="stretch" className="h-full">
										<Badge
											variant="secondary"
											color={formatColor(
												project.viewerApplication.status,
												'applicationStatusColor',
											)}
										>
											Статус заявки:{' '}
											{formatValue(
												project.viewerApplication.status,
												'applicationStatus',
											)}
										</Badge>
										<TS
											variant="caption"
											color="secondary"
											content={`Заявка подана ${project.viewerApplication.createdAt ? formatDeadline(project.viewerApplication.createdAt) : 'недавно'}`}
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
				</ProjectCard>

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
									outline
									compact
									fullWidth
									dark
									align="start"
									icon="missing-more"
									iconOptions={{ size: 60 }}
									title="Навыки пока не указаны"
									helper="Заказчик еще не привязал навыки к проекту."
								/>
							) : (
								<Skills variant="secondary" skills={project.skills} splitAt={5} />
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
								<Attachments
									size="sm"
									variant="secondary"
									attachments={project.attachments}
								/>
							)}
						</Card>
					</Stack>

					<Card
						fullWidth
						title="О заказчике"
						description="Краткая информация о клиенте, опубликованная в профиле."
						contentClassName="pt-0"
					>
						<Stack vertical gap={0} align="stretch" className="h-full">
							<PersonCard innerOnly multiline client={project.client} />
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
