import { isString, map } from 'lodash'
import Image from 'next/image'
import { type ComponentProps } from 'react'
import { Avatar, type AvatarProps } from './avatar'
import { Button, type ButtonProps } from './button'
import { FieldWrapper, type FieldWrapperProps } from './field'
import { Icon, type IconProps, type IconName } from './icon'
import {
	ComboboxChip,
	ComboboxChips,
	ComboboxChipsInput,
	ComboboxCollection,
	Combobox as ComboboxRoot,
	type ComboboxPrimitive,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxGroup,
	ComboboxInput,
	ComboboxItem,
	ComboboxLabel,
	ComboboxList,
	ComboboxSeparator,
	ComboboxValue,
} from './shadcn/combobox'
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemFooter,
	ItemMedia,
	ItemTitle,
} from './shadcn/item'
import { cn } from '@/lib/utils'
import { simpleMarkdown } from '@/utils'

// types ------------------------------------------------------------------------------------------]

// eslint-disable-next-line @typescript-eslint/no-namespace
export declare namespace ComboboxProps {
	type Root<Value, Multiple extends boolean | undefined = false> = ComboboxPrimitive.Root.Props<
		Value,
		Multiple
	>
	type Value = ComponentProps<typeof ComboboxValue>
	type Input = ComponentProps<typeof ComboboxInput>
	type Content = ComponentProps<typeof ComboboxContent>
	type List = ComponentProps<typeof ComboboxList>
	type Item = ComponentProps<typeof ComboboxItem>
	type Group = ComponentProps<typeof ComboboxGroup>
	type Label = ComponentProps<typeof ComboboxLabel>
	type Collection = ComponentProps<typeof ComboboxCollection>
	type Empty = ComponentProps<typeof ComboboxEmpty>
	type Separator = ComponentProps<typeof ComboboxSeparator>
	type Chips = ComponentProps<typeof ComboboxChips>
	type Chip = ComponentProps<typeof ComboboxChip>
	type ChipsInput = ComponentProps<typeof ComboboxChipsInput>
}

// const X: ComboboxProps.Group = {}

export type ComboOption = {
	value: string
	option?: Omit<ComboboxProps.Item, 'value'>
	label: string
}
// type ComboValue = ComboOption | null | undefined
// type ComboOnChange = ((value: ComboValue) => void) | undefined
// type ComboItemToString = ((item: ComboOption) => string) | undefined

export type ComboGroup = {
	value: string
	items?: Array<string | Omit<ComboboxProps.Item, 'value'>>
}

type ItemProps = ComponentProps<typeof Item>
type ItemMediaProps = ComponentProps<typeof ItemMedia>
type ItemTitleProps = ComponentProps<typeof ItemTitle>
type ItemDescriptionProps = ComponentProps<typeof ItemDescription>
type ItemActionsProps = ComponentProps<typeof ItemActions>
type ItemFooterProps = ComponentProps<typeof ItemFooter>
type ItemContentProps = ComponentProps<typeof ItemContent>

export type ComboCustomItem = {
	value: string
	size?: ItemProps['size']
	variant?: ItemProps['variant']
	// single action button for the item
	button?: ButtonProps['label']
	buttonVariant?: ButtonProps['variant']
	buttonSize?: ButtonProps['size']
	buttonLeftIcon?: IconProps['name']
	buttonRightIcon?: IconProps['name']
	// icon for the item
	icon?: IconName
	iconSize?: IconProps['size']
	iconColor?: IconProps['color']
	// image for the item
	image?: string
	// avatar for the item
	avatar?: AvatarProps['name']
	avatarSize?: AvatarProps['size']
	avatarColor?: AvatarProps['color']
	avatarBadge?: AvatarProps['badge']
	avatarBordered?: AvatarProps['bordered']
	avatarSrc?: AvatarProps['src']

	title?: ItemTitleProps['children']
	desc?: ItemDescriptionProps['children']
	actions?: ItemActionsProps['children']
	footer?: ItemFooterProps['children']
	// custom class names for item elements
	className?: ItemProps['className']
	mediaClassName?: ItemMediaProps['className']
	titleClassName?: ItemTitleProps['className']
	descClassName?: ItemDescriptionProps['className']
	actionsClassName?: ItemActionsProps['className']
	footerClassName?: ItemFooterProps['className']
	contentClassName?: ItemContentProps['className']
}

export type ComboboxProps<Value, Multiple extends boolean | undefined = false> = FieldWrapperProps &
	ComboboxPrimitive.Root.Props<Value, Multiple> & {
		multiple?: Multiple
		chipsAnchor?: React.RefObject<HTMLDivElement | null>
		showClear?: ComboboxProps.Input['showClear']
		showTrigger?: ComboboxProps.Input['showTrigger']
		placeholder?: ComboboxProps.Input['placeholder']
		empty?: ComboboxProps.Empty['children']
		list?: ComboboxProps.List['children']
	}

// Combobox ---------------------------------------------------------------------------------------]

export function Combobox<Value = ComboOption, Multiple extends boolean | undefined = false>({
	multiple,
	chipsAnchor,
	showClear,
	showTrigger,
	items,
	itemToStringValue,
	value,
	onValueChange,
	onInputValueChange,
	label,
	helper,
	error,
	placeholder,
	empty,
	list,
	disabled = false,
	required,
	labelClassName,
	...comboboxProps
}: ComboboxProps<Value, Multiple>) {
	const inner = multiple ? (
		<>
			<ComboboxChips ref={chipsAnchor} className="w-full max-w-xs">
				<ComboboxValue>
					{(values) => (
						<>
							{map(values, (value: string) => (
								<ComboboxChip key={value}>{value}</ComboboxChip>
							))}
							<ComboboxChipsInput />
						</>
					)}
				</ComboboxValue>
			</ComboboxChips>
			<ComboboxContent anchor={chipsAnchor}>
				<ComboboxEmpty>No items found.</ComboboxEmpty>
				<ComboboxList>
					{(item) => (
						<ComboboxItem key={item} value={item}>
							{item}
						</ComboboxItem>
					)}
				</ComboboxList>
			</ComboboxContent>
		</>
	) : (
		<>
			<ComboboxInput
				showClear={showClear}
				showTrigger={showTrigger}
				placeholder={placeholder}
				disabled={disabled}
				aria-invalid={!!error}
			/>
			<ComboboxContent>
				<ComboboxEmpty>{empty ?? 'Ничего не найдено'}</ComboboxEmpty>
				<ComboboxList>
					{list ??
						((item: ComboOption) => (
							<ComboboxItem key={item.value} value={item}>
								{item.label}
							</ComboboxItem>
						))}
				</ComboboxList>
			</ComboboxContent>
		</>
	)

	return (
		<FieldWrapper
			label={label}
			helper={helper}
			error={error}
			required={required}
			disabled={disabled}
			labelClassName={labelClassName}
		>
			<ComboboxRoot
				multiple={multiple}
				items={items}
				itemToStringValue={itemToStringValue ?? ((item) => (item as ComboOption).value)}
				value={value}
				onValueChange={onValueChange}
				onInputValueChange={onInputValueChange}
				disabled={disabled}
				{...comboboxProps}
			>
				{inner}
			</ComboboxRoot>
		</FieldWrapper>
	)
}

// simple combobox (string values only) -----------------------------------------------------------]

export function ComboboxSimple({
	itemToStringValue: _,
	list: __,
	...props
}: ComboboxProps<string, false>) {
	return (
		<Combobox<string, false>
			itemToStringValue={(item) => item}
			list={(item) => (
				<ComboboxItem key={item} value={item}>
					{item}
				</ComboboxItem>
			)}
			{...props}
		/>
	)
}

// groupped combobox (string values only) ---------------------------------------------------------]

export function ComboboxGroupped({
	items,
	itemToStringValue: _,
	list: __,
	...props
}: ComboboxProps<ComboGroup, false>) {
	return (
		<Combobox<ComboGroup, false>
			items={items}
			list={(group: ComboGroup, index: number) => (
				<ComboboxGroup key={group.value} items={group.items}>
					<ComboboxLabel>{group.value}</ComboboxLabel>
					<ComboboxCollection>
						{(item) => (
							<ComboboxItem key={item} value={item}>
								{item}
							</ComboboxItem>
						)}
					</ComboboxCollection>
					{items && index < items.length - 1 && <ComboboxSeparator />}
				</ComboboxGroup>
			)}
			{...props}
		/>
	)
}

// custom combobox (custom items) -----------------------------------------------------------------]

{
	/* <ComboboxValue>
	{(values) => (
		<>
			{values.map((value: string) => (
				<ComboboxChip key={value}>{value}</ComboboxChip>
			))}
			<ComboboxChipsInput />
		</>
	)}
</ComboboxValue> */
}

export type ComboboxCustomProps = ComboboxProps<ComboCustomItem, false> & {
	variant?: ItemProps['variant']
	size?: ItemProps['size']
	itemClassName?: ComboCustomItem['className']
	titleClassName?: ComboCustomItem['titleClassName']
	descClassName?: ComboCustomItem['descClassName']
	contentClassName?: ComboCustomItem['contentClassName']
	actionsClassName?: ComboCustomItem['actionsClassName']
	footerClassName?: ComboCustomItem['footerClassName']
	mediaClassName?: ComboCustomItem['mediaClassName']
}

export function ComboboxCustom({
	items,
	variant,
	size,
	itemClassName: itemCn,
	titleClassName: titleCn,
	descClassName: descCn,
	contentClassName: contentCn,
	actionsClassName: actionsCn,
	footerClassName: footerCn,
	mediaClassName: mediaCn,
	itemToStringValue: _,
	list: __,
	...props
}: ComboboxCustomProps) {
	return (
		<Combobox<ComboCustomItem, false>
			items={items}
			itemToStringLabel={(item: ComboCustomItem) => String(item.title)}
			list={(item: ComboCustomItem) => (
				<ComboboxItem key={item.value} value={item}>
					<Item
						size={item.size ?? size}
						variant={item.variant ?? variant}
						className={item.className ?? itemCn}
					>
						{(item.icon || item.image || item.avatar) && (
							<ItemMedia
								variant={item.icon ? 'icon' : item.image ? 'image' : 'default'}
								className={item.mediaClassName ?? mediaCn}
							>
								{item.icon && (
									<Icon
										name={item.icon}
										size={item.iconSize ?? 'md'}
										color={item.iconColor ?? 'secondary'}
									/>
								)}
								{item.image && (
									<Image
										src={item.image}
										alt={isString(item.title) ? item.title : ''}
										className="size-full object-cover"
										width={40}
										height={40}
										placeholder={'empty'}
									/>
								)}
								{item.avatar && (
									<Avatar
										name={item.avatar}
										size={item.avatarSize}
										color={item.avatarColor}
										badge={item.avatarBadge}
										bordered={item.avatarBordered}
										src={item.avatarSrc}
									/>
								)}
							</ItemMedia>
						)}
						<ItemContent className={item.contentClassName ?? contentCn}>
							<ItemTitle className={item.titleClassName ?? titleCn}>
								{item.title}
							</ItemTitle>
							<ItemDescription
								className={cn('markdown-root narrow', item.descClassName ?? descCn)}
							>
								{simpleMarkdown(item.desc, { br: true })}
							</ItemDescription>
						</ItemContent>
						{(item.button || item.actions) && (
							<ItemActions className={item.actionsClassName ?? actionsCn}>
								{item.button && (
									<Button
										variant={item.buttonVariant ?? 'outline'}
										size={item.buttonSize ?? 'xs'}
										leftIcon={item.buttonLeftIcon}
										rightIcon={item.buttonRightIcon}
										label={item.button}
									/>
								)}
								{item.actions}
							</ItemActions>
						)}
						{item.footer && (
							<ItemFooter className={item.footerClassName ?? footerCn}>
								{item.footer}
							</ItemFooter>
						)}
					</Item>
				</ComboboxItem>
			)}
			{...props}
		/>
	)
}
