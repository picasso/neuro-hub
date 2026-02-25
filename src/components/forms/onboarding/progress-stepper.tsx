'use client'

import Box from '@mui/material/Box'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Stepper from '@mui/material/Stepper'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useUnit } from 'effector-react'
import { map } from 'lodash'
import { TS } from '@/components/ui/text-styled'
import { $currentStep } from '@/stores/onboarding'

type ProgressStepperProps = {
	steps: string[]
}

export function ProgressStepper({ steps }: ProgressStepperProps) {
	const theme = useTheme()
	const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
	const currentStep = useUnit($currentStep)

	const activeStep = currentStep - 1

	return (
		<Box sx={{ width: 1, mb: 4 }}>
			<Stepper activeStep={activeStep} alternativeLabel={!isMobile}>
				{map(steps, (label) => (
					<Step key={label}>
						<StepLabel>
							{isMobile ? (
								<TS variant="caption" content={label} />
							) : (
								<TS variant="body" className="text-sm" content={label} />
							)}
						</StepLabel>
					</Step>
				))}
			</Stepper>
			{isMobile && (
				<Box sx={{ mt: 2, textAlign: 'center' }}>
					<TS
						variant="body"
						color="secondary"
						className="text-sm"
						content={`Шаг ${currentStep} из ${steps.length}`}
					/>
				</Box>
			)}
		</Box>
	)
}
