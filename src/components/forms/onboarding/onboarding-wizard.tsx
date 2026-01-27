'use client'

import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Container from '@mui/material/Container'
import Paper from '@mui/material/Paper'
import { useUnit } from 'effector-react'
import { ProgressStepper } from './progress-stepper'
import { ClientProfileStep } from './steps/client-profile-step'
import { CredentialsStep } from './steps/credentials-step'
import { EmailVerificationStep } from './steps/email-verification-step'
import { FreelancerProfileStep } from './steps/freelancer-profile-step'
import { RoleSelectionStep } from './steps/role-selection-step'
import { SkillsSelectionStep } from './steps/skills-selection-step'
import {
	$currentStep,
	$error,
	$role,
	addSkillsFx,
	registerUserFx,
	updateProfileFx,
} from '@/stores/onboarding'

const STEP_LABELS = ['Роль', 'Аккаунт', 'Профиль', 'Навыки', 'Email']

export function OnboardingWizard() {
	const [currentStep, role, error, isRegistering, isUpdatingProfile, isAddingSkills] = useUnit([
		$currentStep,
		$role,
		$error,
		registerUserFx.pending,
		updateProfileFx.pending,
		addSkillsFx.pending,
	])

	const isLoading = isRegistering || isUpdatingProfile || isAddingSkills

	const renderStep = () => {
		switch (currentStep) {
			case 1:
				return <RoleSelectionStep />
			case 2:
				return <CredentialsStep />
			case 3:
				if (role === 'freelancer') {
					return <FreelancerProfileStep />
				} else if (role === 'client') {
					return <ClientProfileStep />
				}
				return null
			case 4:
				if (role === 'freelancer') {
					return <SkillsSelectionStep />
				}
				return <EmailVerificationStep />
			case 5:
				return <EmailVerificationStep />
			default:
				return null
		}
	}

	const getSteps = () => {
		if (role === 'client') {
			return ['Роль', 'Аккаунт', 'Профиль', 'Email']
		}
		return STEP_LABELS
	}

	return (
		<Container maxWidth="lg" sx={{ py: 4 }}>
			<Paper elevation={2} sx={{ p: { xs: 2, md: 4 } }}>
				<ProgressStepper steps={getSteps()} />

				{error && (
					<Box sx={{ mb: 3 }}>
						{/* TODO: handle error display */}
						{/* <Alert severity="error">{error}</Alert> */}
					</Box>
				)}

				{isLoading && (
					<Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
						<CircularProgress />
					</Box>
				)}

				{!isLoading && renderStep()}
			</Paper>
		</Container>
	)
}
