import { Icon, type IconName } from '../icon'
import { Tooltip, TooltipContent, TooltipTrigger } from '../shadcn/tooltip'
import { cn } from '@/utils'

export type DeliveryStatus = 'sent' | 'sending' | 'failed' | 'loading' | 'read'

export type StatusProps = {
	status: DeliveryStatus
	tooltip?: string
	className?: string
}

function StatusGlyph({ status, className }: { status: DeliveryStatus; className?: string }) {
	return (
		<Icon
			name={glyphs[status]}
			size="xs"
			color={status === 'read' ? 'success' : status === 'failed' ? 'error' : 'secondary'}
			spinning={status === 'loading'}
			pinging={status === 'sending'}
			className={cn('opacity-90', className)}
		/>
	)
}

export function Status({ status, tooltip, className }: StatusProps) {
	const Comp = tooltip ? 'button' : 'span'
	const glyph = (
		<Comp
			className={cn(
				'inline-flex shrink-0 items-center justify-center ml-1 mt-0.5',
				tooltip && 'rounded-sm border-0 bg-transparent p-0',
			)}
			aria-label={tooltip ?? labels[status]}
			role={tooltip ? undefined : 'img'}
		>
			<StatusGlyph status={status} className={className} />
		</Comp>
	)

	return tooltip ? (
		<Tooltip delayDuration={300}>
			<TooltipTrigger asChild>{glyph}</TooltipTrigger>
			<TooltipContent side="top" className="max-w-xs">
				{tooltip}
			</TooltipContent>
		</Tooltip>
	) : (
		glyph
	)
}

const glyphs: Record<DeliveryStatus, IconName> = {
	loading: 'loader-circle',
	sending: 'ellipsis',
	failed: 'x',
	sent: 'check',
	read: 'check-check',
} as const

const labels: Record<DeliveryStatus, string> = {
	loading: 'Loading',
	sending: 'Sending',
	failed: 'Failed to send',
	sent: 'Sent',
	read: 'Read',
}
