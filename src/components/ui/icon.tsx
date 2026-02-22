import { isNumber } from 'lodash'
import { forwardRef } from 'react'
import { getIcon, type IconName } from './assets'
import { cn } from '@/lib/utils'

export type { IconName }

// size presets (pixels) --------------------------------------------------------------------------]

type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

const sizePresets: Record<IconSize, number> = {
	xs: 14,
	sm: 16,
	md: 20,
	lg: 24,
	xl: 32,
}

// color presets (tailwind classes) ---------------------------------------------------------------]

type IconColor =
	| 'primary'
	| 'cta'
	| 'muted'
	| 'dimmed'
	| 'destructive'
	| 'success'
	| 'warning'
	| 'info'

const colorPresets: Record<IconColor, string> = {
	primary: 'text-primary',
	cta: 'text-cta',
	muted: 'text-muted-foreground',
	dimmed: 'text-dimmed',
	destructive: 'text-destructive',
	success: 'text-primary',
	warning: 'text-amber-500',
	info: 'text-blue-500',
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
	/** @deprecated will be removed after Button migration (Phase 4) */
	spacing?: number | string
	color?: IconProps['color']
	size?: IconProps['size']
	/** @deprecated will be removed after Button migration (Phase 4) */
	animation?: string
	spinning?: IconProps['spinning']
	tw?: IconProps['className']
	/** @deprecated will be removed after Button migration (Phase 4) */
	fontSize?: string
	/** @deprecated will be removed after Button migration (Phase 4) */
	limitLowerSize?: boolean
}

export const Icon = forwardRef<SVGSVGElement, IconProps>(function Icon(
	{ name, size = 'md', color, spinning, className, ...props },
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
