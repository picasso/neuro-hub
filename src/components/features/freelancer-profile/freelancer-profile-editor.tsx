'use client'

import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import { useGate, useUnit } from 'effector-react'
import { Button } from '@/components/ui/button'
import { TS } from '@/components/ui/text-styled'
import {
	$form,
	$isBusy,
	FreelancerProfileGate,
	profileFormUpdated,
	saveFreelancerProfileClicked,
} from '@/stores/freelancer-profile'

export function FreelancerProfileEditor() {
	useGate(FreelancerProfileGate)

	const [form, isBusy, onFormUpdated, onSave] = useUnit([
		$form,
		$isBusy,
		profileFormUpdated,
		saveFreelancerProfileClicked,
	])

	return (
		<Box>
			<TS variant="h5" gutterBottom content="Профиль фрилансера" />
			<TS
				variant="body2"
				color="text.secondary"
				content="Эти данные видны на публичной странице профиля."
				sx={{ mb: 3 }}
			/>

			<Stack spacing={2} sx={{ mb: 2 }}>
				<TextField
					label="Специализация"
					fullWidth
					value={form.specialization}
					onChange={(e) => onFormUpdated({ specialization: e.target.value })}
					helperText="Например: AI Consultant, ML Engineer"
				/>
				<TextField
					label="Ставка ($/час)"
					fullWidth
					value={form.hourlyRate}
					onChange={(e) => onFormUpdated({ hourlyRate: e.target.value })}
					inputMode="numeric"
				/>
				<TextField
					label="Доступность"
					fullWidth
					value={form.availability}
					onChange={(e) => onFormUpdated({ availability: e.target.value })}
					helperText="Например: 10-20 hrs/week"
				/>
				<TextField
					label="Опыт"
					fullWidth
					multiline
					minRows={4}
					value={form.experience}
					onChange={(e) => onFormUpdated({ experience: e.target.value })}
				/>
			</Stack>

			<Button
				variant="contained"
				size="large"
				label={isBusy ? 'Сохраняем...' : 'Сохранить профиль'}
				onClick={() => onSave()}
				disabled={isBusy}
			/>
		</Box>
	)
}
