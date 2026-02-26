import { isNumber } from 'lodash'
import { forwardRef } from 'react'
import { getIcon, type IconName } from './assets'
import { cn } from '@/lib/utils'

export type { IconName }

// size presets (pixels) --------------------------------------------------------------------------]

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

const sizePresets: Record<IconSize, number> = {
	xs: 14,
	sm: 16,
	md: 20,
	lg: 24,
	xl: 32,
}

// color presets (tailwind classes) ---------------------------------------------------------------]

export type IconColor =
	| 'primary'
	| 'cta'
	| 'muted'
	| 'dimmed'
	| 'error'
	| 'success'
	| 'warning'
	| 'info'
	| 'contrast'

const colorPresets: Record<IconColor, string> = {
	primary: 'text-primary',
	cta: 'text-cta',
	muted: 'text-muted-foreground',
	dimmed: 'text-dimmed',
	error: 'text-destructive',
	success: 'text-green-500',
	warning: 'text-amber-500',
	info: 'text-blue-500',
	contrast: 'text-white',
}

// `Icon` component -------------------------------------------------------------------------------]

export type IconProps = {
	name: IconName
	size?: IconSize | number
	color?: IconColor
	spinning?: boolean
	className?: string
}

export type IconOptions = {
	color?: IconProps['color']
	size?: IconProps['size']
	spinning?: IconProps['spinning']
	tw?: IconProps['className']
}

export const Icon = forwardRef<SVGSVGElement, IconProps>(function Icon(
	{ name, size = 'md', color = 'muted', spinning, className, ...props },
	ref,
) {
	const IconComponent = getIcon(name)
	const sizeValue = isNumber(size) ? size : sizePresets[size]

	return (
		<IconComponent
			ref={ref}
			width={sizeValue}
			height={sizeValue}
			className={cn(color && colorPresets[color], spinning && 'animate-spin', className)}
			{...props}
		/>
	)
})
