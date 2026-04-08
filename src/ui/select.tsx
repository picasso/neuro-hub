import { isString } from 'lodash'
import { type ComponentProps } from 'react'
import { FieldWrapper, type FieldWrapperProps } from './field'
import {
	Select as SelectRoot,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectSeparator,
	SelectTrigger,
	SelectValue,
} from './shadcn/select'
import { cn } from '@/utils'

// types ------------------------------------------------------------------------------------------]

export type SelectOption = {
	value: string
	label: string
	disabled?: boolean
}

export type SelectOptionGroup = {
	label?: string
	options: SelectOption[]
	separator?: boolean
}

export type SelectProps = FieldWrapperProps &
	ComponentProps<typeof SelectRoot> & {
		placeholder?: string
		items?: SelectOption[] | string[]
		groups?: SelectOptionGroup[]
		triggerClassName?: string
		size?: 'sm' | 'default'
		alignWithTrigger?: boolean
		compact?: boolean
	}

// Select -----------------------------------------------------------------------------------------]

export function Select({
	label,
	helper,
	error,
	required,
	disabled,
	horizontal,
	htmlFor,
	placeholder,
	items,
	groups,
	size,
	alignWithTrigger,
	compact,
	labelClassName,
	helperClassName,
	horizontalClassName,
	triggerClassName,
	...selectProps
}: SelectProps) {
	return (
		<FieldWrapper
			label={label}
			helper={helper}
			error={error}
			required={required}
			disabled={disabled}
			labelClassName={cn(compact && 'text-xs', labelClassName)}
			helperClassName={cn(compact && 'text-xs', helperClassName)}
			horizontalClassName={cn(compact && 'text-xs', horizontalClassName)}
			horizontal={horizontal}
			htmlFor={htmlFor}
		>
			<SelectRoot disabled={disabled} {...selectProps}>
				<SelectTrigger
					className={cn(compact && 'h-8 text-xs', triggerClassName)}
					size={(size ?? compact) ? 'sm' : undefined}
					aria-invalid={!!error}
				>
					<SelectValue placeholder={placeholder} />
				</SelectTrigger>
				<SelectContent position={alignWithTrigger ? 'item-aligned' : 'popper'}>
					{items?.map((item) => {
						const option = isString(item)
							? { value: item, label: item, disabled: false }
							: item
						return (
							<SelectItem
								key={option.value}
								value={option.value}
								disabled={option.disabled}
							>
								{option.label}
							</SelectItem>
						)
					})}
					{groups?.map((group, index) => (
						<SelectGroup key={group.label ?? index}>
							{group.label && <SelectLabel>{group.label}</SelectLabel>}
							{group.options.map((item) => (
								<SelectItem
									key={item.value}
									value={item.value}
									disabled={item.disabled}
								>
									{item.label}
								</SelectItem>
							))}
							{group.separator && groups && index < groups.length - 1 && (
								<SelectSeparator />
							)}
						</SelectGroup>
					))}
				</SelectContent>
			</SelectRoot>
		</FieldWrapper>
	)
}

// SelectGroupped ---------------------------------------------------------------------------------]

export function SelectGroupped({
	groups = [],
	...props
}: Omit<SelectProps, 'items'> & { groups: SelectOptionGroup[] }) {
	return <Select groups={groups} {...props} />
}
