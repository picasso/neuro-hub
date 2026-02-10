import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import { Suspense } from 'react'
import { OnboardingWizard } from '@/components/forms/onboarding'

export { signupMetadata as metadata } from '@/config/metadata'

export default function SignupPage() {
	return (
		<Suspense
			fallback={
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						minHeight: '60vh',
					}}
				>
					<CircularProgress />
				</Box>
			}
		>
			<OnboardingWizard />
		</Suspense>
	)
}
