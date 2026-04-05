import {
	TooltipContent,
	TooltipTrigger,
	Tooltip as TooltipRoot,
	type TooltipContentProps,
	type TooltipRootProps,
} from './shadcn/tooltip'

export type TooltipProps = {
	delayDuration?: TooltipRootProps['delayDuration']
	side?: TooltipContentProps['side']
	sideOffset?: TooltipContentProps['sideOffset']
	content?: string | null
	onDisabled?: boolean
	children: TooltipContentProps['children']
	className?: string
}

export function Tooltip({
	delayDuration,
	side,
	sideOffset,
	content,
	onDisabled,
	children,
	className,
}: TooltipProps) {
	if (!content) return children
	return (
		<TooltipRoot delayDuration={delayDuration}>
			<TooltipTrigger asChild>
				{onDisabled ? <span className="inline-block w-fit">{children}</span> : children}
			</TooltipTrigger>
			<TooltipContent side={side} sideOffset={sideOffset} className={className}>
				{content}
			</TooltipContent>
		</TooltipRoot>
	)
}
