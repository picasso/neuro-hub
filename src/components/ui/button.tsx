import Link from 'next/link'
import { forwardRef, useMemo, type ComponentProps, type MouseEvent, type ReactNode } from 'react'
import { Icon, type IconProps, type IconOptions } from './icon'
import { Button as ShadcnButton } from '@/components/shadcn/button'
import { cn } from '@/lib/utils'

type ButtonVariant = 'default' | 'outline' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl'
type Href = ComponentProps<typeof Link>['href']

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
	href?: Href
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
			className,
			children,
			...props
		},
		ref,
	) => {
		const content = label ?? children
		const shadcnSize = size === 'md' || size === undefined ? 'default' : size
		const mergedClassName = cn(
			!!fullWidth && 'w-full',
			!!noWrap && 'whitespace-nowrap',
			!!bold && 'font-bold tracking-wide',
			className,
		)
		const iconProps = useMemo(
			() =>
				({
					color: (iconOptions?.color ?? variant === 'default') ? 'contrast' : 'muted',
					size: iconOptions?.size,
					spinning: iconOptions?.spinning,
					className: iconOptions?.tw,
				}) as Omit<IconProps, 'name'>,
			[iconOptions, variant],
		)

		const inner = (
			<>
				{leftIcon ? <Icon name={leftIcon} {...iconProps} /> : null}
				{content}
				{rightIcon ? <Icon name={rightIcon} {...iconProps} /> : null}
			</>
		)

		if (href) {
			const handleDisabledClick = (e: MouseEvent<HTMLAnchorElement>) => {
				if (!disabled) return
				e.preventDefault()
				e.stopPropagation()
			}
			return (
				<ShadcnButton
					ref={ref}
					asChild
					variant={variant}
					size={shadcnSize}
					className={mergedClassName}
				>
					<Link
						href={href}
						aria-disabled={disabled || undefined}
						tabIndex={disabled ? -1 : undefined}
						onClick={handleDisabledClick}
					>
						{inner}
					</Link>
				</ShadcnButton>
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
