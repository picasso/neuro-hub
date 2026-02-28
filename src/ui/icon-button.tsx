import { capitalize } from 'lodash'
import { forwardRef } from 'react'
import { type ButtonProps, buttonSize, HrefButton, outlineStyle } from './button'
import { Icon, type IconProps } from './icon'
import { Button as ShadcnButton } from './shadcn/button'
import { needsContrast } from './utils'
import { cn } from '@/lib/utils'

type ButtonVariant = NonNullable<ButtonProps['variant']>

export type IconButtonProps = Omit<React.ComponentPropsWithoutRef<'button'>, 'children'> & {
	icon: IconProps['name']
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
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
	(
		{
			disabled,
			icon,
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
				color={contrast ? 'contrast' : 'secondary'}
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

		return (
			<ShadcnButton
				ref={ref}
				asChild={!!href}
				variant={shadcnVariant}
				size={buttonSize(size)}
				aria-label={capitalize(icon.replace(/-/g, ' '))}
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
