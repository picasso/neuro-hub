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
	rows = 2,
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
		<TS
			variant="caption"
			color="dimmed"
			content={`${value.length} / ${maxLength ?? 2000}`}
			className="-mt-0.5 text-[11px] text-dimmed/50"
		/>
	) : undefined

	return (
		<form onSubmit={onFormSubmit} className={cn('p-1', className)}>
			<Stack vertical gap={3} align="stretch">
				<TextField
					light
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
						variant="outline"
						size="xs"
						leftIcon={isSubmitting ? 'loader-circle' : 'send'}
						iconOptions={{ size: 'xs', spinning: isSubmitting }}
						disabled={disabled || isSubmitting || !value.trim()}
						label={isSubmitting ? 'Sending…' : 'Send'}
						className="bg-background"
					/>
				</Stack>
			</Stack>
		</form>
	)
}
