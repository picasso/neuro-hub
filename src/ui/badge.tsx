import { includes } from 'lodash'
import { forwardRef, type ReactNode } from 'react'
import { Icon, type IconName } from './icon'
import { IconButton } from './icon-button'
import { Badge as ShadcnBadge } from './shadcn/badge'
import { type IconColor, type SemanticColor, semanticColorClasses, textSizeClasses } from './types'
import { needsContrast } from './utils'
import { cn, simpleMarkdown, type MarkdownParams } from '@/utils'

export type BadgeVariant = 'primary' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link'
export type BadgeSize = 'xs' | 'sm' | 'md'
export type BadgeColor = SemanticColor | 'error' | 'success' | 'warning' | 'info' | 'cta'

export type BadgeProps = Omit<React.ComponentPropsWithoutRef<'span'>, 'children'> & {
	variant?: BadgeVariant
	asChild?: boolean
	label?: string | null
	color?: BadgeColor
	icon?: IconName
	size?: BadgeSize
	onClose?: () => void
	children?: ReactNode
	iconClassName?: string
	closeClassName?: string
	ariaOnClose?: string
	capitalize?: boolean
	lowercased?: boolean
	moreContrast?: boolean
	wider?: boolean
	md?: Partial<MarkdownParams> | false
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
	(
		{
			variant = 'secondary',
			asChild,
			label,
			color,
			icon,
			size = 'xs',
			onClose,
			className,
			children,
			iconClassName,
			closeClassName,
			ariaOnClose,
			capitalize,
			lowercased,
			moreContrast,
			wider,
			md,
			...props
		},
		ref,
	) => {
		const shadcnVariant = variant === 'primary' ? 'default' : variant
		const contrast = needsContrast(variant, color)
		const defaultColor = contrast ? 'contrast' : variant === 'link' ? 'primary' : 'dimmed'
		const hasOverlay = color === 'cta' && variant === 'outline'
		const mergedClassName = cn(
			'px-2.5',
			textSizeClasses[size],
			sizeIconClasses[size],
			color && badgeColorMap[variant][color],
			color && contrast && moreContrast && contrastColorMap[variant]?.[color],
			lowercased && 'pt-0',
			lowercased && size === 'xs' && 'h-6',
			capitalize && 'capitalize',
			onClose && 'pr-0.5',
			hasOverlay && 'relative',
			wider && 'tracking-wider text-shadow-2xs',
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

		const iconColor = color ? iconColorMap[variant][color] : undefined
		const inner = (
			<>
				{hasOverlay ? <span className="bg-black/20 absolute inset-0 z-0" /> : null}
				{icon ? (
					<Icon
						name={icon}
						size={iconSizeMap[size]}
						color={iconColor ?? defaultColor}
						className={cn(
							'z-10',
							color === 'soft' && 'text-background/60',
							iconClassName,
						)}
						data-icon="inline-start"
					/>
				) : null}
				<span className="z-10">
					{label ? (md === false ? label : simpleMarkdown(label, md)) : children}
				</span>
				{onClose ? (
					<IconButton
						icon="x"
						variant={contrast ? 'default' : 'ghost'}
						size="xs"
						onClick={onClose}
						className={cn(
							'-mb-0.5 -ml-1 -mr-1 shrink-0 z-10',
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
			<ShadcnBadge
				ref={ref}
				variant={shadcnVariant}
				className={mergedClassName}
				data-outlined={
					!!(
						variant === 'outline' &&
						(!color ||
							includes(['primary', 'secondary', 'dimmed', 'destructive'], color))
					)
				}
				{...props}
			>
				{inner}
			</ShadcnBadge>
		)
	},
)

const sizeIconClasses: Record<BadgeSize, string> = {
	xs: '[&>svg]:size-3',
	sm: '[&>svg]:size-3.5',
	md: '[&>svg]:size-4',
}

const iconSizeMap: Record<BadgeSize, 'xs' | 'sm' | 'md'> = {
	xs: 'xs',
	sm: 'sm',
	md: 'md',
}

const iconColorMap: Record<BadgeVariant, Record<BadgeColor, IconColor>> = {
	primary: {
		primary: 'contrast',
		secondary: 'soft',
		dimmed: 'soft',
		contrast: 'contrast',
		soft: 'contrast',
		destructive: 'destructive',
		error: 'contrast',
		success: 'contrast',
		warning: 'contrast',
		info: 'contrast',
		cta: 'contrast',
	},
	secondary: {
		primary: 'secondary',
		secondary: 'secondary',
		dimmed: 'dimmed',
		contrast: 'contrast',
		soft: 'contrast',
		destructive: 'destructive',
		error: 'secondary',
		success: 'secondary',
		warning: 'secondary',
		info: 'secondary',
		cta: 'secondary',
	},
	destructive: {
		primary: 'contrast',
		secondary: 'contrast',
		dimmed: 'soft',
		contrast: 'contrast',
		soft: 'contrast',
		destructive: 'contrast',
		error: 'contrast',
		success: 'contrast',
		warning: 'contrast',
		info: 'contrast',
		cta: 'contrast',
	},
	outline: {
		primary: 'primary',
		secondary: 'secondary',
		dimmed: 'dimmed',
		contrast: 'contrast',
		soft: 'contrast',
		destructive: 'destructive',
		error: 'destructive',
		success: 'success',
		warning: 'warning',
		info: 'info',
		cta: 'contrast',
	},
	ghost: {
		primary: 'primary',
		secondary: 'secondary',
		dimmed: 'dimmed',
		contrast: 'contrast',
		soft: 'contrast',
		destructive: 'destructive',
		error: 'destructive',
		success: 'success',
		warning: 'warning',
		info: 'info',
		cta: 'cta',
	},
	link: {
		primary: 'primary',
		secondary: 'primary',
		dimmed: 'dimmed',
		contrast: 'contrast',
		soft: 'soft',
		destructive: 'destructive',
		error: 'destructive',
		success: 'success',
		warning: 'warning',
		info: 'info',
		cta: 'cta',
	},
}

const badgeColorMap: Record<BadgeVariant, Record<BadgeColor, string>> = {
	primary: {
		...semanticColorClasses,
		primary: 'text-white',
		secondary: 'text-white/80',
		dimmed: 'text-white/60',
		destructive: 'bg-primary/20 text-destructive',
		error: 'bg-destructive text-white',
		success: 'bg-primary text-white',
		warning: 'bg-amber-500 text-white',
		info: 'bg-blue-500 text-white',
		cta: 'bg-cta text-white',
	},
	secondary: {
		...semanticColorClasses,
		primary: 'bg-primary/30 text-muted-foreground',
		contrast: 'bg-black/20 text-white/80',
		soft: 'bg-black/10 text-white/60',
		error: 'bg-red-200',
		success: 'bg-primary/30',
		warning: 'bg-amber-200',
		info: 'bg-blue-200',
		cta: 'bg-cta/10 text-cta/80',
	},
	destructive: {
		...semanticColorClasses,
		primary: 'text-white',
		secondary: 'text-white/80',
		dimmed: 'text-white/60',
		destructive: 'text-white',
		error: 'bg-destructive text-white',
		success: 'bg-emerald-500 text-white',
		warning: 'bg-amber-500 text-white',
		info: 'bg-blue-500 text-white',
		cta: 'bg-cta text-white',
	},
	outline: {
		...semanticColorClasses,
		primary: 'text-primary border-primary/40',
		secondary: 'text-muted-foreground border-dimmed/40',
		contrast: 'text-white bg-black/10 border-white/70',
		soft: 'text-white/60 bg-black/5 border-white/40',
		destructive: 'text-destructive border-destructive/50',
		error: 'bg-destructive/10 text-destructive border-destructive/40',
		success: 'bg-primary/10 text-emerald-600 border-primary/40',
		warning: 'bg-amber-100 text-amber-600 border-amber-400/40',
		info: 'bg-blue-100 text-blue-600 border-blue-400/40',
		cta: 'bg-cta/60 text-white border-white/50',
	},
	ghost: {
		...semanticColorClasses,
		primary: 'text-primary',
		contrast: 'hover:bg-white/20 hover:text-white',
		soft: 'text-white/60 hover:bg-background/10 hover:text-white/70',
		destructive: 'text-destructive hover:bg-destructive/10 hover:text-destructive',
		error: 'text-destructive/80 hover:bg-destructive/10 hover:text-destructive',
		success: 'text-emerald-600 hover:bg-primary/10 hover:text-emerald-600',
		warning: 'text-amber-600 hover:bg-amber-100 hover:text-amber-600',
		info: 'text-blue-600 hover:bg-blue-100 hover:text-blue-600',
		cta: 'text-cta hover:bg-cta/10 hover:text-cta',
	},
	link: {
		...semanticColorClasses,
		primary: '',
		secondary: '',
		error: 'text-destructive',
		success: 'text-emerald-600',
		warning: 'text-amber-600',
		info: 'text-blue-600',
		cta: 'text-cta',
	},
}

const contrastColorMap: Partial<Record<BadgeVariant, Partial<Record<BadgeColor, string>>>> = {
	secondary: {
		contrast: 'bg-black/40 text-white',
		soft: 'bg-black/20 text-white/80',
		cta: 'bg-cta/20 text-cta',
	},
	outline: {
		contrast: 'text-white bg-black/60 border-white',
		soft: 'text-white/80 bg-black/20 border-white/60',
		cta: 'text-white bg-cta/80 border-white/70',
	},
}
