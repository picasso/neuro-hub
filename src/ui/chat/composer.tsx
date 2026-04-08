import { useCallback, useState, type ComponentPropsWithoutRef, type ReactNode } from 'react'
import { Button } from '../button'
import { Stack } from '../stack'
import { TextField, type TextareaVariantProps } from '../text-field'
import { TS } from '../text-styled'
import { cn } from '@/utils'

export type ChatComposerProps = {
	label?: string
	onSubmit: (value: string) => void
	disabled?: boolean
	isSubmitting?: boolean
	maxLength?: number
	placeholder?: string
	actions?: ReactNode
	rows?: TextareaVariantProps['rows']
	counter?: boolean
	className?: string
}

type OnSubmit = NonNullable<ComponentPropsWithoutRef<'form'>['onSubmit']>

export function ChatComposer({
	label,
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
	const [draft, setDraft] = useState('')

	const onFormSubmit = useCallback<OnSubmit>(
		(e) => {
			e.preventDefault()
			if (!draft.trim() || disabled || isSubmitting) {
				return
			}
			onSubmit(draft)
			setDraft('')
		},
		[disabled, draft, isSubmitting, onSubmit],
	)

	const counter = withCounter ? (
		<TS
			variant="caption"
			color="dimmed"
			content={`${draft.length} / ${maxLength ?? 2000}`}
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
					value={draft}
					placeholder={placeholder}
					maxLength={maxLength}
					disabled={disabled || isSubmitting}
					onChange={(e) => setDraft(e.target.value)}
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
						disabled={disabled || isSubmitting || !draft.trim()}
						label={isSubmitting ? 'Sending…' : 'Send'}
						className="bg-background"
					/>
				</Stack>
			</Stack>
		</form>
	)
}
