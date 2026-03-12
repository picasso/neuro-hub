import { type ComponentPropsWithoutRef, type ReactNode } from 'react'
import { cn } from '@/utils'

export type PagePreset = 'form' | 'content' | 'wide' | 'full'
export type PageWidth = 'compact' | 'tablet' | 'desktop' | 'full'
export type PageInset = 'default' | 'none'
export type PageSpacing = 'none' | 'md' | 'lg'

export type PageContainerProps = ComponentPropsWithoutRef<'div'> & {
	width?: PageWidth
	inset?: PageInset
	children: ReactNode
}

export type PageShellProps = ComponentPropsWithoutRef<'div'> & {
	preset?: PagePreset
	width?: PageWidth
	inset?: PageInset
	spacing?: PageSpacing
	containerClassName?: string
	children: ReactNode
}

export function PageContainer({
	width = 'tablet',
	inset = 'default',
	className,
	children,
	...props
}: PageContainerProps) {
	return (
		<div
			className={cn(
				'mx-auto w-full',
				pageWidthClassMap[width],
				pageInsetClassMap[inset],
				className,
			)}
			{...props}
		>
			{children}
		</div>
	)
}

export function PageShell({
	preset = 'content',
	width,
	inset,
	spacing,
	className,
	containerClassName,
	children,
	...props
}: PageShellProps) {
	const resolvedPreset = pagePresetConfigMap[preset]
	const resolvedWidth = width ?? resolvedPreset.width
	const resolvedInset = inset ?? resolvedPreset.inset
	const resolvedSpacing = spacing ?? resolvedPreset.spacing

	return (
		<div className={cn(pageSpacingClassMap[resolvedSpacing], className)} {...props}>
			{resolvedWidth === 'full' ? (
				children
			) : (
				<PageContainer
					width={resolvedWidth}
					inset={resolvedInset}
					className={containerClassName}
				>
					{children}
				</PageContainer>
			)}
		</div>
	)
}

// `PageShell` defines single-column route-entry page intent.
// sidebar-based account or management pages should use a separate structural shell.
const pagePresetConfigMap: Record<
	PagePreset,
	{ width: PageWidth; inset: PageInset; spacing: PageSpacing }
> = {
	form: { width: 'compact', inset: 'default', spacing: 'lg' },
	content: { width: 'tablet', inset: 'default', spacing: 'lg' },
	wide: { width: 'desktop', inset: 'default', spacing: 'lg' },
	full: { width: 'full', inset: 'none', spacing: 'none' },
}

const pageWidthClassMap: Record<PageWidth, string> = {
	compact: 'max-w-3xl',
	tablet: 'max-w-4xl',
	desktop: 'max-w-5xl',
	full: 'max-w-none',
}

const pageInsetClassMap: Record<PageInset, string> = {
	default: 'px-4 md:px-6',
	none: '',
}

const pageSpacingClassMap: Record<PageSpacing, string> = {
	none: '',
	md: 'py-8 md:py-10',
	lg: 'py-16 md:py-20',
}
