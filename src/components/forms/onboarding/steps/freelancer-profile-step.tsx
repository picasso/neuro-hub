'use client'

import Autocomplete from '@mui/material/Autocomplete'
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

const specializationOptions = [
	'AI Developer',
	'Prompt Engineer',
	'ML Engineer',
	'Data Scientist',
	'Computer Vision Engineer',
	'NLP Engineer',
	'AI Consultant',
	'AI Product Manager',
]

export function FreelancerProfileStep() {
	const [profileData, profileErrors, onPrevStep, onUpdateField, onValidate] = useUnit([
		$profileData,
		$profileErrors,
		prevStep,
		updateProfileField,
		validateAndContinue,
	])

	const isFreelancer = profileData?.kind === 'freelancer'
	const isValid = isFreelancer && profileData.name && !profileErrors.name && !profileErrors.bio

	return (
		<Box>
			<Box sx={{ mb: 4, textAlign: 'center' }}>
				<TS variant="h5" gutterBottom content="Расскажите о себе" />
				<TS
					variant="body2"
					color="text.secondary"
					content="Эта информация поможет заказчикам найти вас"
				/>
			</Box>

			<Box sx={{ maxWidth: 600, mx: 'auto' }}>
				<TextField
					label="Ваше имя"
					fullWidth
					required
					value={isFreelancer ? profileData.name : ''}
					onChange={(e) =>
						onUpdateField({ kind: 'freelancer', field: 'name', value: e.target.value })
					}
					error={!!profileErrors.name}
					helperText={profileErrors.name}
					sx={{ mb: 3 }}
				/>

				<Autocomplete
					options={specializationOptions}
					value={isFreelancer ? profileData.specialization || null : null}
					onChange={(_, newValue) =>
						onUpdateField({
							kind: 'freelancer',
							field: 'specialization',
							value: newValue || '',
						})
					}
					renderInput={(params) => (
						<TextField {...params} label="Специализация" helperText="Необязательно" />
					)}
					sx={{ mb: 3 }}
				/>

				<TextField
					label="О себе"
					fullWidth
					multiline
					rows={4}
					value={isFreelancer ? profileData.bio || '' : ''}
					onChange={(e) =>
						onUpdateField({ kind: 'freelancer', field: 'bio', value: e.target.value })
					}
					error={!!profileErrors.bio}
					helperText={
						profileErrors.bio ||
						`${isFreelancer ? (profileData.bio || '').length : 0}/500 символов (необязательно)`
					}
					slotProps={{ htmlInput: { maxLength: 500 } }}
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
