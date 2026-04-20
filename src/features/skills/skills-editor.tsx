'use client'

import { useGate, useUnit } from 'effector-react'
import {
	$isBusy,
	$isLoading,
	$isSaving,
	$skills,
	FreelancerSkillsGate,
	skillsSaved,
	skillsUpdated,
} from './model'
import { Button, Stack, TextField, TS } from '@/ui'

export function AccountSkillsEditor() {
	useGate(FreelancerSkillsGate)

	const [
		{ specialization, hourlyRate, availability, experience },
		isBusy,
		isLoading,
		isSaving,
		onUpdate,
		onSave,
	] = useUnit([$skills, $isBusy, $isLoading, $isSaving, skillsUpdated, skillsSaved])

	return (
		<Stack vertical align="stretch">
			<TS clean variant="h3" gutterBottom content="Skills & Experience" />
			<Stack vertical gap={4} className="mb-4">
				<TextField
					label="Специализация"
					value={specialization}
					onChange={(e) => onUpdate({ specialization: e.target.value })}
					helper="Например: AI Consultant, ML Engineer"
				/>
				<TextField
					label="Ставка ($/час)"
					value={hourlyRate}
					onChange={(e) => onUpdate({ hourlyRate: e.target.value })}
					inputMode="numeric"
				/>
				<TextField
					label="Доступность"
					value={availability}
					onChange={(e) => onUpdate({ availability: e.target.value })}
					helper="Например: 10-20 hrs/week"
				/>
				<TextField
					label="Опыт"
					multiline
					rows={4}
					value={experience}
					onChange={(e) => onUpdate({ experience: e.target.value })}
				/>
			</Stack>

			<Button
				size="lg"
				label={isSaving ? 'Сохраняем...' : isLoading ? 'Загружаем...' : 'Сохранить профиль'}
				onClick={() => onSave()}
				disabled={isBusy}
				className="self-end"
			/>
		</Stack>
	)
}
