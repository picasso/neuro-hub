import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'

type StackDirection = 'row' | 'column' | 'row-reverse' | 'column-reverse'
type StackWrap = boolean | 'reverse'

type Align = 'flex-start' | 'start' | 'center' | 'flex-end' | 'end' | 'stretch' | 'baseline'

type Justify =
	| 'flex-start'
	| 'start'
	| 'center'
	| 'flex-end'
	| 'end'
	| 'space-between'
	| 'space-around'
	| 'space-evenly'

export type StackProps = {
	direction?: StackDirection // default: 'row'
	vertical?: boolean
	horizontal?: boolean // default: true
	gap?: number // supports integers 0..12 and halves *.5
	align?: Align // default: 'center'
	justify?: Justify // default: 'flex-start'
	wrap?: StackWrap
	className?: string
	children: ReactNode
}

const GAP_CLASS = new Map<number, string>([
	[0, 'gap-0'],
	[0.5, 'gap-0.5'],
	[1, 'gap-1'],
	[1.5, 'gap-1.5'],
	[2, 'gap-2'],
	[2.5, 'gap-2.5'],
	[3, 'gap-3'],
	[3.5, 'gap-3.5'],
	[4, 'gap-4'],
	[4.5, 'gap-4.5'],
	[5, 'gap-5'],
	[5.5, 'gap-5.5'],
	[6, 'gap-6'],
	[6.5, 'gap-6.5'],
	[7, 'gap-7'],
	[7.5, 'gap-7.5'],
	[8, 'gap-8'],
	[8.5, 'gap-8.5'],
	[9, 'gap-9'],
	[9.5, 'gap-9.5'],
	[10, 'gap-10'],
	[10.5, 'gap-10.5'],
	[11, 'gap-11'],
	[11.5, 'gap-11.5'],
	[12, 'gap-12'],
])

const DIRECTION_CLASS: Record<StackDirection, string> = {
	row: 'flex-row',
	column: 'flex-col',
	'row-reverse': 'flex-row-reverse',
	'column-reverse': 'flex-col-reverse',
}

const ALIGN_CLASS: Record<Align, string> = {
	'flex-start': 'items-start',
	start: 'items-start',
	center: 'items-center',
	'flex-end': 'items-end',
	end: 'items-end',
	stretch: 'items-stretch',
	baseline: 'items-baseline',
}

const JUSTIFY_CLASS: Record<Justify, string> = {
	'flex-start': 'justify-start',
	start: 'justify-start',
	center: 'justify-center',
	'flex-end': 'justify-end',
	end: 'justify-end',
	'space-between': 'justify-between',
	'space-around': 'justify-around',
	'space-evenly': 'justify-evenly',
}

function isValidGap(value: number): boolean {
	if (!Number.isFinite(value)) return false
	if (value < 0 || value > 12) return false
	return Number.isInteger(value * 2)
}

function resolveDirection({
	direction,
	vertical,
	horizontal,
}: Pick<StackProps, 'direction' | 'vertical' | 'horizontal'>): StackDirection {
	if (direction) return direction
	if (vertical) return 'column'
	if (horizontal === true || horizontal === undefined) return 'row'
	return 'row'
}

function resolveWrap(wrap: StackWrap | undefined): string | undefined {
	if (wrap === 'reverse') return 'flex-wrap-reverse'
	if (wrap === true) return 'flex-wrap'
	return undefined
}

export function Stack({
	direction,
	vertical,
	horizontal = true,
	gap = 2,
	align = 'center',
	justify = 'flex-start',
	wrap,
	className,
	children,
}: StackProps) {
	const resolvedDirection = resolveDirection({ direction, vertical, horizontal })
	const resolvedGapClass = isValidGap(gap) ? GAP_CLASS.get(gap) : undefined

	return (
		<div
			className={cn(
				'flex',
				DIRECTION_CLASS[resolvedDirection],
				resolvedGapClass,
				ALIGN_CLASS[align],
				JUSTIFY_CLASS[justify],
				resolveWrap(wrap),
				className,
			)}
		>
			{children}
		</div>
	)
}
