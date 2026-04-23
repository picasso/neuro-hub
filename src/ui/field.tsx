'use client'

import { has } from 'lodash'
import { type Ref, type ComponentProps } from 'react'
import {
	Field,
	type FieldContent,
	FieldDescription,
	FieldError,
	FieldLabel,
	type FieldTitle,
	type FieldGroup,
	type FieldLegend,
	type FieldSeparator,
	type FieldSet,
} from './shadcn/field'
import { cn, simpleMarkdown, type MarkdownParams } from '@/utils'

// types ------------------------------------------------------------------------------------------]

// eslint-disable-next-line @typescript-eslint/no-namespace
export declare namespace FieldProps {
	type Root = ComponentProps<typeof Field>
	type Description = ComponentProps<typeof FieldDescription>
	type Error = ComponentProps<typeof FieldError>
	type Label = ComponentProps<typeof FieldLabel>
	type Group = ComponentProps<typeof FieldGroup>
	type Legend = ComponentProps<typeof FieldLegend>
	type Separator = ComponentProps<typeof FieldSeparator>
	type Set = ComponentProps<typeof FieldSet>
	type Content = ComponentProps<typeof FieldContent>
	type Title = ComponentProps<typeof FieldTitle>
}

type FieldHelper = {
	helper: FieldProps.Description['children']
	md?: Partial<MarkdownParams> | false
}

export type FieldWrapperProps = FieldProps.Root & {
	horizontal?: boolean
	label?: FieldProps.Label['children']
	htmlFor?: FieldProps.Label['htmlFor']
	helper?: FieldProps.Description['children'] | FieldHelper
	error?: FieldProps.Error['children']
	required?: boolean
	disabled?: boolean
	horizontalClassName?: string
	labelClassName?: string
	helperClassName?: string
	ref?: Ref<HTMLDivElement>
}

// field wrapper ----------------------------------------------------------------------------------]

export function FieldWrapper({
	horizontal,
	label,
	htmlFor,
	error,
	helper,
	disabled,
	required,
	className,
	children,
	horizontalClassName,
	labelClassName,
	helperClassName,
	ref,
}: FieldWrapperProps) {
	const isHelper = isFieldHelper(helper)
	const { helper: helperText, md: helperMd }: FieldHelper = isHelper
		? { helper: helper.helper, md: helper.md === false ? false : { br: true, ...helper.md } }
		: { helper, md: { br: true } }

	const filedLabel = (
		<FieldLabel htmlFor={htmlFor} className={labelClassName}>
			{label}
			{required && <span className="text-destructive -ml-1">*</span>}
		</FieldLabel>
	)

	return (
		<Field
			ref={ref}
			data-disabled={disabled}
			data-invalid={!!error}
			className={cn('gap-1.5', helperMd !== false && 'markdown-root', className)}
		>
			{horizontal && (
				<div className={cn('flex items-center gap-2', horizontalClassName)}>
					{children}
					{label && filedLabel}
				</div>
			)}
			{!horizontal && (
				<>
					{label && filedLabel}
					{children}
				</>
			)}
			{error && <FieldError>{error}</FieldError>}
			{!error && helperText && (
				<FieldDescription className={helperClassName}>
					{helperMd === false ? helperText : simpleMarkdown(helperText, helperMd)}
				</FieldDescription>
			)}
		</Field>
	)
}

function isFieldHelper(helper: FieldWrapperProps['helper']): helper is FieldHelper {
	return has(helper, 'helper')
}
