import { includes } from 'lodash'
import { forwardRef, type ReactNode } from 'react'
import { Icon, type IconColor, type IconName } from './icon'
import { IconButton } from './icon-button'
import { Badge as ShadcnBadge } from './shadcn/badge'
import { type TextStyledColor } from './text-styled'
import { cn } from '@/lib/utils'

export type BadgeVariant = 'primary' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link'
export type BadgeSize = 'xs' | 'sm' | 'md' | 'lg'

export type BadgeProps = Omit<React.ComponentPropsWithoutRef<'span'>, 'children'> & {
	variant?: BadgeVariant
	asChild?: boolean
	label?: string
	color?: TextStyledColor
	icon?: IconName
	size?: BadgeSize
	onClose?: () => void
	children?: ReactNode
	iconClassName?: string
	closeClassName?: string
	ariaOnClose?: string
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
	(
		{
			variant = 'primary',
			asChild = false,
			label,
			color,
			icon,
			size = 'md',
			onClose,
			className,
			children,
			iconClassName,
			closeClassName,
			ariaOnClose,
			...props
		},
		ref,
	) => {
		const shadcnVariant = variant === 'primary' ? 'default' : variant
		const needsContrast =
			includes(['primary', 'destructive'], variant) || includes(['contrast', 'soft'], color)
		const defaultColor = needsContrast ? 'contrast' : variant === 'link' ? 'primary' : 'dimmed'
		const mergedClassName = cn(
			sizeTextClasses[size],
			sizeIconClasses[size],
			color && textColorClasses[color],
			color && variant === 'outline' && outlineColorClasses[color],
			className,
		)

		if (asChild) {
			return (
				<ShadcnBadge
					ref={ref}
					asChild
					variant={shadcnVariant}
					className={mergedClassName}
					{...props}
				>
					{children}
				</ShadcnBadge>
			)
		}

		const iconColor = color && iconColorMap[color]
		const inner = (
			<>
				{icon ? (
					<Icon
						name={icon}
						size={iconSizeMap[size]}
						color={iconColor ?? defaultColor}
						className={cn(
							size === 'lg' && 'ml-1',
							color === 'soft' && 'text-background/60',
							iconClassName,
						)}
						data-icon="inline-start"
					/>
				) : null}
				{label ?? children}
				{onClose ? (
					<IconButton
						icon="x"
						variant={needsContrast ? 'default' : 'ghost'}
						size={size === 'lg' ? 'sm' : 'xs'}
						onClick={onClose}
						className={cn(
							'-mb-0.5 -mr-1 shrink-0',
							size === 'lg' ? '-ml-1' : '-ml-1',
							'opacity-70 bg-transparent',
							'hover:bg-transparent hover:opacity-100 transition-opacity',
							closeClassName,
						)}
						aria-label={ariaOnClose ?? 'Remove'}
					/>
				) : null}
			</>
		)

		return (
			<ShadcnBadge ref={ref} variant={shadcnVariant} className={mergedClassName} {...props}>
				{inner}
			</ShadcnBadge>
		)
	},
)

const sizeTextClasses: Record<BadgeSize, string> = {
	xs: 'text-xs',
	sm: 'text-sm',
	md: 'text-base',
	lg: 'text-lg',
}

const sizeIconClasses: Record<BadgeSize, string> = {
	xs: '[&>svg]:size-3',
	sm: '[&>svg]:size-3.5',
	md: '[&>svg]:size-4',
	lg: '[&>svg]:size-5',
}

const iconSizeMap: Record<BadgeSize, 'xs' | 'sm' | 'md' | 'lg'> = {
	xs: 'xs',
	sm: 'sm',
	md: 'md',
	lg: 'lg',
}

const iconColorMap: Record<TextStyledColor, IconColor | undefined> = {
	primary: 'primary',
	secondary: 'muted',
	dimmed: 'dimmed',
	contrast: 'contrast',
	soft: 'contrast',
}

const textColorClasses: Record<TextStyledColor, string> = {
	primary: 'text-primary',
	secondary: 'text-muted-foreground',
	dimmed: 'text-dimmed',
	contrast: 'text-background',
	soft: 'text-background/60',
}

const outlineColorClasses: Record<TextStyledColor, string> = {
	primary: 'border-primary/40',
	secondary: 'border-dimmed/30',
	dimmed: 'border-border',
	contrast: 'border-background/70',
	soft: 'border-background/40',
}
