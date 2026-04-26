import { castArray, compact, includes, isNumber, isString, map, startCase } from 'lodash'
import { Fragment, type ReactNode } from 'react'
import type { ProjectClientSummary } from '@/lib/db/queries/projects'
import {
	type PublicFreelancerGridItem,
	type PublicFreelancerProfile,
} from '@/lib/db/queries/freelancers'
import { fullTimeMonth, Icon, type IconName, StackSpan, type BadgeColor } from '@/ui'
import { cn } from '@/utils'

const formatMap = {
	experience: {
		junior: 'Junior',
		middle: 'Middle',
		senior: 'Senior',
		lead: 'Lead',
	},
	projectStatus: {
		draft: 'Черновик',
		published: 'Открыт',
		in_progress: 'В работе',
		completed: 'Завершён',
		cancelled: 'Отменён',
	},
	projectStatusColor: {
		draft: 'secondary',
		published: 'info',
		in_progress: 'warning',
		completed: 'success',
		cancelled: 'error',
	},
	applicationStatus: {
		submitted: 'Подана',
		shortlisted: 'В шорт-листе',
		accepted: 'Принята',
		rejected: 'Отклонена',
		withdrawn: 'Отозвана',
	},
	applicationStatusColor: {
		submitted: 'secondary',
		shortlisted: 'info',
		accepted: 'success',
		rejected: 'error',
		withdrawn: 'warning',
	},
	budget: {
		fixed: 'Фиксированный',
		hourly: 'Почасовой',
	},
} as const

const listSeparator = ' ✶ '
const defaultCurrency = '₽'

export type CommonProps = {
	full?: boolean
	hoverable?: boolean
	splitTagsAt?: number
}

type FormatMap = typeof formatMap
type FormatType = keyof FormatMap

export function formatValue(value: string, type: FormatType): string | BadgeColor {
	return formatMap[type][value as keyof FormatMap[FormatType]]
}

export function formatColor(
	value: string,
	type: Exclude<FormatType, 'budget' | 'experience' | 'projectStatus' | 'applicationStatus'>,
): BadgeColor {
	return formatValue(value, type) as BadgeColor
}

export function formatNumber(
	value: number,
	currency: string | null = defaultCurrency,
	options: Intl.NumberFormatOptions = { maximumFractionDigits: 0, roundingMode: 'floor' },
) {
	const formatted = new Intl.NumberFormat('ru-RU', options).format(value)
	return `${currency ?? ''}${formatted}`
}

// NOTE: always add `md={{ container: true }}` to avoid gaps between currency and value
export function formatBudget(
	budget:
		| {
				budgetType?: string
				budgetMin: number
				budgetMax?: number
		  }
		| number,
) {
	const { budgetType, budgetMin, budgetMax } = isNumber(budget)
		? { budgetType: null, budgetMin: budget, budgetMax: null }
		: budget
	const suffix = budgetType === 'hourly' ? ' **/ час**' : ''
	if (!budgetMax || budgetMin === budgetMax) return `${formatNumber(budgetMin)}${suffix}`
	return `${formatNumber(budgetMin, '**₽**')} ➞ ${formatNumber(budgetMax, '**₽**')}${suffix}`
}

export function formatRate(rate: number | null) {
	if (!rate) return null
	return `${rate === -1 ? '' : formatNumber(rate)} **/ час**`
}

export function formatDeadline(date: Date, short = false, prefix = 'до') {
	return prefix ? `${prefix} ${fullTimeMonth(date, short)}` : fullTimeMonth(date, short)
}

export function describeClient(client?: ProjectClientSummary | null) {
	return client?.companyName || client?.name || 'Заказчик'
}

export function describeCompany(client?: ProjectClientSummary | null) {
	return client
		? client.companyName + (client.companyRole ? `${listSeparator}${client.companyRole}` : '')
		: null
}

export function canWithdrawApplication(status: string) {
	return includes(['submitted', 'shortlisted'], status)
}

export function formatList(
	list: ReactNode[],
	icon?: IconName | null,
	separator: ReactNode = listSeparator,
) {
	return (
		<StackSpan>
			{icon && <Icon name={icon} size="sm" />}
			{map(list, (item, index) => (
				<Fragment key={index}>
					{isString(item) ? formatCaps(item) : item}
					{separator && index < list.length - 1 && (
						<span className="text-cta-dark/60">{separator}</span>
					)}
				</Fragment>
			))}
		</StackSpan>
	)
}

type LikeString = string | null | undefined
export function formatTruncated(
	list: [LikeString, LikeString] | LikeString,
	icon?: IconName | null,
	multiline?: boolean,
) {
	const [first, second] = castArray(list)
	const firstNode = (
		<>
			{icon && <Icon name={icon} size="sm" />}
			{first && <span className="truncate">{first}</span>}
		</>
	)
	return (
		<span
			className={cn(
				'w-full inline-flex items-center gap-2',
				multiline && 'flex-col items-start gap-0',
			)}
		>
			{multiline ? (
				<span className="w-full inline-flex items-center gap-2">{firstNode}</span>
			) : (
				firstNode
			)}
			{second && (
				<>
					{!multiline && (
						<span className="text-cta-dark/40 shrink-0">{listSeparator}</span>
					)}
					<span className="truncate shrink-0 text-muted-foreground font-semibold">
						{second}
					</span>
				</>
			)}
		</span>
	)
}

export function formatCaps(value: string | null | undefined) {
	return value ? startCase(value.replace(/_/g, ' ')) : value
}

export function joinList(list: (string | null | undefined)[], separator = listSeparator) {
	return compact(list).join(separator)
}

export type Freelancer = PublicFreelancerGridItem | PublicFreelancerProfile
type FreelancerData = Pick<
	PublicFreelancerGridItem,
	| 'name'
	| 'nickname'
	| 'avatarUrl'
	| 'location'
	| 'languages'
	| 'bio'
	| 'specialization'
	| 'hourlyRate'
	| 'availability'
	| 'topSkills'
	| 'portfolioCount'
	| 'latestPortfolioItem'
> & {
	portfolio: PublicFreelancerProfile['portfolio'] | null
}

export function getFreelancerData(freelancer: Freelancer | null): FreelancerData {
	if (!freelancer) return {} as FreelancerData
	if ('userProfile' in freelancer)
		return {
			nickname: freelancer.nickname,
			name: freelancer.userProfile?.name ?? null,
			avatarUrl: freelancer.userProfile?.avatarUrl ?? null,
			location: freelancer.userProfile?.location ?? null,
			bio: freelancer.userProfile?.bio ?? null,
			languages: freelancer.languages,
			...freelancer.freelancer,
			topSkills: map(freelancer.skills, (skill) => ({
				id: skill.skillId,
				name: skill.skill.name,
				category: skill.skill.category,
				proficiencyLevel: skill.proficiencyLevel,
			})),
			portfolioCount: freelancer.portfolio.length,
			latestPortfolioItem: freelancer.portfolio[0]
				? {
						id: freelancer.portfolio[0].id,
						title: freelancer.portfolio[0].title,
						mediaUrl: freelancer.portfolio[0].mediaUrl,
						mediaType: freelancer.portfolio[0].mediaType,
						category: freelancer.portfolio[0].category,
					}
				: null,
			portfolio: freelancer.portfolio,
		}

	return { ...freelancer, portfolio: null }
}

export function toSnippet(value: string | null, maxLength = 160) {
	if (!value) return null

	const normalized = value.replace(/\s+/g, ' ').trim()
	if (normalized.length <= maxLength) return normalized
	return `${normalized.slice(0, maxLength - 1).trimEnd()}…`
}

export function isImage(url: string, mediaType?: string | null) {
	if (mediaType?.startsWith('image/')) return true
	return /\.(png|jpe?g|webp|gif|avif|svg)$/i.test(url)
}

export function placeholderIcon(mediaType?: string | null) {
	if (mediaType?.startsWith('video/')) return 'video'
	if (mediaType?.startsWith('audio/')) return 'volume'
	return 'image'
}
