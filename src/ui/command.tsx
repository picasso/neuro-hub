import { map } from 'lodash'
import { type Route } from 'next'
import NextLink from 'next/link'
import { Fragment, type ReactNode, type ComponentProps, useState } from 'react'
import { Badge, type BadgeProps } from './badge'
import { Icon, type IconName, type IconOptions } from './icon'
import { Popover } from './popover'
import {
	Command as CommandRoot,
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
	CommandShortcut,
} from './shadcn/command'
import { Stack } from './stack'
import { TS } from './text-styled'
import { cn } from '@/utils'

// types ------------------------------------------------------------------------------------------]

export type CommandOption = {
	value: string
	label: ReactNode
	disabled?: boolean
	icon?: IconName
	iconOptions?: IconOptions
	shortcut?: ReactNode
	badge?: ReactNode
	badgeProps?: Partial<Omit<BadgeProps, 'children'>>
	keywords?: string[]
	href?: Route
	onSelect?: () => void
	closable?: boolean
	hideZero?: boolean
}

export type CommandOptionGroup = {
	label?: ReactNode
	items: CommandOption[]
	separator?: boolean
}

type CommandDataProps =
	| { items: CommandOption[]; groups?: never }
	| { groups: CommandOptionGroup[]; items?: never }

type CommandCommonProps = CommandDataProps & {
	value?: string
	onValueChange?: (value: string) => void
	input?: boolean
	inputPlaceholder?: string
	emptyText?: string
	onItemSelect?: (option: CommandOption) => void
	className?: string
	listClassName?: string
}

type CommandRootProps = ComponentProps<typeof CommandRoot>

export type CommandProps = CommandCommonProps &
	Omit<CommandRootProps, 'className' | 'value' | 'onValueChange' | 'children'> & {
		withoutRoot?: boolean
		forceClose?: () => void
	}

// Command ----------------------------------------------------------------------------------------]

export function Command({
	input,
	inputPlaceholder,
	emptyText = 'Ничего не найдено.',
	onItemSelect,
	className,
	listClassName,
	value,
	onValueChange,
	items,
	groups,
	withoutRoot,
	forceClose,
	...rootProps
}: CommandProps) {
	const data: CommandDataProps = items ? { items } : { groups: groups! }

	const inner = (
		<>
			{input && <CommandInput placeholder={inputPlaceholder} />}
			<CommandList className={listClassName}>
				<CommandListBody
					{...data}
					emptyText={emptyText}
					onItemSelect={onItemSelect}
					onClose={forceClose}
				/>
			</CommandList>
		</>
	)

	return withoutRoot ? (
		inner
	) : (
		<CommandRoot
			className={className}
			value={value}
			onValueChange={onValueChange}
			{...rootProps}
		>
			{inner}
		</CommandRoot>
	)
}

// CommandPalette ---------------------------------------------------------------------------------]

export type CommandPaletteProps = CommandCommonProps &
	Omit<
		ComponentProps<typeof CommandDialog>,
		'className' | 'value' | 'onValueChange' | 'children' | 'open' | 'onOpenChange'
	> & {
		open: boolean
		onOpenChange: (open: boolean) => void
	}

export function CommandPalette({
	input,
	inputPlaceholder,
	emptyText,
	onItemSelect,
	listClassName,
	open,
	onOpenChange,
	title,
	description,
	showCloseButton,
	className,
	value,
	onValueChange,
	items,
	groups,
	...commandDialogRest
}: CommandPaletteProps) {
	return (
		<CommandDialog
			open={open}
			onOpenChange={onOpenChange}
			title={title}
			description={description}
			showCloseButton={showCloseButton}
			className={className}
			value={value}
			onValueChange={onValueChange}
			{...commandDialogRest}
		>
			<Command
				withoutRoot
				{...{
					input,
					inputPlaceholder,
					emptyText,
					onItemSelect,
					listClassName,
				}}
				{...({
					items,
					groups,
				} as CommandDataProps)}
			/>
		</CommandDialog>
	)
}

// CommandMenu ------------------------------------------------------------------------------------]

export type CommandMenuProps = CommandCommonProps &
	Omit<ComponentProps<typeof Popover>, 'className' | 'trigger'> & {
		popoverClassName?: string
	}

export function CommandMenu({
	align,
	sideOffset,
	flush,
	button,
	buttonChevron,
	buttonProps,
	title,
	desc,
	header,
	footer,
	headerClassName,
	footerClassName,
	open,
	onOpenChange,
	children,
	popoverClassName,

	...commandProps
}: CommandMenuProps) {
	const [openProxy, setOpenProxy] = useState(false)
	const trigger = children ? (
		<button
			data-command="trigger"
			data-slot="command-trigger"
			aria-label="Toggle Command"
			tabIndex={-1}
			onClick={() => setOpenProxy(!openProxy)}
		>
			{children}
		</button>
	) : undefined

	return (
		<Popover
			flush={flush}
			open={open === undefined ? openProxy : open}
			onOpenChange={onOpenChange === undefined ? setOpenProxy : onOpenChange}
			trigger={trigger}
			className={popoverClassName}
			headerClassName={cn('px-4 py-2 bg-muted border-b', headerClassName)}
			{...{
				align,
				sideOffset,
				button,
				buttonChevron,
				buttonProps,
				title,
				desc,
				header,
				footer,
				footerClassName,
			}}
		>
			<Command {...commandProps} forceClose={() => setOpenProxy(false)} />
		</Popover>
	)
}

// helpers ----------------------------------------------------------------------------------------]

type CommandItemRowProps = {
	option: CommandOption
	onItemSelect?: (option: CommandOption) => void
	onClose?: () => void
	className?: string
}

function CommandItemRow({ option, onItemSelect, onClose, className }: CommandItemRowProps) {
	const {
		value,
		label,
		icon,
		iconOptions,
		shortcut,
		badge,
		badgeProps,
		keywords,
		disabled,
		onSelect,
		hideZero,
	} = option
	const { tw: iconClassName, ...iconRest } = iconOptions ?? {}
	const onSelectProxy = (option: CommandOption) => {
		onSelect?.()
		if (!onSelect) onItemSelect?.(option)
		if (option.closable !== false) onClose?.()
	}

	return (
		<CommandItem
			value={value}
			keywords={keywords}
			disabled={disabled}
			onSelect={() => onSelectProxy(option)}
			className={className}
		>
			{icon && (
				<Icon
					name={icon}
					color="dimmed"
					size="sm"
					className={iconClassName}
					{...iconRest}
				/>
			)}
			<TS clean inline variant="subtitle">
				{label}
			</TS>
			{(shortcut != null || badge != null) && (
				<CommandShortcut>
					<Stack
						direction="row"
						align="center"
						gap={2}
						className="ml-auto min-w-0 justify-end"
					>
						{shortcut != null && (
							<span className="shrink-0 text-muted-foreground">{shortcut}</span>
						)}
						{checkBadge(badge, hideZero) && (
							<Badge size="xs" className="shrink-0" {...badgeProps}>
								{badge}
							</Badge>
						)}
					</Stack>
				</CommandShortcut>
			)}
		</CommandItem>
	)
}

type CommandListBodyProps = CommandDataProps & {
	emptyText: string
	onItemSelect?: CommandItemRowProps['onItemSelect']
	onClose?: CommandItemRowProps['onClose']
}

function CommandListBody({ emptyText, onItemSelect, onClose, ...props }: CommandListBodyProps) {
	if ('items' in props && props.items) {
		return (
			<>
				<CommandEmpty>{emptyText}</CommandEmpty>
				{map(props.items, (option, index) => (
					<CommandItemRow
						key={index}
						option={option}
						onItemSelect={onItemSelect}
						onClose={onClose}
					/>
				))}
			</>
		)
	}

	return (
		<>
			<CommandEmpty>{emptyText}</CommandEmpty>
			{map(props.groups, ({ label, items, separator }, index) => (
				<Fragment key={`group-${index}`}>
					<CommandGroup heading={label}>
						{map(items, ({ href, ...option }, itemIndex) => {
							const key = `item-${itemIndex}`
							const row = (
								<CommandItemRow
									key={key}
									option={option}
									onItemSelect={onItemSelect}
									className={cn(href && 'cursor-pointer')}
									onClose={onClose}
								/>
							)
							return href ? (
								<NextLink key={key} href={href}>
									{row}
								</NextLink>
							) : (
								row
							)
						})}
						{separator && index < props.groups.length - 1 && (
							<CommandSeparator className="mt-2" />
						)}
					</CommandGroup>
				</Fragment>
			))}
		</>
	)
}

function checkBadge(badge: CommandOption['badge'], hideZero?: CommandOption['hideZero']) {
	if (hideZero !== false && badge === 0) return false
	if (badge == 0) return true
	return !!badge
}
