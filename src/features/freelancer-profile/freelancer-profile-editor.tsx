'use client'

import { useGate, useUnit } from 'effector-react'
import {
	$freelancerProfileForm as $form,
	$freelancerProfileIsBusy as $isBusy,
	$freelancerProfileIsLoading as $isLoading,
	$freelancerProfileIsSaving as $isSaving,
	FreelancerProfileGate,
	profileFormUpdated,
	saveFreelancerProfileClicked,
} from '@/stores'
import { Button, Stack, TextField, TS } from '@/ui'

export function FreelancerProfileEditor() {
	useGate(FreelancerProfileGate)

	const [form, isBusy, isLoading, isSaving, onFormUpdated, onSave] = useUnit([
		$form,
		$isBusy,
		$isLoading,
		$isSaving,
		profileFormUpdated,
		saveFreelancerProfileClicked,
	])

	return (
		<div>
			<TS variant="h5" gutterBottom content="Профиль фрилансера" />
			<TS
				variant="body"
				color="secondary"
				className="text-sm mb-6"
				content="Эти данные видны на публичной странице профиля."
			/>

			<Stack vertical gap={4} className="mb-4">
				<TextField
					label="Специализация"
					value={form.specialization}
					onChange={(e) => onFormUpdated({ specialization: e.target.value })}
					helper="Например: AI Consultant, ML Engineer"
				/>
				<TextField
					label="Ставка ($/час)"
					value={form.hourlyRate}
					onChange={(e) => onFormUpdated({ hourlyRate: e.target.value })}
					inputMode="numeric"
				/>
				<TextField
					label="Доступность"
					value={form.availability}
					onChange={(e) => onFormUpdated({ availability: e.target.value })}
					helper="Например: 10-20 hrs/week"
				/>
				<TextField
					label="Опыт"
					multiline
					rows={4}
					value={form.experience}
					onChange={(e) => onFormUpdated({ experience: e.target.value })}
				/>
			</Stack>

			<Button
				size="lg"
				label={isSaving ? 'Сохраняем...' : isLoading ? 'Загружаем...' : 'Сохранить профиль'}
				onClick={() => onSave()}
				disabled={isBusy}
			/>
		</div>
	)
}
