'use client'

import { useState, type ReactNode } from 'react'
import {
	Combobox as ComboboxRoot,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxInput,
	ComboboxItem,
	ComboboxList,
} from './shadcn/combobox'
import { Field, FieldDescription, FieldError, FieldLabel } from './shadcn/field'
import { cn } from '@/lib/utils'
import { simpleMarkdown, type MarkdownParams } from '@/utils'

// types ------------------------------------------------------------------------------------------]

type ComboboxOption = { value: string; label: string }

export type ComboboxProps = {
	options: ComboboxOption[]
	value?: string
	onValueChange?: (value: string) => void
	label?: ReactNode
	helperText?: ReactNode
	error?: string
	placeholder?: string
	disabled?: boolean
	freeSolo?: boolean
	required?: boolean
	md?: Partial<MarkdownParams> | false
}

// Combobox ---------------------------------------------------------------------------------------]

export function Combobox({
	options,
	value,
	onValueChange,
	label,
	helperText,
	error,
	placeholder,
	disabled = false,
	freeSolo = false,
	required,
	md,
}: ComboboxProps) {
	const [inputValue, setInputValue] = useState('')

	const selectedOption = options.find((opt) => opt.value === value) ?? null

	const filteredOptions = options.filter(
		(opt) => !inputValue || opt.label.toLowerCase().includes(inputValue.toLowerCase()),
	)

	function handleValueChange(opt: ComboboxOption | null) {
		onValueChange?.(opt?.value ?? '')
	}

	function handleInputValueChange(val: string) {
		setInputValue(val)
		if (freeSolo) onValueChange?.(val)
	}

	return (
		<Field
			data-disabled={disabled}
			data-invalid={!!error}
			className={cn('gap-1.5', md !== false && 'markdown-root')}
		>
			{label && (
				<FieldLabel>
					{label}
					{required && <span className="text-destructive -ml-1">*</span>}
				</FieldLabel>
			)}
			<ComboboxRoot
				items={filteredOptions}
				itemToStringValue={(opt) => opt.label}
				value={selectedOption}
				onValueChange={handleValueChange}
				onInputValueChange={handleInputValueChange}
				disabled={disabled}
			>
				<ComboboxInput
					placeholder={placeholder}
					disabled={disabled}
					aria-invalid={!!error}
				/>
				<ComboboxContent>
					<ComboboxEmpty>Ничего не найдено</ComboboxEmpty>
					<ComboboxList>
						{filteredOptions.map((option) => (
							<ComboboxItem key={option.value} value={option}>
								{option.label}
							</ComboboxItem>
						))}
					</ComboboxList>
				</ComboboxContent>
			</ComboboxRoot>
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
