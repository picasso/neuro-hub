import Link from 'next/link'
import { forwardRef, type ComponentProps, type ReactNode, type ForwardedRef } from 'react'
import { Icon, type IconProps, type IconOptions } from './icon'
import { Button as ShadcnButton } from './shadcn/button'
import { cn } from '@/lib/utils'

type LinkProps = ComponentProps<typeof Link>
type ButtonVariant = 'default' | 'outline' | 'secondary' | 'destructive' | 'ghost'
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export type ButtonProps = Omit<React.ComponentPropsWithoutRef<'button'>, 'children'> & {
	label?: string
	bold?: boolean
	noWrap?: boolean
	fullWidth?: boolean
	leftIcon?: IconProps['name']
	rightIcon?: IconProps['name']
	iconOptions?: IconOptions
	variant?: ButtonVariant
	size?: ButtonSize
	href?: LinkProps['href']
	target?: LinkProps['target']
	children?: ReactNode
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			disabled,
			noWrap,
			label,
			bold,
			fullWidth,
			leftIcon,
			rightIcon,
			iconOptions,
			variant = 'default',
			size = 'md',
			href,
			target,
			className,
			children,
			...props
		},
		ref,
	) => {
		const content = label ?? children
		const shadcnSize = buttonSize(size)
		const needsContrast = variant === 'default' || variant === 'destructive'
		const mergedClassName = cn(
			!!fullWidth && 'w-full',
			!!noWrap && 'whitespace-nowrap',
			!!bold && 'font-bold tracking-wide',
			outlineStyle(variant),
			className,
		)
		const iconProps: Omit<IconProps, 'name'> = {
			color: needsContrast ? 'contrast' : 'muted',
			size: iconOptions?.size,
			spinning: iconOptions?.spinning,
			className: iconOptions?.tw,
		}

		const inner = (
			<>
				{leftIcon ? <Icon name={leftIcon} {...iconProps} /> : null}
				{content}
				{rightIcon ? <Icon name={rightIcon} {...iconProps} /> : null}
			</>
		)

		if (href) {
			return (
				<HrefButton
					ref={ref}
					href={href}
					target={target}
					variant={variant}
					size={shadcnSize}
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
				disabled={disabled}
				variant={variant}
				size={shadcnSize}
				className={mergedClassName}
				{...props}
			>
				{inner}
			</ShadcnButton>
		)
	},
)

export function outlineStyle(variant: 'outline' | unknown) {
	return (
		variant === 'outline' &&
		'hover:bg-primary/5 hover:border-primary/50 hover:[&_svg]:text-primary'
	)
}

export function buttonSize(size: ButtonSize | 'icon') {
	return size === 'md' || size === undefined ? 'default' : size
}

type HrefButtonProps = {
	ref: ForwardedRef<HTMLButtonElement>
	href: NonNullable<ButtonProps['href']>
	target?: NonNullable<ButtonProps['target']>
	variant: NonNullable<ButtonProps['variant']>
	size: ReturnType<typeof buttonSize>
	className: ButtonProps['className']
	children: ReactNode
	disabled: ButtonProps['disabled']
}

export function HrefButton({
	ref,
	href,
	variant,
	size,
	target,
	className,
	children,
	disabled,
}: HrefButtonProps) {
	return (
		<ShadcnButton
			ref={ref}
			asChild
			variant={variant}
			size={size}
			className={className}
			disabled={disabled}
		>
			<Link
				href={href}
				target={target}
				aria-disabled={disabled || undefined}
				tabIndex={disabled ? -1 : undefined}
				className={cn(disabled && 'pointer-events-none opacity-50')}
			>
				{children}
			</Link>
		</ShadcnButton>
	)
}
