import { map } from 'lodash'
import { type ComponentProps } from 'react'
import { Icon } from './icon'
import { Link } from './link'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './shadcn/collapsible'
import {
	Sidebar as SidebarRoot,
	SidebarContent,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
	SidebarRail,
} from './shadcn/sidebar'
import { type SidebarItemBase, SidebarHeaderMenu, type SidebarMenuProps } from './sidebar-menu'
import { cn } from '@/utils'

export type SidebarRootProps = ComponentProps<typeof SidebarRoot>
export type SidebarHeaderProps = ComponentProps<typeof SidebarHeader>

type SidebarLinkItem = SidebarItemBase & {
	open?: boolean
}

export type SidebarItem = SidebarLinkItem &
	(
		| { href: string; items?: never }
		| {
				collapsible?: boolean
				items: Array<Omit<SidebarLinkItem, 'icon'> & { href: string }>
		  }
	)

export type SidebarGroup = Omit<SidebarItemBase, 'icon'> & {
	collapsible?: boolean
	hiddenIcons?: boolean
	items: SidebarItem[]
}

export type SidebarItemClick = Omit<SidebarItemBase, 'icon'> & {
	href?: string | never
	icon?: SidebarItemBase['icon']
}

export type SidebarProps = SidebarRootProps & {
	header?: SidebarHeaderProps['children']
	menu?: SidebarMenuProps
	groups?: SidebarGroup[]
	onItemClick?: (item: SidebarItemClick, parent?: SidebarItemClick) => void
}

export function Sidebar({ header, menu, groups, onItemClick, className, ...props }: SidebarProps) {
	return (
		<SidebarRoot
			className={cn('group flex h-full flex-col bg-background text-foreground', className)}
			{...props}
		>
			<SidebarHeader>
				{header}
				{menu && <SidebarHeaderMenu {...menu} />}
			</SidebarHeader>
			<SidebarContent>
				{map(groups, (group, index) => (
					<SidebarGroup
						key={`${group.title}-${index}`}
						className={group.hiddenIcons ? 'group-data-[collapsible=icon]:hidden' : ''}
					>
						{group.title && <SidebarGroupLabel>{group.title}</SidebarGroupLabel>}
						<SidebarMenu>
							{group.collapsible && renderCollapsibleGroup(group.items, onItemClick)}
							{!group.collapsible && renderGroup(group.items, onItemClick)}
						</SidebarMenu>
					</SidebarGroup>
				))}
			</SidebarContent>
			<SidebarRail />
		</SidebarRoot>
	)
}

function renderCollapsibleGroup(
	items: SidebarGroup['items'],
	onClick: SidebarProps['onItemClick'],
) {
	return map(items, (groupItem, index) => (
		<Collapsible
			key={`${groupItem.title}-${index}`}
			asChild
			defaultOpen={groupItem.open}
			className="group/collapsible"
		>
			<SidebarMenuItem>
				{!groupItem.items && (
					<SidebarMenuButton
						asChild
						tooltip={groupItem.title}
						onClick={() => onClick?.(groupItem)}
					>
						{renderItem(groupItem)}
					</SidebarMenuButton>
				)}
				{groupItem.items && (
					<>
						<CollapsibleTrigger asChild>
							<SidebarMenuButton
								tooltip={groupItem.title}
								onClick={() => onClick?.(groupItem)}
							>
								{renderItem(groupItem)}
								<Icon
									name="chevron-right"
									color="current"
									className={
										'ml-auto transition-transform duration-200' +
										' group-data-[state=open]/collapsible:rotate-90'
									}
								/>
							</SidebarMenuButton>
						</CollapsibleTrigger>

						<CollapsibleContent>
							<SidebarMenuSub>
								{map(groupItem.items, (item, index) => (
									<SidebarMenuSubItem key={`${item.title}-${index}`}>
										<SidebarMenuSubButton
											asChild
											onClick={() => onClick?.(item, groupItem)}
										>
											<Link href={item.href}>{item.title}</Link>
										</SidebarMenuSubButton>
									</SidebarMenuSubItem>
								))}
							</SidebarMenuSub>
						</CollapsibleContent>
					</>
				)}
			</SidebarMenuItem>
		</Collapsible>
	))
}

function renderGroup(items: SidebarGroup['items'], onClick: SidebarProps['onItemClick']) {
	return map(items, (item, index) => (
		<SidebarMenuItem key={`${item.title}-${index}`}>
			<SidebarMenuButton tooltip={item.title} asChild onClick={() => onClick?.(item)}>
				{renderItem(item)}
			</SidebarMenuButton>
		</SidebarMenuItem>
	))
}

function renderItem(item: SidebarItem) {
	const iconItem = (
		<>
			<Icon
				name={item.icon}
				size={item.iconOptions?.size}
				color={item.iconOptions?.color ?? 'current'}
				spinning={item.iconOptions?.spinning}
				className={item.iconOptions?.tw}
			/>
			<span>{item.title}</span>
		</>
	)
	return item.items ? iconItem : <Link href={item.href}>{iconItem}</Link>
}

export { SidebarRoot, type SidebarMenuProps }
