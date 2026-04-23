import { map, startsWith } from 'lodash'
import { type ComponentProps } from 'react'
import { Badge, type BadgeVariant, type BadgeColor } from './badge'
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
	SidebarMenuBadge,
} from './shadcn/sidebar'
import { type SidebarItemBase, SidebarHeaderMenu, type SidebarMenuProps } from './sidebar-menu'
import { cn } from '@/utils'

export type SidebarRootProps = ComponentProps<typeof SidebarRoot>
export type SidebarHeaderProps = ComponentProps<typeof SidebarHeader>

type BadgeItem = {
	badge?: number | string
	badgeColor?: BadgeColor
	badgeVariant?: BadgeVariant
}
type BadgeItemStrict = Required<BadgeItem>

type SidebarLinkItem = SidebarItemBase &
	BadgeItem & {
		open?: boolean
		context?: string
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
	context?: string
	items: SidebarItem[]
}

export type SidebarItemClick = Omit<SidebarItemBase, 'icon'> & {
	href?: string | never
	icon?: SidebarItemBase['icon']
}

export type SidebarProps = SidebarRootProps & {
	context?: string
	// NOTE: if prop `badge` starts with `~,` it will be treated as a key from the `badges` prop
	badges?: Record<string, number | string>
	header?: SidebarHeaderProps['children']
	menu?: SidebarMenuProps
	groups?: SidebarGroup[]
	onItemClick?: (item: SidebarItemClick, parent?: SidebarItemClick) => void
}

export function Sidebar({
	context,
	badges = {},
	header,
	menu,
	groups,
	onItemClick,
	className,
	...props
}: SidebarProps) {
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
				{map(groups, (group, index) =>
					!isContext(group, context) ? null : (
						<SidebarGroup
							key={`${group.title}-${index}`}
							className={
								group.hiddenIcons ? 'group-data-[collapsible=icon]:hidden' : ''
							}
						>
							{group.title && <SidebarGroupLabel>{group.title}</SidebarGroupLabel>}
							<SidebarMenu>
								{group.collapsible &&
									renderCollapsibleGroup(
										group.items,
										onItemClick,
										badges,
										context,
									)}
								{!group.collapsible &&
									renderGroup(group.items, onItemClick, badges, context)}
							</SidebarMenu>
						</SidebarGroup>
					),
				)}
			</SidebarContent>
			<SidebarRail />
		</SidebarRoot>
	)
}

function renderCollapsibleGroup(
	items: SidebarGroup['items'],
	onClick: SidebarProps['onItemClick'],
	badges: SidebarProps['badges'],
	context?: string,
) {
	return map(items, (groupItem, index) =>
		!isContext(groupItem, context) ? null : (
			<Collapsible
				key={`${groupItem.title}-${index}`}
				asChild
				defaultOpen={groupItem.open}
				className="group/collapsible"
			>
				<SidebarMenuItem>
					{!groupItem.items && (
						<>
							<SidebarMenuButton
								asChild
								tooltip={groupItem.title}
								onClick={() => onClick?.(groupItem)}
							>
								{renderItem(groupItem)}
							</SidebarMenuButton>
							{renderBadge(groupItem, badges)}
						</>
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
									{map(groupItem.items, (item, index) =>
										!isContext(item, context) ? null : (
											<SidebarMenuSubItem key={`${item.title}-${index}`}>
												<SidebarMenuSubButton
													asChild
													onClick={() => onClick?.(item, groupItem)}
												>
													<Link href={item.href}>{item.title}</Link>
												</SidebarMenuSubButton>
												{renderBadge(item, badges)}
											</SidebarMenuSubItem>
										),
									)}
								</SidebarMenuSub>
							</CollapsibleContent>
						</>
					)}
				</SidebarMenuItem>
			</Collapsible>
		),
	)
}

function renderGroup(
	items: SidebarGroup['items'],
	onClick: SidebarProps['onItemClick'],
	badges: SidebarProps['badges'],
	context?: string,
) {
	return map(items, (item, index) =>
		!isContext(item, context) ? null : (
			<SidebarMenuItem key={`${item.title}-${index}`}>
				<SidebarMenuButton tooltip={item.title} asChild onClick={() => onClick?.(item)}>
					{renderItem(item)}
				</SidebarMenuButton>
				{renderBadge(item, badges)}
			</SidebarMenuItem>
		),
	)
}

function renderItem(item: SidebarItem) {
	const { tw: iconClassName, ...options } = item.iconOptions ?? {}
	const iconItem = (
		<>
			<Icon
				name={item.icon}
				{...options}
				color={item.iconOptions?.color ?? 'current'}
				className={iconClassName}
			/>
			<span>{item.title}</span>
		</>
	)
	return item.items ? iconItem : <Link href={item.href}>{iconItem}</Link>
}

function renderBadge(item: BadgeItem, badges?: SidebarProps['badges']) {
	return isBadge(item, badges) ? (
		<SidebarMenuBadge>
			<Badge
				size="xs"
				variant={item.badgeVariant ?? 'outline'}
				label={getBadge(item, badges)}
				color={item.badgeColor ?? 'dimmed'}
			/>
		</SidebarMenuBadge>
	) : null
}

function isContext(set: { context?: string }, context?: string) {
	return context && set.context ? set.context === context : true
}

function isBadge(item: BadgeItem, badges?: SidebarProps['badges']): item is BadgeItemStrict {
	const { badge } = item
	const isKey = startsWith(String(badge), '~')
	return badge ? (isKey ? !!badges?.[(badge as string).slice(1)] : true) : false
}

function getBadge(item: BadgeItemStrict, badges?: SidebarProps['badges']) {
	const { badge } = item
	return fixCount(startsWith(String(badge), '~') ? badges?.[(badge as string).slice(1)] : badge)
}

function fixCount(value?: string | number, limit = 99) {
	const number = Number(value)
	return String(Number.isNaN(number) ? value : number > limit ? `${limit}+` : value)
}

export { SidebarRoot, type SidebarMenuProps }
