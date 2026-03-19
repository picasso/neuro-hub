import { isNumber } from 'lodash'
import { forwardRef } from 'react'
import { getIcon, type IconName } from './assets'
import { type IconColor, iconColorClasses } from './types'
import { cn } from '@/utils'

export type { IconName }
export type { IconColor } from './types'

// size presets (pixels) --------------------------------------------------------------------------]

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

const sizePresets: Record<IconSize, number> = {
	xs: 14,
	sm: 16,
	md: 20,
	lg: 24,
	xl: 32,
}

// icon component

export type IconProps = React.ComponentProps<ReturnType<typeof getIcon>> & {
	name: IconName
	size?: IconSize | number
	color?: IconColor
	spinning?: boolean
	accent?: string
}

export type IconOptions = {
	color?: IconProps['color']
	size?: IconProps['size']
	spinning?: IconProps['spinning']
	tw?: IconProps['className']
	accent?: IconProps['accent']
}

export const Icon = forwardRef<SVGSVGElement, IconProps>(function Icon(
	{ name, size = 'md', color = 'secondary', spinning, className, accent, ...props },
	ref,
) {
	const IconComponent = getIcon(name)
	const sizeValue = isNumber(size) ? size : sizePresets[size]

	return (
		<IconComponent
			ref={ref}
			width={sizeValue}
			height={sizeValue}
			className={cn(
				'shrink-0',
				color && iconColorClasses[color],
				spinning && 'animate-spin',
				className,
			)}
			style={isNumber(size) ? { width: sizeValue, height: sizeValue } : undefined}
			{...props}
			{...(accentSupports.includes(name) ? { accent } : {})}
		/>
	)
})

const accentSupports: IconName[] = ['missing', 'missingMore', 'nobody']
