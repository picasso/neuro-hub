'use client'

import { type ComponentPropsWithRef, type Ref } from 'react'
import { FieldWrapper, type FieldWrapperProps } from './field'
import { Icon, type IconProps } from './icon'
import { IconButton } from './icon-button'
import { ButtonGroup } from './shadcn/button-group'
import { Input } from './shadcn/input'
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
	InputGroupTextarea,
} from './shadcn/input-group'
import { Textarea } from './shadcn/textarea'

// types ------------------------------------------------------------------------------------------]

type BaseProps = Pick<
	FieldWrapperProps,
	'label' | 'labelClassName' | 'helper' | 'helperClassName' | 'error' | 'required' | 'className'
> & {
	startIcon?: IconProps['name']
	endIcon?: IconProps['name']
	showClear?: boolean
	onEndClick?: () => void
	onClearClick?: () => void
}

type HTMLInputProps = Omit<ComponentPropsWithRef<'input'>, 'required' | 'ref'>
type HTMLTextareaProps = Omit<ComponentPropsWithRef<'textarea'>, 'required' | 'ref'>
type InputVariantProps = BaseProps &
	HTMLInputProps & { multiline?: false; ref?: Ref<HTMLInputElement> }
type TextareaVariantProps = BaseProps &
	HTMLTextareaProps & { multiline: true; ref?: Ref<HTMLTextAreaElement> }

export type TextFieldProps = InputVariantProps | TextareaVariantProps

// input variant ----------------------------------------------------------------------------------]

function InputVariant({
	label,
	helper,
	error,
	required,
	startIcon,
	endIcon,
	showClear,
	onEndClick,
	onClearClick,
	className,
	labelClassName,
	helperClassName,
	multiline: _,
	ref,
	...mainInputProps
}: InputVariantProps) {
	const { disabled, value } = mainInputProps
	const hasClickableEnd = !!(endIcon && onEndClick)

	const iconButton =
		!hasClickableEnd || !endIcon ? null : (
			<IconButton
				icon={endIcon}
				variant="outline"
				onClick={onEndClick}
				type="button"
				className="shadow-none"
			/>
		)
	const leftIcon = startIcon ? <Icon name={startIcon} size="sm" /> : null
	const rightIcon = endIcon ? <Icon name={endIcon} size="sm" /> : null
	const clearIcon = showClear ? (
		<IconButton rounded icon="x" onClick={onClearClick} size="xs" data-clear={true} />
	) : null
	const wrapperData = { 'data-input': 'wrapper' }
	const elementData = { 'data-input': 'control' }
	const inputProps = { 'aria-invalid': !!error, required, ...mainInputProps }

	const control =
		iconButton && leftIcon ? (
			<ButtonGroup>
				<InputGroup className="flex-1" {...wrapperData}>
					<InputGroupInput ref={ref} {...elementData} {...inputProps} />
					<InputGroupAddon align="inline-start">{leftIcon}</InputGroupAddon>
				</InputGroup>
				{iconButton}
			</ButtonGroup>
		) : iconButton ? (
			<ButtonGroup>
				<Input ref={ref} {...wrapperData} {...elementData} {...inputProps} />
				{iconButton}
			</ButtonGroup>
		) : leftIcon || rightIcon || clearIcon ? (
			<InputGroup {...wrapperData}>
				<InputGroupInput ref={ref} {...elementData} {...inputProps} />
				{leftIcon && <InputGroupAddon align="inline-start">{leftIcon}</InputGroupAddon>}
				{rightIcon && <InputGroupAddon align="inline-end">{rightIcon}</InputGroupAddon>}
				{clearIcon && value && (
					<InputGroupAddon align="inline-end">{clearIcon}</InputGroupAddon>
				)}
			</InputGroup>
		) : (
			<Input ref={ref} {...wrapperData} {...elementData} {...inputProps} />
		)

	return (
		<FieldWrapper
			label={label}
			error={error}
			helper={helper}
			disabled={disabled}
			required={required}
			className={className}
			labelClassName={labelClassName}
			helperClassName={helperClassName}
		>
			{control}
		</FieldWrapper>
	)
}

// textarea variant -------------------------------------------------------------------------------]

function TextareaVariant({
	label,
	helper,
	error,
	required,
	startIcon,
	endIcon,
	className,
	labelClassName,
	helperClassName,
	multiline: _,
	onEndClick: __,
	ref,
	...textareaProps
}: TextareaVariantProps) {
	const { disabled } = textareaProps

	const control =
		startIcon || endIcon ? (
			<InputGroup>
				<InputGroupTextarea
					ref={ref}
					aria-invalid={!!error}
					required={required}
					{...textareaProps}
				/>
				{startIcon && (
					<InputGroupAddon align="inline-start">
						<Icon name={startIcon} size="sm" />
					</InputGroupAddon>
				)}
				{endIcon && (
					<InputGroupAddon align="inline-end">
						<Icon name={endIcon} size="sm" />
					</InputGroupAddon>
				)}
			</InputGroup>
		) : (
			<Textarea ref={ref} aria-invalid={!!error} required={required} {...textareaProps} />
		)

	return (
		<FieldWrapper
			label={label}
			error={error}
			helper={helper}
			disabled={disabled}
			required={required}
			className={className}
			labelClassName={labelClassName}
			helperClassName={helperClassName}
		>
			{control}
		</FieldWrapper>
	)
}

// TextField --------------------------------------------------------------------------------------]

export function TextField(props: TextFieldProps) {
	if (props.multiline) {
		return <TextareaVariant {...(props as TextareaVariantProps)} />
	}
	return <InputVariant {...(props as InputVariantProps)} />
}
