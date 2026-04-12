'use client'

import { createGate, useGate, useUnit } from 'effector-react'
import type { AccountSnapshot } from '@/lib/account'
import { accountSidebarDomain as domain } from '@/lib/logger'
import { $accountContext } from '@/stores'
import { Sidebar, type SidebarGroup } from '@/ui'

export const sidebarGroups: SidebarGroup[] = [
	{
		title: 'Платформа',
		collapsible: true,
		items: [
			{ title: 'Обзор', href: '/account/dashboard', icon: 'layout-dashboard' },
			{
				title: 'Аккаунт',
				open: true,
				icon: 'user-plus',
				items: [
					{
						title: 'Профиль',
						href: '/account/profile',
					},
					{
						title: 'Портфолио',
						href: '/account/portfolio',
						context: 'freelancer',
						badge: '~works',
					},
					{
						title: 'Заявки',
						href: '/account/applications',
						context: 'freelancer',
						badge: '~applications',
					},
					{
						title: 'Сообщения',
						href: '/account/chat',
						badge: '~messages',
						badgeColor: 'success',
						badgeVariant: 'primary',
					},
				],
			},
			{
				title: 'Мои проекты',
				icon: 'folder-kanban',
				context: 'client',
				items: [
					{
						title: 'Проекты',
						href: '/account/projects',
						context: 'client',
						badge: '~projects',
					},
					{
						title: 'Заявки',
						href: '/account/projects/applications',
						context: 'client',
						badge: '~applications',
					},
				],
			},
			{ title: 'Избранные фрилансеры', href: '/account/pending', icon: 'users' },
			{
				title: 'Создать проект',
				href: '/account/projects/new',
				icon: 'briefcase-business',
				context: 'client',
			},
			{
				title: 'API',
				icon: 'blocks',
				context: 'freelancer',
				items: [
					{ title: 'Swagger', href: '/api/docs' },
					{ title: 'Reference', href: '/api/reference' },
				],
			},
		],
	},
	{
		title: 'Интеграция',
		items: [
			{ title: 'AI Assistant', icon: 'bot', href: '/account/pending', badge: 133 },
			{ title: 'Automation Hub', icon: 'workflow', href: '/account/pending', badge: '5.4' },
			{ title: 'Studio Space', icon: 'building', href: '/account/pending' },
		],
	},
]

type AccountSidebarProps = {
	context: AccountSnapshot
}

export function AccountSidebar({ context }: AccountSidebarProps) {
	useGate(AccountSidebarGate)
	const accountContext = useUnit($accountContext) ?? context

	return (
		<Sidebar
			context={accountContext.role}
			badges={accountContext}
			collapsible="icon"
			groups={sidebarGroups}
			variant="sidebar"
		/>
	)
}

const AccountSidebarGate = createGate({
	domain,
	name: 'AccountSidebarGate',
})
