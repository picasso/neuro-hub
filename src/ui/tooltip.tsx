import {
	TooltipContent,
	TooltipTrigger,
	Tooltip as TooltipRoot,
	type TooltipContentProps,
	type TooltipRootProps,
} from './shadcn/tooltip'
import { simpleMarkdown, type MarkdownParams } from '@/utils'

export type TooltipProps = {
	delayDuration?: TooltipRootProps['delayDuration']
	side?: TooltipContentProps['side']
	sideOffset?: TooltipContentProps['sideOffset']
	content?: string | null
	md?: Partial<MarkdownParams> | false
	onDisabled?: boolean
	children: TooltipContentProps['children']
	className?: string
}

export function Tooltip({
	delayDuration,
	side,
	sideOffset,
	content,
	md,
	onDisabled,
	children,
	className,
}: TooltipProps) {
	if (!content) return children
	const value = md === false ? content : simpleMarkdown(content, md ?? { br: true })
	return (
		<TooltipRoot delayDuration={delayDuration}>
			<TooltipTrigger asChild>
				{onDisabled ? <span className="inline-block w-fit">{children}</span> : children}
			</TooltipTrigger>
			<TooltipContent side={side} sideOffset={sideOffset} className={className}>
				{value}
			</TooltipContent>
		</TooltipRoot>
	)
}
