import type { ProjectClientSummary } from '@/lib/db/queries/projects'

export function formatBudget({
	budgetType,
	budgetMin,
	budgetMax,
}: {
	budgetType: string
	budgetMin: number
	budgetMax: number
}) {
	const suffix = budgetType === 'hourly' ? '/hr' : ''
	if (budgetMin === budgetMax) return `$${budgetMin}${suffix}`
	return `$${budgetMin}-${budgetMax}${suffix}`
}

export function formatExperienceLevel(level: string) {
	switch (level) {
		case 'junior':
			return 'Junior'
		case 'middle':
			return 'Middle'
		case 'senior':
			return 'Senior'
		case 'lead':
			return 'Lead'
		default:
			return level
	}
}

export function formatProjectStatus(status: string) {
	switch (status) {
		case 'draft':
			return 'Черновик'
		case 'published':
			return 'Открыт'
		case 'in_progress':
			return 'В работе'
		case 'completed':
			return 'Завершён'
		case 'cancelled':
			return 'Отменён'
		default:
			return status
	}
}

export function formatApplicationStatus(status: string) {
	switch (status) {
		case 'submitted':
			return 'Подана'
		case 'shortlisted':
			return 'В шорт-листе'
		case 'accepted':
			return 'Принята'
		case 'rejected':
			return 'Отклонена'
		case 'withdrawn':
			return 'Отозвана'
		default:
			return status
	}
}

export function formatProjectDeadline(date: Date) {
	return new Intl.DateTimeFormat('ru-RU', {
		day: '2-digit',
		month: 'short',
		year: 'numeric',
	}).format(date)
}

export function describeClient(client: ProjectClientSummary) {
	return client.companyName || client.name || 'Заказчик'
}

export function canWithdrawApplication(status: string) {
	return status === 'submitted' || status === 'shortlisted'
}
