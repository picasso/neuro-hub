'use client'

import { useId } from 'react'
import { FieldWrapper, type FieldWrapperProps } from './field'
import { Checkbox as ShadcnCheckbox } from './shadcn/checkbox'
import { Switch as ShadcnSwitch } from './shadcn/switch'

// types ------------------------------------------------------------------------------------------]

export type CheckboxProps = Pick<
	FieldWrapperProps,
	| 'horizontalClassName'
	| 'label'
	| 'labelClassName'
	| 'helper'
	| 'helperClassName'
	| 'error'
	| 'required'
> & {
	checked?: boolean
	onCheckedChange?: (checked: boolean) => void
} & Omit<React.ComponentPropsWithoutRef<typeof ShadcnCheckbox>, 'onCheckedChange' | 'checked'>

export type SwitchProps = Pick<
	FieldWrapperProps,
	| 'horizontalClassName'
	| 'label'
	| 'labelClassName'
	| 'helper'
	| 'helperClassName'
	| 'error'
	| 'required'
> & {
	checked?: boolean
	onCheckedChange?: (checked: boolean) => void
} & Omit<React.ComponentPropsWithoutRef<typeof ShadcnSwitch>, 'onCheckedChange' | 'checked'>

// Checkbox ---------------------------------------------------------------------------------------]

export function Checkbox({
	id: providedId,
	label,
	helper,
	error,
	required,
	checked,
	onCheckedChange,
	disabled,
	horizontalClassName,
	labelClassName,
	helperClassName,
	...props
}: CheckboxProps) {
	const generatedId = useId()
	const id = providedId ?? generatedId

	return (
		<FieldWrapper
			horizontal
			label={label}
			htmlFor={id}
			disabled={disabled}
			error={error}
			helper={helper}
			required={required}
			horizontalClassName={horizontalClassName}
			labelClassName={labelClassName}
			helperClassName={helperClassName}
		>
			<ShadcnCheckbox
				id={id}
				checked={checked}
				onCheckedChange={onCheckedChange}
				disabled={disabled}
				aria-invalid={!!error}
				aria-required={required}
				{...props}
			/>
		</FieldWrapper>
	)
}

// Switch -----------------------------------------------------------------------------------------]

export function Switch({
	id: providedId,
	label,
	helper,
	error,
	required,
	checked,
	onCheckedChange,
	disabled,
	horizontalClassName,
	labelClassName,
	helperClassName,
	...props
}: SwitchProps) {
	const generatedId = useId()
	const id = providedId ?? generatedId

	return (
		<FieldWrapper
			horizontal
			label={label}
			htmlFor={id}
			disabled={disabled}
			error={error}
			helper={helper}
			required={required}
			horizontalClassName={horizontalClassName}
			labelClassName={labelClassName}
			helperClassName={helperClassName}
		>
			<ShadcnSwitch
				id={id}
				checked={checked}
				onCheckedChange={onCheckedChange}
				disabled={disabled}
				aria-invalid={!!error}
				aria-required={required}
				{...props}
			/>
		</FieldWrapper>
	)
}
