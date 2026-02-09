'use client'

import Chip from '@mui/material/Chip'
import Container from '@mui/material/Container'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import { useGate, useUnit } from 'effector-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { ProgressStepper } from './progress-stepper'
import { ClientProfileStep } from './steps/client-profile-step'
import { CredentialsStep } from './steps/credentials-step'
import { EmailVerificationStep } from './steps/email-verification-step'
import { FreelancerProfileStep } from './steps/freelancer-profile-step'
import { RoleSelectionStep } from './steps/role-selection-step'
import { SkillsSelectionStep } from './steps/skills-selection-step'
import type { UserRole } from '@/lib/validations'
import { Icon } from '@/components/ui/icon'
import {
	$currentStep,
	$role,
	OnboardingGate,
	resetOnboarding,
	setCurrentStep,
	setRole,
} from '@/stores/onboarding'

const wizardSteps = {
	freelancer: ['Роль', 'Профиль', 'Навыки', 'Аккаунт', 'Проверка'],
	client: ['Роль', 'Профиль', 'Аккаунт', 'Проверка'],
}

export function OnboardingWizard() {
	useGate(OnboardingGate)
	const router = useRouter()
	const searchParams = useSearchParams()
	const [currentStep, role] = useUnit([$currentStep, $role])

	// handle query param role on mount
	useEffect(() => {
		const roleParam = searchParams.get('role')
		// apply query param only if user is on step 1 and hasn't been applied yet
		if (
			roleParam &&
			(roleParam === 'freelancer' || roleParam === 'client') &&
			currentStep === 1
		) {
			setRole(roleParam as UserRole)
			setCurrentStep(2)
			router.replace('/signup', { scroll: false })
		}
	}, [searchParams, currentStep, router])

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
				{role && currentStep !== 1 && (
					<Stack
						direction="row"
						justifyContent="center"
						alignItems="center"
						spacing={2}
						sx={{ mb: 3 }}
					>
						<Chip
							label={`Регистрация: ${role === 'freelancer' ? 'Фрилансер' : 'Заказчик'}`}
							icon={<Icon name={role === 'freelancer' ? 'person' : 'business'} />}
							onDelete={() => resetOnboarding()}
							color="primary"
							variant="outlined"
							sx={{
								fontSize: '1rem',
								py: 2.5,
								px: 1,
								'& .MuiChip-label': {
									px: 3,
								},
							}}
						/>
					</Stack>
				)}
				{role && <ProgressStepper steps={wizardSteps[role]} />}
				{renderStep()}
			</Paper>
		</Container>
	)
}
