import { Stack } from '../stack'
import { TS } from '../text-styled'
import { Status } from './status'
import { cn } from '@/utils'

export type MessageProps = {
	direction: 'in' | 'out'
	text: string
	timestamp: string
	author?: string
	read?: boolean
	reaction?: unknown
	link?: unknown
	file?: unknown
	// outgoing only: pipeline state for first slice demos
	delivery?: 'sending' | 'sent' | 'failed'
	theme?: 'green' | 'blue' | 'purple' | 'yellow' | 'cyan'
	className?: string
}

export function Message({
	direction,
	text,
	timestamp,
	author: _author,
	reaction: _reaction,
	link: _link,
	file: _file,
	read,
	delivery,
	theme,
	className,
}: MessageProps) {
	const isOut = direction === 'out'

	return (
		<Stack
			direction="row"
			justify={isOut ? 'flex-end' : 'flex-start'}
			className={cn('w-full min-w-0', className)}
		>
			<Stack
				vertical
				gap={0}
				align={isOut ? 'end' : 'start'}
				className="min-w-0 max-w-[min(100%,28rem)]"
				data-slot="chat-message"
			>
				<div
					className={cn(
						'w-full px-3 pb-1.5 pt-2 shadow-xs rounded-lg border text-foreground',
						isOut && themeToClasses[theme ?? 'green'],
						isOut ? 'rounded-br-none' : 'rounded-bl-none border-accent-dark bg-card',
					)}
				>
					<TS variant="body" content={text} className="text-[15px] leading-snug" />
					<Stack
						direction="row"
						gap={1}
						align="center"
						justify="flex-end"
						className="mt-1"
					>
						<TS
							variant="caption"
							color="secondary"
							content={timestamp}
							className="text-[11px] tabular-nums opacity-80"
						/>
						{isOut && <Status status={read ? 'read' : (delivery ?? 'sent')} />}
					</Stack>
				</div>
			</Stack>
		</Stack>
	)
}

const themeToClasses: Record<NonNullable<MessageProps['theme']>, string> = {
	green: 'bg-chat-1 border-chat-1-border',
	blue: 'bg-chat-2 border-chat-2-border',
	purple: 'bg-chat-3 border-chat-3-border',
	yellow: 'bg-chat-4 border-chat-4-border',
	cyan: 'bg-chat-5 border-chat-5-border',
} as const
