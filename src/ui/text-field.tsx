'use client'

import { type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react'
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
	'label' | 'helper' | 'error' | 'required' | 'className'
> & {
	startIcon?: IconProps['name']
	endIcon?: IconProps['name']
	onEndClick?: () => void
}

type HTMLInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'required'>
type InputVariantProps = BaseProps & HTMLInputProps & { multiline?: false }
type HTMLTextareaProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'required'>
type TextareaVariantProps = BaseProps & HTMLTextareaProps & { multiline: true }

export type TextFieldProps = InputVariantProps | TextareaVariantProps

// input variant ----------------------------------------------------------------------------------]

function InputVariant({
	label,
	helper,
	error,
	required,
	startIcon,
	endIcon,
	onEndClick,
	className,
	multiline: _,
	...mainInputProps
}: InputVariantProps) {
	const { disabled } = mainInputProps
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
	const inputProps = { 'aria-invalid': !!error, required, ...mainInputProps }

	const control =
		iconButton && leftIcon ? (
			<ButtonGroup>
				<InputGroup className="flex-1">
					<InputGroupInput {...inputProps} />
					<InputGroupAddon align="inline-start">{leftIcon}</InputGroupAddon>
				</InputGroup>
				{iconButton}
			</ButtonGroup>
		) : iconButton ? (
			<ButtonGroup>
				<Input {...inputProps} />
				{iconButton}
			</ButtonGroup>
		) : leftIcon || rightIcon ? (
			<InputGroup>
				<InputGroupInput {...inputProps} />
				{leftIcon && <InputGroupAddon align="inline-start">{leftIcon}</InputGroupAddon>}
				{rightIcon && <InputGroupAddon align="inline-end">{rightIcon}</InputGroupAddon>}
			</InputGroup>
		) : (
			<Input {...inputProps} />
		)

	return (
		<FieldWrapper
			label={label}
			error={error}
			helper={helper}
			disabled={disabled}
			required={required}
			className={className}
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
	multiline: _,
	onEndClick: __,
	...textareaProps
}: TextareaVariantProps) {
	const { disabled } = textareaProps

	const control =
		startIcon || endIcon ? (
			<InputGroup>
				<InputGroupTextarea aria-invalid={!!error} required={required} {...textareaProps} />
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
			<Textarea aria-invalid={!!error} required={required} {...textareaProps} />
		)

	return (
		<FieldWrapper
			label={label}
			error={error}
			helper={helper}
			disabled={disabled}
			required={required}
			className={className}
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
