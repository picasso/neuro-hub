'use client'

import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import { useUnit } from 'effector-react'
import { Button } from '@/components/ui/button'
import { TS } from '@/components/ui/text-styled'
import {
	$profileData,
	$profileErrors,
	prevStep,
	updateProfileField,
	validateAndContinue,
} from '@/stores/onboarding'

export function ClientProfileStep() {
	const [profileData, profileErrors, onPrevStep, onUpdateField, onValidate] = useUnit([
		$profileData,
		$profileErrors,
		prevStep,
		updateProfileField,
		validateAndContinue,
	])

	const isClient = profileData?.kind === 'client'
	const isValid =
		isClient &&
		profileData.name &&
		profileData.companyName &&
		!profileErrors.name &&
		!profileErrors.companyName

	return (
		<Box>
			<Box sx={{ mb: 4, textAlign: 'center' }}>
				<TS variant="h5" gutterBottom content="Информация о компании" />
				<TS
					variant="body"
					color="secondary"
					className="text-sm"
					content="Расскажите о вашей компании и вашей роли"
				/>
			</Box>

			<Box sx={{ maxWidth: 600, mx: 'auto' }}>
				<TextField
					label="Ваше имя"
					fullWidth
					required
					value={isClient ? profileData.name : ''}
					onChange={(e) =>
						onUpdateField({ kind: 'client', field: 'name', value: e.target.value })
					}
					error={!!profileErrors.name}
					helperText={profileErrors.name}
					sx={{ mb: 3 }}
				/>

				<TextField
					label="Название компании"
					fullWidth
					required
					value={isClient ? profileData.companyName : ''}
					onChange={(e) =>
						onUpdateField({
							kind: 'client',
							field: 'companyName',
							value: e.target.value,
						})
					}
					error={!!profileErrors.companyName}
					helperText={profileErrors.companyName}
					sx={{ mb: 3 }}
				/>

				<TextField
					label="Ваша роль в компании"
					fullWidth
					value={isClient ? profileData.companyRole || '' : ''}
					onChange={(e) =>
						onUpdateField({
							kind: 'client',
							field: 'companyRole',
							value: e.target.value,
						})
					}
					helperText="Например: CEO, CTO, Product Manager (необязательно)"
					sx={{ mb: 4 }}
				/>

				<Stack direction="row" justifyContent="space-between">
					<Button variant="outline" size="lg" onClick={onPrevStep} label="Назад" />
					<Button size="lg" onClick={onValidate} disabled={!isValid} label="Продолжить" />
				</Stack>
			</Box>
		</Box>
	)
}
