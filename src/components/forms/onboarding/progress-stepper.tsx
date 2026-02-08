'use client'

import Box from '@mui/material/Box'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Stepper from '@mui/material/Stepper'
import { useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useUnit } from 'effector-react'
import { map } from 'lodash'
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
								<Typography variant="caption">{label}</Typography>
							) : (
								<Typography variant="body2">{label}</Typography>
							)}
						</StepLabel>
					</Step>
				))}
			</Stepper>
			{isMobile && (
				<Box sx={{ mt: 2, textAlign: 'center' }}>
					<Typography variant="body2" color="text.secondary">
						Шаг {currentStep} из {steps.length}
					</Typography>
				</Box>
			)}
		</Box>
	)
}
