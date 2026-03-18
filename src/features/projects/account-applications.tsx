import { redirect } from 'next/navigation'
import {
	canWithdrawApplication,
	describeClient,
	formatApplicationStatus,
	formatBudget,
	formatExperienceLevel,
	formatProjectDeadline,
	formatProjectStatus,
} from './project-helpers'
import { WithdrawApplicationButton } from './withdraw-application-button'
import type { Route } from 'next'
import { getAccountContext } from '@/lib/account'
import { listFreelancerApplications } from '@/lib/db/queries/projects'
import {
	applicationsQuerySchema,
	type ApplicationStatus,
	type ApplicationsQueryInput,
} from '@/lib/validations'
import { Badge, Button, Card, Empty, Link, Stack, TS } from '@/ui'
import { pluralizeRuWithCount } from '@/utils'

type PageProps = {
	searchParams?: Promise<Record<string, string | string[] | undefined>>
}

const statusOptions: Array<{ label: string; value: ApplicationStatus | undefined }> = [
	{ label: 'Все', value: undefined },
	{ label: 'Подана', value: 'submitted' },
	{ label: 'В шорт-листе', value: 'shortlisted' },
	{ label: 'Принята', value: 'accepted' },
	{ label: 'Отклонена', value: 'rejected' },
	{ label: 'Отозвана', value: 'withdrawn' },
]

export async function AccountApplications({ searchParams }: PageProps) {
	const context = await getAccountContext()
	if (!context) redirect('/login?from=/account/applications')
	if (context.session.user.role !== 'freelancer') redirect('/account/dashboard')

	const rawSearchParams = searchParams ? await searchParams : {}
	const parsedParams = applicationsQuerySchema.safeParse(normalizeSearchParams(rawSearchParams))
	const filters = parsedParams.success ? parsedParams.data : applicationsQuerySchema.parse({})
	const history = await listFreelancerApplications({
		freelancerId: context.session.user.id,
		input: filters,
	})

	return (
		<Stack vertical gap={5} align="stretch" className="w-full min-w-0">
			<Stack vertical gap={2} align="stretch">
				<TS clean variant="h3" content="Мои заявки" />
				<TS
					variant="body"
					color="secondary"
					content="Отслеживайте поданные заявки, их статусы и дедлайны по проектам."
				/>
			</Stack>

			<Stack wrap>
				{statusOptions.map((option) => {
					const isActive =
						filters.status === option.value || (!filters.status && !option.value)
					return (
						<Badge
							key={option.label}
							asChild
							variant={isActive ? 'secondary' : 'outline'}
							size="sm"
						>
							<Link
								href={buildApplicationsHref(filters, option.value)}
								hover="underline"
							>
								{option.label}
							</Link>
						</Badge>
					)
				})}
			</Stack>

			<TS
				variant="caption"
				color="secondary"
				content={`Показано ${history.items.length} из ${pluralizeRuWithCount(history.total, ['заявка', 'заявки', 'заявок'])}`}
			/>

			{history.items.length === 0 ? (
				<Empty
					outline
					fullWidth
					align="start"
					icon="search"
					title="Заявок пока нет"
					helper="Когда вы подадите первую заявку на проект, она появится в этом разделе."
				/>
			) : (
				<Stack vertical gap={3} align="stretch">
					{history.items.map((item) => (
						<Card key={item.id} fullWidth className="max-w-none">
							<Stack vertical gap={4} align="stretch">
								<Stack
									vertical
									gap={2}
									align="stretch"
									className="lg:flex-row lg:items-start lg:justify-between"
								>
									<Stack vertical gap={2} align="stretch" className="min-w-0">
										<Link href={item.project.href as Route} hover="underline">
											<TS clean variant="h5" content={item.project.title} />
										</Link>
										<TS
											variant="caption"
											color="secondary"
											content={`${describeClient(item.project.client)} · ${item.project.category} · ${formatExperienceLevel(item.project.experienceLevel)}`}
										/>
									</Stack>
									<Stack wrap justify="end">
										<Badge variant="secondary" size="sm">
											{formatApplicationStatus(item.status)}
										</Badge>
										<Badge variant="outline" size="sm">
											{formatProjectStatus(item.project.status)}
										</Badge>
									</Stack>
								</Stack>

								<Stack wrap gap={2} align="start">
									{item.project.skills.map((skill) => (
										<Badge key={skill.id} variant="outline" size="xs">
											{skill.name}
										</Badge>
									))}
								</Stack>

								<TS
									variant="body"
									color="secondary"
									className="whitespace-pre-line"
									content={item.coverLetter}
								/>

								<Stack wrap justify="space-between" className="gap-3">
									<Stack wrap>
										<TS
											variant="caption"
											color="secondary"
											content={`Проект: ${formatBudget(item.project)}`}
										/>
										<TS
											variant="caption"
											color="secondary"
											content={`Ваш бюджет: $${item.proposedPrice}`}
										/>
										<TS
											variant="caption"
											color="secondary"
											content={`Дедлайн проекта: ${formatProjectDeadline(item.project.deadline)}`}
										/>
										{item.proposedDeadline ? (
											<TS
												variant="caption"
												color="secondary"
												content={`Ваш срок: ${formatProjectDeadline(item.proposedDeadline)}`}
											/>
										) : null}
									</Stack>
									<Stack wrap justify="end">
										<Button href={item.project.href as Route} variant="outline">
											Открыть проект
										</Button>
										{canWithdrawApplication(item.status) ? (
											<WithdrawApplicationButton applicationId={item.id} />
										) : null}
									</Stack>
								</Stack>
							</Stack>
						</Card>
					))}
				</Stack>
			)}

			{history.page > 1 || history.hasMore ? (
				<Stack wrap gap={3} justify="space-between" className="w-full">
					{history.page > 1 ? (
						<Button
							href={buildApplicationsHref(filters, filters.status, history.page - 1)}
							variant="outline"
							leftIcon="chevron-left"
						>
							Назад
						</Button>
					) : (
						<div />
					)}
					{history.hasMore ? (
						<Button
							href={buildApplicationsHref(filters, filters.status, history.page + 1)}
							rightIcon="chevron-right"
						>
							Следующая страница
						</Button>
					) : null}
				</Stack>
			) : null}
		</Stack>
	)
}

function buildApplicationsHref(
	base: ApplicationsQueryInput,
	status: ApplicationStatus | undefined,
	page = 1,
): Route {
	const params = new URLSearchParams()
	if (page > 1) params.set('page', String(page))
	if (base.pageSize !== 12) params.set('pageSize', String(base.pageSize))
	if (status) params.set('status', status)

	const query = params.toString()
	return (query ? `/account/applications?${query}` : '/account/applications') as Route
}

function normalizeSearchParams(raw: Record<string, string | string[] | undefined>) {
	return Object.fromEntries(
		Object.entries(raw)
			.map(([key, value]) => [key, Array.isArray(value) ? value[0] : value])
			.filter(([, value]) => value !== undefined),
	)
}
