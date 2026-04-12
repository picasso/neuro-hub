import { includes, isNumber, isString, map } from 'lodash'
import { Fragment, type ReactNode } from 'react'
import type { ProjectClientSummary } from '@/lib/db/queries/projects'
import { fullTimeMonth, Icon, type IconName, StackSpan, type BadgeColor } from '@/ui'

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
	currency: string | null = '₽',
	options: Intl.NumberFormatOptions = { maximumFractionDigits: 0, roundingMode: 'floor' },
) {
	const formatted = new Intl.NumberFormat('ru-RU', options).format(value)
	return `${currency ?? ''}${formatted}`
}

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
	return `${formatNumber(budgetMin, '**₽**')} ➞ ${formatNumber(budgetMax, null)}${suffix}`
}

export function formatDeadline(date: Date, short = false, prefix = 'До') {
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
// &nbsp;{separator}&nbsp;
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
					{isString(item) ? item.replace(/_/g, ' ') : item}
					{separator && index < list.length - 1 && (
						<span className="text-cta-dark/60">{separator}</span>
					)}
				</Fragment>
			))}
		</StackSpan>
	)
}
