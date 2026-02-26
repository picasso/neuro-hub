import CircularProgress from '@mui/material/CircularProgress'
import Stack from '@mui/material/Stack'
import { Suspense } from 'react'
import { OnboardingWizard } from './onboarding-wizard'

export function SignupPage() {
	return (
		<Suspense
			fallback={
				<Stack justifyContent="center" alignItems="center" sx={{ minHeight: '60vh' }}>
					<CircularProgress />
				</Stack>
			}
		>
			<OnboardingWizard />
		</Suspense>
	)
}
