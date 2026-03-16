import { FreelancerGridCard } from './freelancers-card'
import type { Route } from 'next'
import { freelancerCatalogMock } from '@/config'
import { listPublicFreelancers } from '@/lib/db/queries/freelancers'
import {
	freelancerDirectoryQuerySchema,
	type FreelancerDirectoryQueryInput,
	type FreelancerDirectorySort,
} from '@/lib/validations'
import { Badge, Breadcrumb, Button, Card, Empty, Input, Link, PageShell, Stack, TS } from '@/ui'

type PageProps = {
	searchParams?: Promise<Record<string, string | string[] | undefined>>
}

const sortOptions: Array<{ label: string; value: FreelancerDirectorySort }> = [
	{ label: 'Recommended', value: 'recommended' },
	{ label: 'Newest', value: 'newest' },
	{ label: 'Rate low to high', value: 'rate_asc' },
	{ label: 'Rate high to low', value: 'rate_desc' },
]
const badgeLinkClassName = 'no-underline hover:no-underline'

export async function FreelancersPage({ searchParams }: PageProps) {
	const rawSearchParams = searchParams ? await searchParams : {}
	const parsedParams = freelancerDirectoryQuerySchema.safeParse(
		normalizeSearchParams(rawSearchParams),
	)
	const filters = parsedParams.success
		? parsedParams.data
		: freelancerDirectoryQuerySchema.parse({})
	const directory = await listPublicFreelancers(filters)

	return (
		<PageShell preset="wide" spacing="lgb">
			<Stack vertical gap={8} align="stretch">
				<header>
					<Stack vertical gap={5} align="stretch">
						<Breadcrumb path={freelancerCatalogMock.breadcrumb} />
						<Stack vertical gap={3} align="stretch">
							<TS clean variant="h2" content={freelancerCatalogMock.title} />
							<TS
								variant="body"
								color="secondary"
								className="max-w-3xl"
								content={freelancerCatalogMock.description}
							/>
						</Stack>
						<Stack wrap>
							{freelancerCatalogMock.skillLine.map((skill) => {
								const isActive = filters.q === skill.query
								return (
									<Badge
										key={skill.label}
										asChild
										variant={isActive ? 'primary' : 'outline'}
										size="sm"
									>
										<Link
											href={buildDirectoryHref(filters, {
												q: skill.query,
												page: 1,
											})}
											hover="underline"
											className={badgeLinkClassName}
										>
											{skill.label}
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
								<Stack
									vertical
									gap={3}
									align="stretch"
									className="xl:flex-row xl:items-center"
								>
									<input type="hidden" name="page" value="1" />
									{filters.category ? (
										<input
											type="hidden"
											name="category"
											value={filters.category}
										/>
									) : null}
									{filters.sort ? (
										<input type="hidden" name="sort" value={filters.sort} />
									) : null}
									{filters.hasPortfolio ? (
										<input type="hidden" name="hasPortfolio" value="true" />
									) : null}
									<Input
										name="q"
										defaultValue={filters.q ?? ''}
										placeholder="Найти по навыку, имени или специализации"
										className="min-w-0 flex-1"
									/>
									<Stack wrap>
										<Button type="submit" leftIcon="search">
											Поиск
										</Button>
										<Button href="/freelancers" variant="outline">
											Сбросить
										</Button>
									</Stack>
								</Stack>
							</form>

							<Stack wrap>
								{freelancerCatalogMock.categories.map((item) => {
									const isActive =
										filters.category === item.value ||
										(!filters.category && !item.value)
									return (
										<Badge
											key={item.label}
											asChild
											variant={isActive ? 'primary' : 'outline'}
											size="sm"
										>
											<Link
												href={buildDirectoryHref(filters, {
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

							<Stack wrap>
								{sortOptions.map((option) => {
									const isActive = filters.sort === option.value
									return (
										<Badge
											key={option.value}
											asChild
											variant={isActive ? 'secondary' : 'outline'}
											size="sm"
										>
											<Link
												href={buildDirectoryHref(filters, {
													sort: option.value,
													page: 1,
												})}
												hover="underline"
												className={badgeLinkClassName}
											>
												{option.label}
											</Link>
										</Badge>
									)
								})}
								<Badge
									asChild
									variant={filters.hasPortfolio ? 'secondary' : 'outline'}
									size="sm"
								>
									<Link
										href={buildDirectoryHref(filters, {
											hasPortfolio: filters.hasPortfolio ? undefined : true,
											page: 1,
										})}
										hover="underline"
										className={badgeLinkClassName}
									>
										Только с портфолио
									</Link>
								</Badge>
							</Stack>
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
								content={`Page ${directory.page} · Showing ${directory.items.length} of ${directory.total}`}
							/>
						</Stack>

						{directory.items.length === 0 ? (
							<Empty
								outline
								fullWidth
								align="start"
								icon="search"
								title="Фрилансеры не найдены"
								helper="Попробуйте изменить поисковый запрос, категорию или отключить фильтр по портфолио."
							/>
						) : (
							<div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
								{directory.items.map((item) => (
									<FreelancerGridCard
										key={item.freelancerProfileId}
										item={item}
									/>
								))}
							</div>
						)}

						{directory.page > 1 || directory.hasMore ? (
							<Stack wrap gap={3} justify="space-between" className="w-full">
								{directory.page > 1 ? (
									<Button
										href={buildDirectoryHref(filters, {
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
										href={buildDirectoryHref(filters, {
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

function describeResults(total: number, filters: FreelancerDirectoryQueryInput) {
	if (total === 0) return 'Пока нет профилей, подходящих под выбранные условия.'
	if (filters.q) return `Найдено ${total} ${profileLabel(total)} по запросу "${filters.q}".`
	if (filters.category) return `Найдено ${total} ${profileLabel(total)} в выбранной категории.`
	return `Найдено ${total} ${profileLabel(total)} для публичного каталога.`
}

function buildDirectoryHref(
	base: FreelancerDirectoryQueryInput,
	overrides: Partial<FreelancerDirectoryQueryInput>,
): Route {
	const params = new URLSearchParams()
	const next = {
		page: 'page' in overrides ? overrides.page : base.page,
		pageSize: 'pageSize' in overrides ? overrides.pageSize : base.pageSize,
		q: 'q' in overrides ? overrides.q : base.q,
		category: 'category' in overrides ? overrides.category : base.category,
		sort: 'sort' in overrides ? overrides.sort : base.sort,
		hasPortfolio: 'hasPortfolio' in overrides ? overrides.hasPortfolio : base.hasPortfolio,
	}

	if (next.page && next.page !== 1) params.set('page', String(next.page))
	if (next.pageSize && next.pageSize !== 12) params.set('pageSize', String(next.pageSize))
	if (next.q) params.set('q', next.q)
	if (next.category) params.set('category', next.category)
	if (next.sort && next.sort !== 'recommended') params.set('sort', next.sort)
	if (next.hasPortfolio) params.set('hasPortfolio', 'true')

	const query = params.toString()
	return (query ? `/freelancers?${query}` : '/freelancers') as Route
}

function normalizeSearchParams(raw: Record<string, string | string[] | undefined>) {
	return Object.fromEntries(
		Object.entries(raw)
			.map(([key, value]) => [key, Array.isArray(value) ? value[0] : value])
			.filter(([, value]) => value !== undefined),
	)
}

function profileLabel(count: number) {
	if (count % 10 === 1 && count % 100 !== 11) return 'профиль'
	if (count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 12 || count % 100 > 14)) {
		return 'профиля'
	}
	return 'профилей'
}
