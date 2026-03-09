import { forwardRef, type ReactNode } from 'react'
import { Icon, type IconName } from './icon'
import { IconButton } from './icon-button'
import { Badge as ShadcnBadge } from './shadcn/badge'
import { type SemanticColor, semanticColorClasses, textSizeClasses } from './types'
import { needsContrast } from './utils'
import { cn } from '@/utils'

export type BadgeVariant = 'primary' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link'
export type BadgeSize = 'xs' | 'sm' | 'md' | 'lg'

export type BadgeProps = Omit<React.ComponentPropsWithoutRef<'span'>, 'children'> & {
	variant?: BadgeVariant
	asChild?: boolean
	label?: string
	color?: SemanticColor
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
		const contrast = needsContrast(variant, color)
		const defaultColor = contrast ? 'contrast' : variant === 'link' ? 'primary' : 'dimmed'
		const mergedClassName = cn(
			textSizeClasses[size],
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

		const iconColor = color ? iconColorMap[color] : undefined
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
						variant={contrast ? 'default' : 'ghost'}
						size={size === 'lg' ? 'sm' : 'xs'}
						onClick={onClose}
						className={cn(
							'-mb-0.5 -ml-1 -mr-1 shrink-0',
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

const iconColorMap: Record<SemanticColor, SemanticColor | 'contrast'> = {
	primary: 'primary',
	secondary: 'secondary',
	dimmed: 'dimmed',
	contrast: 'contrast',
	soft: 'contrast',
	destructive: 'contrast',
}

const textColorClasses: Record<SemanticColor, string> = {
	...semanticColorClasses,
	primary: 'text-primary',
}

const outlineColorClasses: Record<SemanticColor, string> = {
	primary: 'border-primary/40',
	secondary: 'border-dimmed/30',
	destructive: 'border-destructive/40',
	dimmed: 'border-border',
	contrast: 'border-background/70',
	soft: 'border-background/40',
}
