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
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
	(
		{
			variant = 'primary',
			asChild = false,
			label,
			color = 'primary',
			icon,
			size = 'md',
			onClose,
			className,
			children,
			iconClassName,
			closeClassName,
			...props
		},
		ref,
	) => {
		const shadcnVariant = variantToShadcn[variant]
		const content = label ?? children
		const mergedClassName = cn(
			'inline-flex items-center gap-1',
			sizeToTextClass[size],
			sizeToIconClass[size],
			color && textColorClasses[color],
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

		const iconColor = iconColorMap[color]
		const inner = (
			<>
				{icon ? (
					<Icon
						name={icon}
						size={iconSizeMap[size]}
						color={iconColor}
						className={cn(
							'shrink-0',
							!iconColor && textColorClasses[color],
							iconClassName,
						)}
					/>
				) : null}
				{content}
				{onClose ? (
					<IconButton
						icon="x"
						variant="ghost"
						color={iconColor}
						size={'xs'}
						onClick={onClose}
						className={cn(
							'-my-0.5 -mr-2 ml-0 shrink-0',
							'opacity-50 hover:bg-transparent hover:opacity-100 transition-opacity',
							closeClassName,
						)}
						aria-label="Remove"
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

const variantToShadcn: Record<
	BadgeVariant,
	'default' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link'
> = {
	primary: 'default',
	secondary: 'secondary',
	destructive: 'destructive',
	outline: 'outline',
	ghost: 'ghost',
	link: 'link',
}

const sizeToTextClass: Record<BadgeSize, string> = {
	xs: 'text-xs',
	sm: 'text-sm',
	md: 'text-base',
	lg: 'text-lg',
}

const sizeToIconClass: Record<BadgeSize, string> = {
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
	soft: undefined,
}
const textColorClasses: Record<TextStyledColor, string> = {
	primary: 'text-foreground',
	secondary: 'text-muted-foreground',
	dimmed: 'text-dimmed',
	contrast: 'text-background',
	soft: 'text-background/60',
}
