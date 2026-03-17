import { capitalize } from 'lodash'
import { forwardRef } from 'react'
import { type ButtonProps, buttonSize, HrefButton, outlineStyle } from './button'
import { Icon, type IconProps } from './icon'
import { Button as ShadcnButton } from './shadcn/button'
import { needsContrast } from './utils'
import { cn } from '@/utils'

type ButtonVariant = NonNullable<ButtonProps['variant']>

export type IconButtonProps = Omit<React.ComponentPropsWithoutRef<'button'>, 'children'> & {
	icon: IconProps['name']
	color?: IconProps['color']
	variant?: ButtonVariant | 'contrast'
	size?: ButtonProps['size'] | 'icon'
	// url/href: workaround when next.js expects route or URLObject instead of string
	url?: ButtonProps['href']
	href?: string
	target?: ButtonProps['target']
	forceSize?: IconProps['size']
	spinning?: IconProps['spinning']
	rounded?: boolean
	iconClassName?: string
	asSpan?: boolean
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
	(
		{
			disabled,
			icon,
			color = 'secondary',
			variant = 'ghost',
			size = 'icon',
			href,
			url,
			target,
			forceSize,
			spinning,
			rounded,
			className,
			iconClassName,
			asSpan,
			...props
		},
		ref,
	) => {
		const shadcnVariant = variant === 'contrast' ? 'ghost' : (variant as ButtonVariant)
		const contrast = needsContrast(variant)
		const mergedClassName = cn(
			!!rounded && 'rounded-full',
			outlineStyle(variant),
			contrastStyle(variant),
			className,
		)

		const inner = (
			<Icon
				name={icon}
				size={forceSize ?? (size === 'icon' ? 'sm' : size)}
				color={contrast ? 'contrast' : color}
				spinning={spinning}
				className={cn(!!forceSize && 'w-auto! h-auto!', iconClassName)}
			/>
		)

		if (url || href) {
			return (
				<HrefButton
					ref={ref}
					href={url ?? (href as NonNullable<ButtonProps['href']>)}
					target={target}
					variant={shadcnVariant}
					size={buttonSize(size)}
					className={mergedClassName}
					disabled={disabled}
				>
					{inner}
				</HrefButton>
			)
		}

		const ariaLabel = capitalize(icon.replace(/-/g, ' '))
		// workaround for shadcn button to render as span
		// `ref` omitted intentionally to avoid warning
		if (asSpan) {
			return (
				<ShadcnButton
					asChild
					variant={shadcnVariant}
					size={buttonSize(size)}
					className={mergedClassName}
					disabled={disabled}
				>
					<span
						role="button"
						tabIndex={disabled ? -1 : 0}
						aria-label={ariaLabel}
						{...(props as React.ComponentPropsWithoutRef<'span'>)}
					>
						{inner}
					</span>
				</ShadcnButton>
			)
		}

		return (
			<ShadcnButton
				ref={ref}
				asChild={!!href}
				variant={shadcnVariant}
				size={buttonSize(size)}
				aria-label={ariaLabel}
				disabled={disabled}
				className={mergedClassName}
				{...props}
			>
				{inner}
			</ShadcnButton>
		)
	},
)

export function contrastStyle(variant: 'contrast' | unknown) {
	return (
		variant === 'contrast' && '[&_svg]:text-white/70 hover:bg-white/30 hover:[&_svg]:text-white'
	)
}
