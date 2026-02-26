import { includes } from 'lodash'
import NextLink from 'next/link'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

type NextLinkProps = ComponentProps<typeof NextLink>

type LinkColor = 'primary' | 'dimmed' | 'contrast' | 'soft' | 'inherit'
type LinkHover = 'none' | 'underline' | 'vivid'
type LinkSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export type LinkProps = Omit<NextLinkProps, 'href'> & {
	href: NextLinkProps['href'] | string
	size?: LinkSize
	color?: LinkColor
	hover?: LinkHover
	disabled?: boolean
}

export function Link({
	href,
	size = 'md',
	color = 'inherit',
	hover = 'none',
	disabled,
	className,
	children,
	...rest
}: LinkProps) {
	return (
		<NextLink
			href={href as NextLinkProps['href']}
			className={cn(
				baseClasses,
				sizeClasses[size],
				colorClasses[color],
				hover !== 'vivid' && hoverClasses[hover],
				includes(['vivid', 'none'], hover) && getColoredHover(color),
				disabled && 'pointer-events-none opacity-50',
				className,
			)}
			{...rest}
		>
			{children}
		</NextLink>
	)
}

const sizeClasses: Record<LinkSize, string> = {
	xs: 'text-xs',
	sm: 'text-sm',
	md: 'text-base',
	lg: 'text-lg',
	xl: 'text-xl',
}

const colorClasses: Record<LinkColor, string> = {
	inherit: 'text-inherit',
	primary: 'text-primary',
	dimmed: 'text-dimmed',
	contrast: 'text-background',
	soft: 'text-background/60',
}

const hoverClasses: Record<LinkHover, string> = {
	none: '',
	underline: 'hover:underline',
	vivid: 'transition-colors hover:text-foreground',
}

function getColoredHover(color: LinkColor): string {
	if (color === 'soft') return 'hover:text-background'
	if (color === 'dimmed') return 'hover:text-foreground'
	if (color === 'inherit') return 'hover:text-primary'
	return ''
}

const baseClasses = 'inline-flex items-center underline-offset-2'
