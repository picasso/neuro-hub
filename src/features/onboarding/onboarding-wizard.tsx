'use client'

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
import {
	$currentStep,
	$role,
	OnboardingGate,
	resetOnboarding,
	setCurrentStep,
	setRole,
} from '@/stores/onboarding'
import { Badge, PageShell, Stack } from '@/ui'

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
		<PageShell preset="wide" spacing="md">
			<div className="bg-background border border-border rounded-xl shadow p-4 md:p-8">
				{role && currentStep !== 1 && (
					<Stack justify="center" align="center" gap={4} className="mb-6">
						<Badge
							variant="primary"
							size="md"
							label={role === 'freelancer' ? 'Фрилансер' : 'Заказчик'}
							icon={role === 'freelancer' ? 'person' : 'business'}
							onClose={() => resetOnboarding()}
							ariaOnClose="Сбросить и начать заново"
						/>
					</Stack>
				)}
				{role && <ProgressStepper steps={wizardSteps[role]} />}
				{renderStep()}
			</div>
		</PageShell>
	)
}
