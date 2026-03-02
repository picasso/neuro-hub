'use client'

import { type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from 'react'
import { Icon, type IconProps } from './icon'
import { IconButton } from './icon-button'
import { ButtonGroup } from './shadcn/button-group'
import { Field, FieldDescription, FieldError, FieldLabel } from './shadcn/field'
import { Input } from './shadcn/input'
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
	InputGroupTextarea,
} from './shadcn/input-group'
import { Textarea } from './shadcn/textarea'
import { cn } from '@/lib/utils'
import { simpleMarkdown, type MarkdownParams } from '@/utils'

// types ------------------------------------------------------------------------------------------]

type BaseProps = {
	label?: ReactNode
	helperText?: ReactNode
	error?: string
	required?: boolean
	startIcon?: IconProps['name']
	endIcon?: IconProps['name']
	onEndClick?: () => void
	className?: string
	md?: Partial<MarkdownParams> | false
}

type HTMLInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'required'>
type InputVariantProps = BaseProps & HTMLInputProps & { multiline?: false }
type HTMLTextareaProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'required'>
type TextareaVariantProps = BaseProps & HTMLTextareaProps & { multiline: true }

export type TextFieldProps = InputVariantProps | TextareaVariantProps

// field wrapper ----------------------------------------------------------------------------------]

type FieldWrapperProps = Omit<BaseProps, 'startIcon' | 'endIcon' | 'onEndClick'> & {
	disabled?: boolean
	children: ReactNode
}

function FieldWrapper({
	label,
	error,
	helperText,
	disabled,
	required,
	className,
	children,
	md,
}: FieldWrapperProps) {
	return (
		<Field
			data-disabled={disabled}
			data-invalid={!!error}
			className={cn('gap-1.5', md !== false && 'markdown-root', className)}
		>
			{label && (
				<FieldLabel>
					{label}
					{required && <span className="text-destructive -ml-1">*</span>}
				</FieldLabel>
			)}
			{children}
			{error ? (
				<FieldError>{error}</FieldError>
			) : (
				helperText && (
					<FieldDescription>
						{md === false
							? helperText
							: simpleMarkdown(helperText, { br: true, ...md })}
					</FieldDescription>
				)
			)}
		</Field>
	)
}

// input variant ----------------------------------------------------------------------------------]

function InputVariant({
	label,
	helperText,
	error,
	required,
	startIcon,
	endIcon,
	onEndClick,
	className,
	md,
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
				size="sm"
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
			helperText={helperText}
			md={md}
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
	helperText,
	error,
	required,
	startIcon,
	endIcon,
	className,
	md,
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
			helperText={helperText}
			md={md}
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
