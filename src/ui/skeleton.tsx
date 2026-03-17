import { isArray, map } from 'lodash'
import { Skeleton as ShadcnSkeleton } from './shadcn/skeleton'
import { Stack } from './stack'
import { maxWClasses, type MaxW } from './types'
import type { ComponentProps } from 'react'
import { cn } from '@/utils'

type ShadcnSkeletonProps = ComponentProps<typeof ShadcnSkeleton>

type Shape = 'none' | 'text' | 'card' | 'avatar' | 'table' | 'form'

export type SkeletonProps = ShadcnSkeletonProps & {
	shape?: Shape
	clean?: boolean
	filler?: string
	maxW?: MaxW
}

export function Skeleton({
	shape = 'none',
	maxW = 'none',
	clean,
	filler,
	...props
}: SkeletonProps) {
	if (shape === 'none') return <ShadcnSkeleton {...props} />
	const { className, ...rest } = props
	const [baseClass, gap] = baseClasses[shape]
	const items = shapes[shape]
	return (
		<Stack gap={gap} className={cn(baseClass, maxWClasses[maxW], !clean && 'my-6', className)}>
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
