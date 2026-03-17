'use client'

import { useCallback, useEffect } from 'react'
import { genericDomain as domain } from '@/lib/logger'
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
					{ title: 'Портфолио', href: '/account/portfolio' },
				],
			},
			{ title: 'Проекты', href: '/projects', icon: 'folder-kanban' },
			{ title: 'Фрилансеры', href: '/freelancers', icon: 'users' },
			{ title: 'Разместить проект', href: '/post-project', icon: 'briefcase-business' },
			{
				title: 'API',
				icon: 'blocks',
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

export function AccountSidebar() {
	// reset breadcrumb on mount
	useEffect(() => {
		resetBreadcrumb()
	}, [])

	const onItemClick = useCallback((current: SidebarItemClick, parent?: SidebarItemClick) => {
		updateBreadcrumb({ current, parent })
	}, [])
	return (
		<Sidebar
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
