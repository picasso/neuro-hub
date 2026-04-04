import { type ComponentPropsWithoutRef, type ReactNode } from 'react'
import { Button } from '../button'
import { Stack } from '../stack'
import { TextField, type TextareaVariantProps } from '../text-field'
import { TS } from '../text-styled'
import { cn } from '@/utils'

export type ChatComposerProps = {
	value: string
	label?: string
	onChange: (value: string) => void
	onSubmit: () => void
	disabled?: boolean
	isSubmitting?: boolean
	maxLength?: number
	placeholder?: string
	actions?: ReactNode
	rows?: TextareaVariantProps['rows']
	counter?: boolean
	className?: string
}

export function ChatComposer({
	value,
	label,
	onChange,
	onSubmit,
	disabled,
	isSubmitting,
	maxLength,
	placeholder,
	actions,
	rows = 4,
	counter: withCounter,
	className,
}: ChatComposerProps) {
	const onFormSubmit: NonNullable<ComponentPropsWithoutRef<'form'>['onSubmit']> = (e) => {
		e.preventDefault()
		if (disabled || isSubmitting) {
			return
		}
		onSubmit()
	}

	const counter = withCounter ? (
		<TS variant="caption" color="dimmed" content={`${value.length} / ${maxLength ?? 2000}`} />
	) : undefined

	return (
		<form
			onSubmit={onFormSubmit}
			className={cn(
				'p-3',
				// 'border-t border-border/60 bg-background p-3',
				className,
			)}
		>
			<Stack vertical gap={3} align="stretch">
				<TextField
					multiline
					label={label}
					value={value}
					placeholder={placeholder}
					maxLength={maxLength}
					disabled={disabled || isSubmitting}
					onChange={(e) => onChange(e.target.value)}
					rows={rows}
				/>
				<Stack direction="row" gap={2} align="center" justify="space-between" wrap>
					<Stack className="min-w-0 flex-1 self-start -mt-2 ml-2">
						{counter}
						{actions}
					</Stack>
					<Button
						type="submit"
						variant="default"
						size="sm"
						disabled={disabled || isSubmitting || !value.trim()}
						label={isSubmitting ? 'Sending…' : 'Send'}
					/>
				</Stack>
			</Stack>
		</form>
	)
}
