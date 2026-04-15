'use client'

import { reduce } from 'lodash'
import { forwardRef } from 'react'
import { Avatar as AvatarRoot, AvatarBadge, AvatarFallback, AvatarImage } from './shadcn/avatar'
import { cn } from '@/utils'

export type AvatarSize = 'sm' | 'md' | 'lg' | 'editor'
export type AvatarBadgeStatus = 'error' | 'success' | 'warning' | 'info'

export type AvatarProps = {
	name: string
	size?: AvatarSize
	color?: string | 'auto'
	src?: string | null
	alt?: string
	badge?: AvatarBadgeStatus
	bordered?: boolean
	className?: string
}

export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
	{ name, size = 'md', color = 'auto', src, alt, badge, bordered = false, className },
	ref,
) {
	const initials = getInitials(name)
	const bgColor = color === 'auto' ? (palette[stringToHash(name)] ?? palette[0]) : color
	const shadcnSize = size === 'md' || size === 'editor' ? 'default' : size

	return (
		<AvatarRoot
			key={`${src ?? 'fallback'}:${name}`}
			ref={ref}
			size={shadcnSize}
			className={cn(
				bordered && 'outline outline-foreground/20',
				badge && 'overflow-visible',
				// extra visual padding for sm size initials
				size === 'sm' && 'outline',
				size === 'editor' && 'size-30 **:data-[slot=avatar-fallback]:text-5xl',
				className,
			)}
			// extra visual padding for sm size initials
			style={{ outlineColor: size === 'sm' && !src ? bgColor : undefined }}
		>
			{src && <AvatarImage src={src} alt={alt ?? name} />}
			<AvatarFallback
				className="text-white font-semibold"
				style={{ backgroundColor: bgColor }}
			>
				{initials}
			</AvatarFallback>
			{badge && <AvatarBadge className={badgeClass[badge]} aria-hidden />}
		</AvatarRoot>
	)
})

// 20 colors with good contrast to white (WCAG AA+)
const palette: readonly string[] = [
	'#5a4fcf',
	'#db2777',
	'#0891b2',
	'#059669',
	'#dc2626',
	'#ea580c',
	'#b45309',
	'#7c3aed',
	'#2563eb',
	'#0d9488',
	'#16a34a',
	'#b91c1c',
	'#c026d3',
	'#4f46e5',
	'#0369a1',
	'#047857',
	'#a16207',
	'#9333ea',
	'#1d4ed8',
	'#be185d',
]

export function getInitials(name: string): string {
	const parts = name.trim().split(/\s+/).filter(Boolean)
	if (parts.length === 0) return '??'
	if (parts.length === 1) {
		const word = parts[0]
		if (word.length >= 2) return (word[0]! + word[1]!).toUpperCase()
		return (word[0]! + 'Z').toUpperCase()
	}
	const first = parts[0]![0]
	const last = parts[parts.length - 1]![0]
	return (first + last).toUpperCase()
}

const badgeClass: Record<'error' | 'success' | 'warning' | 'info', string> = {
	error: 'bg-destructive',
	success: 'bg-green-500',
	warning: 'bg-amber-500',
	info: 'bg-blue-500',
}

function stringToHash(name: string) {
	return (
		Math.abs(reduce(name, (hash, _, index) => (hash << 5) - hash + name.charCodeAt(index), 0)) %
		palette.length
	)
}
