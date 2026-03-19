import { map } from 'lodash'
import { useState } from 'react'
import { Icon, type IconName, type IconOptions } from './icon'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from './shadcn/dropdown-menu'
import {
	SidebarMenu,
	SidebarMenuItem,
	SidebarMenuButton,
	useSidebar,
	SidebarSeparator,
} from './shadcn/sidebar'
import { Stack } from './stack'

export type SidebarItemBase = {
	title: string
	icon: IconName
	iconOptions?: IconOptions
	disabled?: boolean
}

export type SidebarMenuItem = SidebarItemBase & {
	description?: string
}

export type SidebarMenuProps = {
	active?: number
	label?: string
	items?: SidebarMenuItem[]
	separator?: boolean
}

export function SidebarHeaderMenu({ active, label, items, separator }: SidebarMenuProps) {
	const { isMobile } = useSidebar()
	const [activeTeam, setActiveTeam] = useState(items?.[active ?? 0])
	if (!activeTeam) return null

	return (
		<>
			<SidebarMenu>
				<SidebarMenuItem>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<SidebarMenuButton size="lg" tooltip="NeuroGig workspace">
								<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
									<Icon name={activeTeam.icon} size={16} color="contrast" />
								</div>
								<Stack
									vertical
									align="start"
									gap={0}
									className="min-w-0 flex-1 text-left text-sm leading-tight"
								>
									<span className="truncate font-medium">{activeTeam.title}</span>
									{activeTeam.description && (
										<span className="truncate text-xs">
											{activeTeam.description}
										</span>
									)}
								</Stack>
								<Icon name="chevrons-up-down" color="current" className="ml-auto" />
							</SidebarMenuButton>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
							align="start"
							side={isMobile ? 'bottom' : 'right'}
							sideOffset={4}
						>
							{label && <DropdownMenuLabel>{label}</DropdownMenuLabel>}
							{map(items, (item, index) => (
								<DropdownMenuItem
									key={`${item.title}-${index}`}
									onClick={() => setActiveTeam(item)}
									className="gap-2 p-2"
								>
									<Stack className="size-6 justify-center rounded-md border">
										<Icon
											name={item.icon}
											size={item.iconOptions?.size}
											color={item.iconOptions?.color ?? 'current'}
											spinning={item.iconOptions?.spinning}
											className={item.iconOptions?.tw}
											accent={item.iconOptions?.accent}
										/>
										<span>{item.title}</span>
									</Stack>
								</DropdownMenuItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>
				</SidebarMenuItem>
			</SidebarMenu>

			{separator && <SidebarSeparator />}
		</>
	)
}
