'use client'

import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
	Icon,
	type IconName,
	Link,
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupAction,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuAction,
	SidebarMenuBadge,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
	SidebarSeparator,
	Stack,
} from '@/ui'
import { cn } from '@/utils'

type NavItem = {
	title: string
	href: string
	icon: IconName
	items?: Array<{
		title: string
		href: string
	}>
}

type PlaceholderProject = {
	title: string
	icon: IconName
	badge?: string
}

type AccountSidebarProps = {
	collapsed?: boolean
}

const mainNavItems: NavItem[] = [
	{
		title: 'Dashboard',
		href: '/dashboard',
		icon: 'layout-dashboard',
		items: [
			{ title: 'Профиль', href: '/dashboard#profile' },
			{ title: 'Портфолио', href: '/dashboard#portfolio' },
		],
	},
	{ title: 'Проекты', href: '/projects', icon: 'folder-kanban' },
	{ title: 'Фрилансеры', href: '/freelancers', icon: 'users' },
	{ title: 'Разместить проект', href: '/post-project', icon: 'briefcase-business' },
	{
		title: 'API',
		href: '/api/docs',
		icon: 'blocks',
		items: [
			{ title: 'Swagger', href: '/api/docs' },
			{ title: 'Reference', href: '/api/reference' },
		],
	},
]

const placeholderProjects: PlaceholderProject[] = [
	{ title: 'AI Assistant', icon: 'bot', badge: 'soon' },
	{ title: 'Automation Hub', icon: 'workflow', badge: 'soon' },
	{ title: 'Studio Space', icon: 'building', badge: 'soon' },
]

export function AccountSidebar({ collapsed = false }: AccountSidebarProps) {
	const pathname = usePathname()
	const [openItems, setOpenItems] = useState<Record<string, boolean>>({
		Dashboard: true,
		API: false,
	})

	const toggleItem = (title: string) => {
		setOpenItems((current) => ({
			...current,
			[title]: !current[title],
		}))
	}

	const navContent = (
		<>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size="lg" tooltip="NeuroGig workspace">
							<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
								<Icon name="building" size={16} color="contrast" />
							</div>
							<Stack
								vertical
								align="start"
								gap={0}
								className="min-w-0 flex-1 text-left text-sm leading-tight"
							>
								<span className="truncate font-medium">NeuroGig</span>
								<span className="truncate text-xs">Platform demo</span>
							</Stack>
							<Icon name="chevrons-up-down" color="current" className="ml-auto" />
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>

			<SidebarSeparator />

			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Platform</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{mainNavItems.map(({ title, href, icon, items }) => {
								const isActive =
									pathname === href ||
									(href !== '/' && pathname.startsWith(`${href}/`))
								const isOpen = openItems[title]

								if (!items) {
									return (
										<SidebarMenuItem key={href}>
											<SidebarMenuButton
												asChild
												isActive={isActive}
												tooltip={title}
											>
												<Link
													href={href}
													aria-current={isActive ? 'page' : undefined}
												>
													<Icon name={icon} color="current" />
													<span>{title}</span>
												</Link>
											</SidebarMenuButton>
										</SidebarMenuItem>
									)
								}

								return (
									<SidebarMenuItem key={href}>
										<SidebarMenuButton
											type="button"
											isActive={isActive}
											tooltip={title}
											onClick={() => toggleItem(title)}
										>
											<Icon name={icon} color="current" />
											<span>{title}</span>
											<Icon
												name="chevron-right"
												color="current"
												className={cn(
													'ml-auto transition-transform duration-200',
													isOpen && 'rotate-90',
												)}
											/>
										</SidebarMenuButton>

										{isOpen ? (
											<SidebarMenuSub>
												{items.map(({ title: subTitle, href: subHref }) => (
													<SidebarMenuSubItem key={subHref}>
														<SidebarMenuSubButton
															asChild
															isActive={pathname === subHref}
														>
															<Link href={subHref}>{subTitle}</Link>
														</SidebarMenuSubButton>
													</SidebarMenuSubItem>
												))}
											</SidebarMenuSub>
										) : null}
									</SidebarMenuItem>
								)
							})}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>

				<SidebarGroup>
					<SidebarGroupLabel>Projects</SidebarGroupLabel>
					<SidebarGroupAction
						type="button"
						title="Добавить проект (placeholder)"
						aria-label="Добавить проект (placeholder)"
					>
						<Icon name="plus" color="current" />
					</SidebarGroupAction>
					<SidebarGroupContent>
						<SidebarMenu>
							{placeholderProjects.map(({ title, icon, badge }) => (
								<SidebarMenuItem key={title}>
									<SidebarMenuButton tooltip={title} disabled>
										<Icon name={icon} color="current" />
										<span>{title}</span>
									</SidebarMenuButton>
									<SidebarMenuAction
										type="button"
										showOnHover
										title="Опции проекта (placeholder)"
										aria-label={`Опции ${title} (placeholder)`}
									>
										<Icon name="more-horizontal" color="current" />
									</SidebarMenuAction>
									{badge ? <SidebarMenuBadge>{badge}</SidebarMenuBadge> : null}
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</>
	)

	return (
		<div
			className="group flex h-full flex-col bg-background text-foreground"
			data-collapsible={collapsed ? 'icon' : ''}
		>
			{navContent}
		</div>
	)
}

export function AccountNavMobile() {
	return (
		<div className="md:hidden">
			<Sidebar>
				<AccountSidebar />
			</Sidebar>
		</div>
	)
}
