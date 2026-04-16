'use client'

import { Slider as SliderPrimitive } from 'radix-ui'
import { type ComponentProps } from 'react'
import { cn } from '@/utils'

type SliderProps = ComponentProps<typeof SliderPrimitive.Root> & {
	tint?: 'primary' | 'secondary' | 'accent' | 'destructive'
	trackClassName?: string
	thumbClassName?: string
	rangeClassName?: string
}

function Slider({
	className,
	defaultValue,
	value,
	min = 0,
	max = 100,
	tint = 'primary',
	trackClassName,
	thumbClassName,
	rangeClassName,
	...props
}: SliderProps) {
	const _values = Array.isArray(value)
		? value
		: Array.isArray(defaultValue)
			? defaultValue
			: [min, max]

	return (
		<SliderPrimitive.Root
			data-slot="slider"
			defaultValue={defaultValue}
			value={value}
			min={min}
			max={max}
			className={cn(
				'relative flex w-full touch-none items-center select-none data-disabled:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col',
				className,
			)}
			{...props}
		>
			<SliderPrimitive.Track
				data-slot="slider-track"
				className={cn(
					'bg-muted relative grow overflow-hidden rounded-full data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5',
					tint === 'primary' && 'bg-primary/20',
					tint === 'accent' && 'bg-accent-dark',
					tint === 'secondary' && 'bg-secondary',
					tint === 'destructive' && 'bg-destructive/20',
					trackClassName,
				)}
			>
				<SliderPrimitive.Range
					data-slot="slider-range"
					className={cn(
						'bg-primary absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full data-disabled:bg-dimmed/50',
						tint === 'destructive' && 'bg-destructive',
						tint === 'secondary' && 'bg-muted-foreground',
						rangeClassName,
					)}
				/>
			</SliderPrimitive.Track>
			{Array.from({ length: _values.length }, (_, index) => (
				<SliderPrimitive.Thumb
					data-slot="slider-thumb"
					key={index}
					className={cn(
						'border-primary ring-ring/50 block size-4 shrink-0 rounded-full border bg-white shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none data-disabled:border-dimmed/70 disabled:opacity-50 data-disabled:hover:ring-dimmed/30',
						tint === 'destructive' && 'border-destructive ring-destructive/30',
						tint === 'secondary' && 'border-muted-foreground ring-muted-foreground/30',
						thumbClassName,
					)}
				/>
			))}
		</SliderPrimitive.Root>
	)
}

export { Slider }
