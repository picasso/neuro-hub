import { includes } from 'lodash'
import NextLink from 'next/link'
import { type SemanticColor, type TextSize, linkColorClasses, textSizeClasses } from './types'
import { disabledLinkClasses } from './utils'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

type NextLinkProps = ComponentProps<typeof NextLink>

export type LinkColor = SemanticColor | 'inherit'
type LinkHover = 'none' | 'underline' | 'vivid'

export type LinkProps = Omit<NextLinkProps, 'href'> & {
	href: NextLinkProps['href'] | string
	size?: TextSize
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
				textSizeClasses[size],
				linkColorClasses[color],
				hover !== 'vivid' && hoverClasses[hover],
				includes(['vivid', 'none'], hover) && getColoredHover(color),
				disabled && disabledLinkClasses,
				className,
			)}
			{...rest}
		>
			{children}
		</NextLink>
	)
}

const hoverClasses: Record<LinkHover, string> = {
	none: '',
	underline: 'hover:underline',
	vivid: 'transition-colors hover:text-foreground',
}

function getColoredHover(color: LinkColor): string {
	if (color === 'soft') return 'hover:text-background'
	if (color === 'dimmed' || color === 'secondary') return 'hover:text-foreground'
	if (color === 'inherit') return 'hover:text-primary'
	return ''
}

const baseClasses = 'inline-flex items-center underline-offset-2'
