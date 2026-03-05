import { Suspense } from 'react'
import { OnboardingWizard } from './onboarding-wizard'
import { Icon } from '@/ui'

export function SignupPage() {
	return (
		<Suspense
			fallback={
				<div className="flex items-center justify-center min-h-[60vh]">
					<Icon name="loader-circle" spinning size="lg" />
				</div>
			}
		>
			<OnboardingWizard />
		</Suspense>
	)
}
