import { isArray, map } from 'lodash'
import { Skeleton as ShadcnSkeleton } from './shadcn/skeleton'
import { Stack } from './stack'
import type { ComponentProps } from 'react'
import { cn } from '@/utils'

type ShadcnSkeletonProps = ComponentProps<typeof ShadcnSkeleton>

type Shape = 'none' | 'text' | 'card' | 'avatar' | 'table' | 'form'

export type SkeletonProps = ShadcnSkeletonProps & {
	shape?: Shape
	clean?: boolean
	filler?: string
	maxW?:
		| 'xs'
		| 'sm'
		| 'md'
		| 'lg'
		| 'xl'
		| '2xl'
		| '3xl'
		| '4xl'
		| '5xl'
		| '6xl'
		| '7xl'
		| '8xl'
		| '9xl'
		| '10xl'
}

export function Skeleton({ shape = 'none', maxW, clean, filler, ...props }: SkeletonProps) {
	if (shape === 'none') return <ShadcnSkeleton {...props} />
	const { className, ...rest } = props
	const [baseClass, gap] = baseClasses[shape]
	const items = shapes[shape]
	return (
		<Stack
			gap={gap}
			className={cn(baseClass, maxWClasses[maxW ?? 'none'], !clean && 'my-6', className)}
		>
			{map(items, (skItem, itemIndex) =>
				isArray(skItem) ? (
					<div key={itemIndex} className={skItem[0]}>
						{map(skItem.slice(1), (item, index) => (
							<ShadcnSkeleton key={index} className={item} {...rest} />
						))}
					</div>
				) : (
					<ShadcnSkeleton key={itemIndex} className={skItem} {...rest} />
				),
			)}
			{filler && <div className={filler} />}
		</Stack>
	)
}

const baseClasses: Record<Shape, [string, number]> = {
	none: ['', 0],
	text: ['w-full flex-col items-start', 2],
	card: ['w-full flex-col border rounded-lg p-6', 6],
	form: ['w-full flex-col items-start', 4],
	table: ['w-full flex-col items-start', 2],
	avatar: ['w-full', 4],
}

const shapes: Record<Shape, Array<string | string[]>> = {
	none: [],
	text: ['h-4 w-full', 'h-4 w-full', 'h-4 w-3/4'],
	card: [
		['flex flex-col gap-2 w-full', 'h-4 w-full', 'h-4 w-3/4'],
		['flex flex-col w-full', 'aspect-video w-full'],
	],
	form: [
		['flex flex-col gap-3 w-full', 'h-4 w-24', 'h-8 w-full'],
		['flex flex-col gap-3 w-full', 'h-4 w-24', 'h-8 w-full'],
		['flex flex-row gap-3 w-full', 'h-4 w-6', 'h-4 w-3/4'],
		'h-8 w-32 self-end',
	],
	table: [
		['flex gap-4 w-full', 'h-4 flex-1', 'h-4 w-24', 'h-4 w-20'],
		['flex gap-4 w-full', 'h-4 flex-1', 'h-4 w-24', 'h-4 w-20'],
		['flex gap-4 w-full', 'h-4 flex-1', 'h-4 w-24', 'h-4 w-20'],
		['flex gap-4 w-full', 'h-4 flex-1', 'h-4 w-24', 'h-4 w-20'],
		['flex gap-4 w-full', 'h-4 flex-1', 'h-4 w-24', 'h-4 w-20'],
	],
	avatar: ['size-10 shrink-0 rounded-full', ['grid gap-2 flex-1', 'h-4 w-full', 'h-4 w-3/4']],
}

const maxWClasses: Record<NonNullable<SkeletonProps['maxW']> | 'none', string> = {
	none: '',
	xs: 'max-w-xs',
	sm: 'max-w-sm',
	md: 'max-w-md',
	lg: 'max-w-lg',
	xl: 'max-w-xl',
	'2xl': 'max-w-2xl',
	'3xl': 'max-w-3xl',
	'4xl': 'max-w-4xl',
	'5xl': 'max-w-5xl',
	'6xl': 'max-w-6xl',
	'7xl': 'max-w-7xl',
	'8xl': 'max-w-8xl',
	'9xl': 'max-w-9xl',
	'10xl': 'max-w-10xl',
}
