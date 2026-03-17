import { OnboardingWizard } from './onboarding-wizard'
import { PageSuspense } from '@/ui'

export function SignupPage() {
	return (
		<PageSuspense preset="wide">
			<OnboardingWizard />
		</PageSuspense>
	)
}
