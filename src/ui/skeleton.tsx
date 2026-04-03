import { isArray, map } from 'lodash'
import { Skeleton as ShadcnSkeleton } from './shadcn/skeleton'
import { Stack } from './stack'
import { maxWClasses, type MaxW } from './types'
import type { ComponentProps } from 'react'
import { cn } from '@/utils'

type ShadcnSkeletonProps = ComponentProps<typeof ShadcnSkeleton>

type Shape = 'none' | 'text' | 'card' | 'avatar' | 'table' | 'form' | 'chat'

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
	chat: ['w-full flex-col items-start', 2],
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
	chat: [
		'h-8 w-40 rounded-lg rounded-bl-none opacity-40',
		'h-4 w-32 rounded-lg rounded-br-none self-end',
		'h-12 w-44 rounded-lg rounded-bl-none opacity-40',
		'h-8 w-24 rounded-lg rounded-br-none self-end',
		'h-4 w-12 rounded-lg rounded-br-none self-end',
	],
}

// how shape presets work:
// 1. `baseClasses[shape]` configures the outer `Stack` rendered by `Skeleton`
//    - tuple format: [containerClassName, gap]
//    - `containerClassName` controls layout of the whole preset, for example:
//      `w-full`, `flex-col`, `items-start`, card chrome like `border rounded-lg p-6`
//    - `gap` is passed to `Stack` and sets spacing between top-level items from `shapes[shape]`
// 2. `shapes[shape]` describes the visual composition itself
//    - each array entry becomes one top-level item inside the outer `Stack`
//    - item type `string` means "render one `<ShadcnSkeleton />` with these classes"
//    - item type `string[]` means "render a wrapper `<div className={item[0]}>`, then render
//      one `<ShadcnSkeleton />` for every next string in the array"
// 3. runtime rendering logic:
//    - `'h-4 w-full'` -> `<ShadcnSkeleton className="h-4 w-full" />`
//    - `['flex flex-col gap-2 w-full', 'h-4 w-full', 'h-4 w-3/4']` ->
//      wrapper `<div className="flex flex-col gap-2 w-full">`
//      with two inner skeleton lines inside it
// 4. important detail: widths such as `w-full`, `w-3/4`, `w-24`, `flex-1` belong to the
//    inner skeleton blocks or local wrappers, while `maxW` is applied on the outer `Stack`
//    through `maxWClasses[maxW]`
//
// how to read existing presets:
// - `text`: three standalone lines, last one shorter for natural paragraph rhythm
// - `card`: two grouped rows
//   - first group = title and subtitle stacked vertically
//   - second group = media area with `aspect-video w-full`
// - `form`: repeated field groups (`label + input`), then one standalone submit button aligned
//   with `self-end`
// - `table`: each group is one row with a flexible first column and two fixed-width columns
// - `avatar`: first item is a circular avatar block, second item is a grouped text column
// - `chat`: several standalone bubbles; `self-end` pushes outgoing bubbles to the right,
//   and mixed corner radius classes imitate message tails
//
// prefer building the preset from simple utility classes:
//    - size: `h-*`, `w-*`, `aspect-*`, `size-*`
//    - layout: `flex`, `grid`, `gap-*`, `flex-1`, `self-end`
//    - shape: `rounded-*`
//    - emphasis: `opacity-*`
