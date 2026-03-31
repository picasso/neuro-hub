'use client'

import { sample } from 'effector'
import { createGate, useGate, useUnit } from 'effector-react'
import { useCallback } from 'react'
import type { AccountSnapshot } from '@/lib/account'
import { accountSidebarDomain as domain } from '@/lib/logger'
import { $accountContext } from '@/stores/account-context/model'
import { type BreadcrumbProps, Sidebar, type SidebarGroup, type SidebarItemClick } from '@/ui'

const sidebarGroups: SidebarGroup[] = [
	{
		title: 'Platform',
		collapsible: true,
		items: [
			{ title: 'Обзор', href: '/account/dashboard', icon: 'layout-dashboard' },
			{
				title: 'Аккаунт',
				open: true,
				icon: 'user-plus',
				items: [
					{ title: 'Профиль', href: '/account/profile' },
					{ title: 'Портфолио', href: '/account/portfolio', context: 'freelancer' },
					{ title: 'Заявки', href: '/account/applications', context: 'freelancer' },
					{ title: 'Заявки', href: '/account/projects/applications', context: 'client' },
					{ title: 'Сообщения', href: '/account/chat' },
				],
			},
			{ title: 'Проекты', href: '/projects', icon: 'folder-kanban' },
			{ title: 'Фрилансеры', href: '/freelancers', icon: 'users' },
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
		title: 'Projects',
		items: [
			{ title: 'AI Assistant', icon: 'bot', href: '/account/pending' },
			{ title: 'Automation Hub', icon: 'workflow', href: '/account/pending' },
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

	const onItemClick = useCallback((current: SidebarItemClick, parent?: SidebarItemClick) => {
		updateBreadcrumb({ current, parent })
	}, [])
	return (
		<Sidebar
			context={accountContext.role}
			collapsible="icon"
			groups={sidebarGroups}
			variant="sidebar"
			onItemClick={onItemClick}
		/>
	)
}

// * * * $breadcrumb ------------------------------------------------------------------------------]

type BreadcrumbPath = NonNullable<BreadcrumbProps['path']>
type BreadcrumbUpdate = { current: SidebarItemClick; parent?: SidebarItemClick }

const AccountSidebarGate = createGate({
	domain,
	name: 'AccountSidebarGate',
})
const resetBreadcrumb = domain.createEvent('resetBreadcrumb')
const updateBreadcrumb = domain.createEvent<BreadcrumbUpdate>('updateBreadcrumb')
export const $breadcrumb = domain.createStore<BreadcrumbPath>([], { name: '$breadcrumb' })

$breadcrumb.reset(resetBreadcrumb)
$breadcrumb.on(updateBreadcrumb, (_, update) => {
	const { current, parent } = update
	const currentPath = current.href ? [current.title, current.href] : current.title
	const parentPath = parent?.href ? [parent.title, parent.href] : parent ? parent.title : null
	return (parentPath ? [parentPath, currentPath] : [currentPath]) as BreadcrumbPath
})

// clear breadcrumb trail when sidebar gate opens
sample({
	clock: AccountSidebarGate.open,
	target: resetBreadcrumb,
})
