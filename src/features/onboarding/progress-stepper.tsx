'use client'

import { useUnit } from 'effector-react'
import { $currentStep } from '@/stores/onboarding'
import { Stepper, TS } from '@/ui'

type ProgressStepperProps = {
	steps: string[]
}

export function ProgressStepper({ steps }: ProgressStepperProps) {
	const currentStep = useUnit($currentStep)
	return (
		<div className="w-full mb-4">
			<Stepper activeStep={currentStep} items={steps} align="center" fullWidth />

			<div className="mt-4 text-center">
				<TS
					variant="caption"
					color="dimmed"
					content={`Шаг ${currentStep} из ${steps.length}`}
				/>
			</div>
		</div>
	)
}
