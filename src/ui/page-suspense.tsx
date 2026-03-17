import { type ReactNode, Suspense } from 'react'
import { Icon } from './icon'
import { PageShell, type PagePreset, type PageSpacing } from './page-shell'

export type PageSuspenseProps = {
	children: ReactNode
	fallback?: ReactNode
	preset?: PagePreset
	spacing?: PageSpacing
}

const defaultMinHeight = 'min-h-[60vh]'

// wraps children in Suspense with a default loading state: PageShell + centered loader
// use for route-level pages that load async content (e.g. LoginForm, OnboardingWizard)
export function PageSuspense({
	children,
	fallback,
	preset = 'form',
	spacing = 'none',
}: PageSuspenseProps) {
	const resolvedFallback = fallback ?? (
		<PageShell preset={preset} spacing={spacing}>
			<div className={`flex items-center justify-center ${defaultMinHeight}`}>
				<Icon name="loader-circle" spinning size="lg" />
			</div>
		</PageShell>
	)
	return <Suspense fallback={resolvedFallback}>{children}</Suspense>
}
