import { Suspense } from 'react'
import { OnboardingWizard } from './onboarding-wizard'
import { Icon, PageShell } from '@/ui'

export function SignupPage() {
	return (
		<Suspense
			fallback={
				<PageShell preset="wide" spacing="none">
					<div className="flex items-center justify-center min-h-[60vh]">
						<Icon name="loader-circle" spinning size="lg" />
					</div>
				</PageShell>
			}
		>
			<OnboardingWizard />
		</Suspense>
	)
}
