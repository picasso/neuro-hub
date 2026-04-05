import { Stack } from '../stack'
import { TS } from '../text-styled'
import { Tooltip } from '../tooltip'
import { fullTime, smartTime } from './smart-time'
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
	withTail?: boolean
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
	theme = 'green',
	withTail = true,
	className,
}: MessageProps) {
	const isOut = direction === 'out'
	const bubbleClasses = isOut ? themeToClasses[theme] : inBubbleClassName
	const tailClasses = isOut ? themeToTailClasses[theme] : inTailClassName

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
						'relative isolate w-full rounded-lg border px-3 pb-1.5 pt-2 text-foreground shadow-xs',
						bubbleClasses,
						isOut ? 'rounded-br-none' : 'rounded-bl-none',
						withTail && tailClasses,
						withTail && tailClassName,
						withTail && tailDirection[direction],
						withTail && tailShadowClassName,
						withTail && tailShadowDirection[direction],
					)}
				>
					<TS
						variant="body"
						content={text}
						className="relative z-2 text-[15px] leading-snug"
					/>
					<Stack
						direction="row"
						gap={1}
						align="center"
						justify="flex-end"
						className="relative z-2 mt-1"
					>
						<Tooltip content={fullTime(timestamp)} side="left">
							<TS
								variant="caption"
								color="secondary"
								content={smartTime(timestamp)}
								className="text-[11px] tabular-nums opacity-80"
							/>
						</Tooltip>
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

const themeToTailClasses: Record<NonNullable<MessageProps['theme']>, string> = {
	green: 'before:bg-chat-1 before:border-chat-1-border',
	blue: 'before:bg-chat-2 before:border-chat-2-border',
	purple: 'before:bg-chat-3 before:border-chat-3-border',
	yellow: 'before:bg-chat-4 before:border-chat-4-border',
	cyan: 'before:bg-chat-5 before:border-chat-5-border',
} as const

const tailClassName =
	'before:absolute before:z-1 before:-bottom-0.5 before:size-2 before:rounded-[2px]' +
	' before:border-b' +
	" before:content-['']"

const tailDirection: Record<'in' | 'out', string> = {
	in: 'before:-left-0.5 before:border-l before:transform-[rotate(-45deg)_skewX(-45deg)]',
	out: 'before:-right-0.5 before:border-r before:transform-[rotate(45deg)_skewX(45deg)]',
}

const tailShadowClassName =
	'after:absolute after:z-0 after:h-[7px] after:w-px after:bg-black/12 after:blur-[1px]' +
	" after:-bottom-2 after:content-['']"

const tailShadowDirection: Record<'in' | 'out', string> = {
	in: 'after:left-[2px] after:transform-[rotate(45deg)]',
	out: 'after:right-[2px] after:transform-[rotate(-45deg)]',
}

const inBubbleClassName = 'bg-card border-accent-dark'
const inTailClassName = 'before:bg-card before:border-accent-dark'
