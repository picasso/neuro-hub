'use client'

import Autocomplete from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useUnit } from 'effector-react'
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
				<Typography variant="h5" gutterBottom>
					Расскажите о себе
				</Typography>
				<Typography variant="body2" color="text.secondary">
					Эта информация поможет заказчикам найти вас
				</Typography>
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

				<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
					<Button variant="outlined" size="large" onClick={onPrevStep}>
						Назад
					</Button>
					<Button
						variant="contained"
						size="large"
						onClick={onValidate}
						disabled={!isValid}
					>
						Продолжить
					</Button>
				</Box>
			</Box>
		</Box>
	)
}
