import { type TextStyledProps, TS } from '../text-styled'
import { Tooltip, type TooltipProps } from '../tooltip'
import { fullTime, fullTimeMonth, smartTime } from './smart-time'
import { cn } from '@/utils'

export type TimeDetailsProps = {
	prefix?: string
	suffix?: string
	timestamp: Parameters<typeof smartTime>[0]
	withTime?: boolean
	fullMonth?: boolean
	shortMonth?: boolean
	color?: TextStyledProps['color']
	tooltipSide?: TooltipProps['side']
	className?: string
}

export function TimeDetails({
	prefix,
	suffix,
	timestamp,
	withTime = true,
	fullMonth,
	shortMonth,
	color = 'secondary',
	tooltipSide = 'left',
	className,
}: TimeDetailsProps) {
	let content = fullMonth ? fullTimeMonth(timestamp, shortMonth, withTime) : fullTime(timestamp)
	content = prefix ? `${prefix} ${content}` : content
	content = suffix ? `${content} ${suffix}` : content
	return (
		<Tooltip content={content} side={tooltipSide}>
			<TS
				variant="caption"
				color={color}
				content={smartTime(timestamp, withTime)}
				nowrap
				className={cn('shrink-0 text-[11px] tabular-nums opacity-80', className)}
			/>
		</Tooltip>
	)
}
