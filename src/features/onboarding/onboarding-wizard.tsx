'use client'

import { useGate, useUnit } from 'effector-react'
import { useSearchParams } from 'next/navigation'
import { ProgressStepper } from './progress-stepper'
import { ClientProfileStep } from './steps/client-profile-step'
import { CredentialsStep } from './steps/credentials-step'
import { EmailVerificationStep } from './steps/email-verification-step'
import { FreelancerProfileStep } from './steps/freelancer-profile-step'
import { RoleSelectionStep } from './steps/role-selection-step'
import { SkillsSelectionStep } from './steps/skills-selection-step'
import type { UserRole } from '@/lib/validations'
import { $currentStep, $role, OnboardingGate, resetOnboarding } from '@/stores'
import { Badge, PageShell, Stack } from '@/ui'

const wizardSteps = {
	freelancer: ['Роль', 'Профиль', 'Навыки', 'Аккаунт', 'Проверка'],
	client: ['Роль', 'Профиль', 'Аккаунт', 'Проверка'],
}

export function OnboardingWizard() {
	const searchParams = useSearchParams()
	const roleFromQuery = getRoleFromQuery(searchParams.get('role'))

	useGate(OnboardingGate, {
		initialRole: roleFromQuery,
	})

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
		<PageShell preset="wide" spacing="md">
			<div className="bg-surface border rounded-xl p-4 md:p-8">
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

function getRoleFromQuery(roleParam: string | null): UserRole | null {
	if (roleParam === 'freelancer' || roleParam === 'client') {
		return roleParam
	}

	return null
}
