'use client'

import { useId, type ReactNode } from 'react'
import { Checkbox as ShadcnCheckbox } from './shadcn/checkbox'
import { Field, FieldDescription, FieldError, FieldLabel } from './shadcn/field'
import { cn } from '@/lib/utils'
import { type MarkdownParams, simpleMarkdown } from '@/utils'

// types ------------------------------------------------------------------------------------------]

export type CheckboxProps = {
	label?: ReactNode
	helperText?: ReactNode
	error?: string
	required?: boolean
	checked?: boolean
	onCheckedChange?: (checked: boolean) => void
	md?: Partial<MarkdownParams> | false
} & Omit<React.ComponentPropsWithoutRef<typeof ShadcnCheckbox>, 'onCheckedChange' | 'checked'>

// Checkbox ---------------------------------------------------------------------------------------]

export function Checkbox({
	id: providedId,
	label,
	helperText,
	error,
	required,
	checked,
	onCheckedChange,
	disabled,
	md,
	...props
}: CheckboxProps) {
	const generatedId = useId()
	const id = providedId ?? generatedId

	return (
		<Field
			data-disabled={disabled}
			data-invalid={!!error}
			className={cn('gap-1.5', md !== false && 'markdown-root')}
		>
			<div className="flex items-center gap-2">
				<ShadcnCheckbox
					id={id}
					checked={checked}
					onCheckedChange={onCheckedChange}
					disabled={disabled}
					aria-invalid={!!error}
					aria-required={required}
					{...props}
				/>
				{label && (
					<FieldLabel htmlFor={id}>
						{label}
						{required && <span className="text-destructive -ml-1">*</span>}
					</FieldLabel>
				)}
			</div>
			{!error && helperText && (
				<FieldDescription>
					{md === false ? helperText : simpleMarkdown(helperText, { br: true, ...md })}
				</FieldDescription>
			)}
			{error && <FieldError>{error}</FieldError>}
		</Field>
	)
}
