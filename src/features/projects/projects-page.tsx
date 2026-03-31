import { ProjectCard } from './project-card'
import type { Route } from 'next'
import { listPublicProjects } from '@/lib/db/queries/projects'
import {
	projectDirectoryQuerySchema,
	type ProjectDirectoryQueryInput,
	type ProjectDirectorySort,
} from '@/lib/validations'
import { Badge, Button, Card, Empty, Input, Link, PageShell, Stack, TS } from '@/ui'
import { normalizeSearchParams, pluralizeRuWithCount } from '@/utils'

type PageProps = {
	searchParams?: Promise<Record<string, string | string[] | undefined>>
}

const categoryOptions = [
	{ label: 'Все категории', value: undefined },
	{ label: 'Text', value: 'text_generation' },
	{ label: 'Image', value: 'image_generation' },
	{ label: 'Video', value: 'video_generation' },
	{ label: 'Audio', value: 'audio_generation' },
	{ label: 'Programming', value: 'programming' },
	{ label: 'Consulting', value: 'consulting' },
] as const

const levelOptions = [
	{ label: 'Любой уровень', value: undefined },
	{ label: 'Junior', value: 'junior' },
	{ label: 'Middle', value: 'middle' },
	{ label: 'Senior', value: 'senior' },
	{ label: 'Lead', value: 'lead' },
] as const

const budgetTypeOptions = [
	{ label: 'Любой формат бюджета', value: undefined },
	{ label: 'Fixed', value: 'fixed' },
	{ label: 'Hourly', value: 'hourly' },
] as const

const sortOptions: Array<{ label: string; value: ProjectDirectorySort }> = [
	{ label: 'Recommended', value: 'recommended' },
	{ label: 'Newest', value: 'newest' },
	{ label: 'Budget low to high', value: 'budget_asc' },
	{ label: 'Budget high to low', value: 'budget_desc' },
	{ label: 'Deadline first', value: 'deadline_asc' },
]

const badgeLinkClassName = 'no-underline hover:no-underline'

export async function ProjectsPage({ searchParams }: PageProps) {
	const rawSearchParams = searchParams ? await searchParams : {}
	const parsedParams = projectDirectoryQuerySchema.safeParse(
		normalizeSearchParams(rawSearchParams),
	)
	const filters = parsedParams.success ? parsedParams.data : projectDirectoryQuerySchema.parse({})
	const directory = await listPublicProjects(filters)

	return (
		<PageShell preset="wide" spacing="lgb">
			<Stack vertical gap={8} align="stretch">
				<header>
					<Stack vertical gap={4} align="stretch">
						<Stack vertical gap={2} align="stretch">
							<TS clean variant="h2" content="Проекты для AI-фрилансеров" />
							<TS
								variant="body"
								color="secondary"
								className="max-w-3xl"
								content="Изучайте актуальные задачи по генеративному ИИ, фильтруйте по бюджету и уровню, а затем подавайте заявки прямо со страницы проекта."
							/>
						</Stack>
						<Stack wrap>
							{categoryOptions.slice(1).map((item) => {
								const isActive = filters.category === item.value
								return (
									<Badge
										key={item.value}
										asChild
										variant={isActive ? 'primary' : 'outline'}
										size="sm"
									>
										<Link
											href={buildProjectsHref(filters, {
												category: item.value,
												page: 1,
											})}
											hover="underline"
											className={badgeLinkClassName}
										>
											{item.label}
										</Link>
									</Badge>
								)
							})}
						</Stack>
					</Stack>
				</header>

				<section>
					<Card fullWidth className="py-0" contentClassName="px-4 py-4 md:px-5 md:py-5">
						<Stack vertical gap={4} align="stretch">
							<form method="get">
								<Stack vertical gap={3} align="stretch">
									<input type="hidden" name="page" value="1" />
									{filters.category ? (
										<input
											type="hidden"
											name="category"
											value={filters.category}
										/>
									) : null}
									{filters.experienceLevel ? (
										<input
											type="hidden"
											name="experienceLevel"
											value={filters.experienceLevel}
										/>
									) : null}
									{filters.budgetType ? (
										<input
											type="hidden"
											name="budgetType"
											value={filters.budgetType}
										/>
									) : null}
									{filters.sort ? (
										<input type="hidden" name="sort" value={filters.sort} />
									) : null}
									<div className="grid gap-3 lg:grid-cols-[minmax(0,2fr)_repeat(3,minmax(0,1fr))]">
										<Input
											name="q"
											defaultValue={filters.q ?? ''}
											placeholder="Найти по названию, описанию, навыку или заказчику"
										/>
										<Input
											name="budgetMin"
											type="number"
											min="1"
											step="1"
											defaultValue={
												filters.budgetMin !== undefined
													? String(filters.budgetMin)
													: ''
											}
											placeholder="Бюджет от"
										/>
										<Input
											name="budgetMax"
											type="number"
											min="1"
											step="1"
											defaultValue={
												filters.budgetMax !== undefined
													? String(filters.budgetMax)
													: ''
											}
											placeholder="Бюджет до"
										/>
										<Input
											name="deadlineBefore"
											type="date"
											defaultValue={toDateInputValue(filters.deadlineBefore)}
										/>
									</div>
									<Stack wrap>
										<Button type="submit" leftIcon="search">
											Применить фильтры
										</Button>
										<Button href="/projects" variant="outline">
											Сбросить
										</Button>
									</Stack>
								</Stack>
							</form>

							<FilterBadgeRow
								label="Уровень"
								isActive={(value) => filters.experienceLevel === value}
								options={levelOptions}
								buildHref={(value) =>
									buildProjectsHref(filters, { experienceLevel: value, page: 1 })
								}
							/>
							<FilterBadgeRow
								label="Бюджет"
								isActive={(value) => filters.budgetType === value}
								options={budgetTypeOptions}
								buildHref={(value) =>
									buildProjectsHref(filters, { budgetType: value, page: 1 })
								}
							/>
							<FilterBadgeRow
								label="Сортировка"
								isActive={(value) => filters.sort === value}
								options={sortOptions}
								buildHref={(value) =>
									buildProjectsHref(filters, { sort: value, page: 1 })
								}
							/>
						</Stack>
					</Card>
				</section>

				<section>
					<Stack vertical gap={5} align="stretch">
						<Stack
							vertical
							gap={2}
							align="stretch"
							className="md:flex-row md:items-end md:justify-between"
						>
							<Stack vertical gap={1} align="stretch">
								<TS clean variant="h4" content="Результаты" />
								<TS
									variant="body"
									color="secondary"
									content={describeResults(directory.total, filters)}
								/>
							</Stack>
							<TS
								variant="caption"
								color="secondary"
								content={`Страница ${directory.page} · Показано ${directory.items.length} из ${directory.total}`}
							/>
						</Stack>

						{directory.items.length === 0 ? (
							<Empty
								outline
								fullWidth
								align="start"
								icon="search"
								title="Проекты не найдены"
								helper="Попробуйте изменить поисковый запрос, бюджет, срок или уровень проекта."
							/>
						) : (
							<div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
								{directory.items.map((item) => (
									<ProjectCard key={item.id} item={item} />
								))}
							</div>
						)}

						{directory.page > 1 || directory.hasMore ? (
							<Stack wrap gap={3} justify="space-between" className="w-full">
								{directory.page > 1 ? (
									<Button
										href={buildProjectsHref(filters, {
											page: directory.page - 1,
										})}
										variant="outline"
										leftIcon="chevron-left"
									>
										Назад
									</Button>
								) : (
									<div />
								)}
								{directory.hasMore ? (
									<Button
										href={buildProjectsHref(filters, {
											page: directory.page + 1,
										})}
										rightIcon="chevron-right"
									>
										Следующая страница
									</Button>
								) : null}
							</Stack>
						) : null}
					</Stack>
				</section>
			</Stack>
		</PageShell>
	)
}

function FilterBadgeRow<T extends string>({
	label,
	options,
	isActive,
	buildHref,
}: {
	label: string
	options: ReadonlyArray<{ label: string; value: T | undefined }>
	isActive: (value: T | undefined) => boolean
	buildHref: (value: T | undefined) => Route
}) {
	return (
		<Stack vertical gap={2} align="stretch">
			<TS clean variant="caption" color="secondary" content={label} />
			<Stack wrap>
				{options.map((option) => (
					<Badge
						key={option.label}
						asChild
						variant={isActive(option.value) ? 'secondary' : 'outline'}
						size="sm"
					>
						<Link
							href={buildHref(option.value)}
							hover="underline"
							className={badgeLinkClassName}
						>
							{option.label}
						</Link>
					</Badge>
				))}
			</Stack>
		</Stack>
	)
}

function describeResults(total: number, filters: ProjectDirectoryQueryInput) {
	if (total === 0) return 'Пока нет проектов, подходящих под выбранные условия.'
	const plural = pluralizeRuWithCount(total, 'project')
	if (filters.q) return `Найдено ${plural} по запросу "${filters.q}".`
	if (filters.category) return `Найдено ${plural} в выбранной категории.`
	return `Найдено ${plural} в публичной ленте проектов.`
}

function buildProjectsHref(
	base: ProjectDirectoryQueryInput,
	overrides: Partial<ProjectDirectoryQueryInput>,
): Route {
	const params = new URLSearchParams()
	const next = {
		page: 'page' in overrides ? overrides.page : base.page,
		pageSize: 'pageSize' in overrides ? overrides.pageSize : base.pageSize,
		q: 'q' in overrides ? overrides.q : base.q,
		category: 'category' in overrides ? overrides.category : base.category,
		experienceLevel:
			'experienceLevel' in overrides ? overrides.experienceLevel : base.experienceLevel,
		budgetType: 'budgetType' in overrides ? overrides.budgetType : base.budgetType,
		budgetMin: 'budgetMin' in overrides ? overrides.budgetMin : base.budgetMin,
		budgetMax: 'budgetMax' in overrides ? overrides.budgetMax : base.budgetMax,
		deadlineBefore:
			'deadlineBefore' in overrides ? overrides.deadlineBefore : base.deadlineBefore,
		sort: 'sort' in overrides ? overrides.sort : base.sort,
	}

	if (next.page && next.page !== 1) params.set('page', String(next.page))
	if (next.pageSize && next.pageSize !== 12) params.set('pageSize', String(next.pageSize))
	if (next.q) params.set('q', next.q)
	if (next.category) params.set('category', next.category)
	if (next.experienceLevel) params.set('experienceLevel', next.experienceLevel)
	if (next.budgetType) params.set('budgetType', next.budgetType)
	if (next.budgetMin !== undefined) params.set('budgetMin', String(next.budgetMin))
	if (next.budgetMax !== undefined) params.set('budgetMax', String(next.budgetMax))
	if (next.deadlineBefore) params.set('deadlineBefore', toDateInputValue(next.deadlineBefore))
	if (next.sort && next.sort !== 'recommended') params.set('sort', next.sort)

	const query = params.toString()
	return (query ? `/projects?${query}` : '/projects') as Route
}

function toDateInputValue(value: Date | undefined) {
	if (!value) return ''
	return value.toISOString().slice(0, 10)
}
