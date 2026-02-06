'use client'

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
import { $currentStep, $role } from '@/stores/onboarding'

const wizardSteps = {
	freelancer: ['Роль', 'Профиль', 'Навыки', 'Аккаунт', 'Проверка'],
	client: ['Роль', 'Профиль', 'Аккаунт', 'Проверка'],
}

export function OnboardingWizard() {
	const [currentStep, role] = useUnit([$currentStep, $role])

	const renderStep = () => {
		switch (currentStep) {
			case 1:
				return <RoleSelectionStep />
			case 2:
				if (role === 'freelancer') {
					return <FreelancerProfileStep />
				} else if (role === 'client') {
					return <ClientProfileStep />
				}
				return null
			case 3:
				if (role === 'freelancer') {
					return <SkillsSelectionStep />
				}
				return <CredentialsStep />
			case 4:
				return <CredentialsStep />
			case 5:
				return <EmailVerificationStep />
			default:
				return null
		}
	}

	return (
		<Container maxWidth="lg" sx={{ py: 4 }}>
			<Paper elevation={2} sx={{ p: { xs: 2, md: 4 } }}>
				{role && <ProgressStepper steps={wizardSteps[role]} />}
				{renderStep()}
			</Paper>
		</Container>
	)
}
