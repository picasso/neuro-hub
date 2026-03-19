import Link from 'next/link'
import { forwardRef, type ComponentProps, type ReactNode, type ForwardedRef } from 'react'
import { Icon, type IconProps, type IconOptions } from './icon'
import { Button as ShadcnButton } from './shadcn/button'
import { disabledLinkClasses, needsContrast } from './utils'
import { cn } from '@/utils'

type LinkProps = ComponentProps<typeof Link>
type ButtonVariant = 'default' | 'outline' | 'secondary' | 'destructive' | 'ghost'
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export type ButtonProps = Omit<React.ComponentPropsWithoutRef<'button'>, 'children'> & {
	label?: string
	bold?: boolean
	noWrap?: boolean
	inverse?: boolean
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
			inverse,
			label,
			bold,
			fullWidth,
			leftIcon,
			rightIcon,
			iconOptions,
			variant = 'default',
			size = 'sm',
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
		const contrastIcon = needsContrast(variant)
		const mergedClassName = cn(
			!!fullWidth && 'w-full',
			!!noWrap && 'whitespace-nowrap',
			!!bold && 'font-bold tracking-wide',
			!inverse && outlineStyle(variant),
			inverse && inverseStyle[variant],
			className,
		)
		const iconProps: Omit<IconProps, 'name'> = {
			color: contrastIcon ? 'contrast' : 'secondary',
			size: iconOptions?.size,
			spinning: iconOptions?.spinning,
			className: iconOptions?.tw,
			accent: iconOptions?.accent,
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
				className={cn(disabled && disabledLinkClasses)}
			>
				{children}
			</Link>
		</ShadcnButton>
	)
}

export function outlineStyle(variant: 'outline' | unknown) {
	return (
		variant === 'outline' &&
		'hover:bg-primary/5 hover:border-primary/50 hover:[&_svg]:text-primary'
	)
}

export function buttonSize(size: ButtonSize | 'icon') {
	return size === 'md' || size === undefined ? 'default' : size
}

const inverseStyle: Record<ButtonVariant | 'link', string> = {
	default:
		'bg-white text-primary-dark [&_svg]:text-primary-dark hover:bg-white/80 hover:[&_svg]:text-primary-dark/90',
	outline:
		'bg-white/10 border-white text-white [&_svg]:text-white hover:bg-white/30 hover:text-white hover:border-white/50 hover:[&_svg]:text-white/80',
	secondary:
		'bg-white/30 text-secondary [&_svg]:text-secondary hover:bg-white/80 hover:text-muted-foreground hover:[&_svg]:text-muted-foreground',
	destructive:
		'bg-white text-destructive [&_svg]:text-destructive hover:bg-white/80 hover:[&_svg]:text-destructive/80',
	ghost: 'text-white [&_svg]:text-white hover:bg-white/10 hover:text-white hover:[&_svg]:text-white/90',
	link: 'text-white [&_svg]:text-white underline-none hover:bg-white/10 hover:text-white',
}
