import { type ComponentPropsWithoutRef, type ReactNode } from 'react'
import { cn } from '@/utils'

export type PagePreset = 'form' | 'content' | 'wide' | 'full' | 'public'
export type PageWidth = 'compact' | 'tablet' | 'desktop' | 'full'
export type PageInset = 'default' | 'none'
export type PageSpacing = 'none' | 'sm' | 'smb' | 'md' | 'mdb' | 'lg' | 'lgb'
export type PageAlign = 'center' | 'start' | 'end'

export type PageContainerProps = ComponentPropsWithoutRef<'div'> & {
	width?: PageWidth
	innerWidth?: PageWidth
	innerAlign?: PageAlign
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
	innerWidth,
	innerAlign,
	className,
	children,
	...props
}: PageContainerProps) {
	return (
		<div
			className={cn(
				'w-full mx-auto',
				pageWidthClassMap[width],
				pageInsetClassMap[inset],
				className,
			)}
			{...props}
		>
			{innerWidth ? (
				<div
					className={cn(
						'flex flex-col',
						pageWidthClassMap[innerWidth],
						innerAlign === 'center' && 'items-center',
						innerAlign === 'start' && 'items-start',
						innerAlign === 'end' && 'items-end',
					)}
				>
					{children}
				</div>
			) : (
				children
			)}
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
					innerWidth={resolvedPreset.innerWidth}
					innerAlign={resolvedPreset.innerAlign}
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
	{
		width: PageWidth
		inset: PageInset
		spacing: PageSpacing

		innerWidth?: PageWidth
		innerAlign?: PageAlign
	}
> = {
	form: { width: 'compact', inset: 'default', spacing: 'lg' },
	content: { width: 'tablet', inset: 'default', spacing: 'lg' },
	wide: { width: 'desktop', inset: 'default', spacing: 'lg' },
	full: { width: 'full', inset: 'none', spacing: 'none' },
	public: {
		width: 'desktop',
		inset: 'default',
		spacing: 'mdb',
		innerAlign: 'start',
		innerWidth: 'tablet',
	},
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
	sm: 'py-4 md:py-6',
	smb: 'py-4 md:pt-2 md:pb-6',
	md: 'py-8 md:py-10',
	mdb: 'py-8 md:pt-4 md:pb-10',
	lg: 'py-16 md:py-20',
	lgb: 'py-16 md:pt-8 md:pb-20',
}
