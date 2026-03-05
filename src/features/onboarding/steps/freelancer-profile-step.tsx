'use client'

import { useUnit } from 'effector-react'
import {
	$profileData,
	$profileErrors,
	prevStep,
	updateProfileField,
	validateAndContinue,
} from '@/stores/onboarding'
import { Button, ComboboxSimple, Stack, TextField, TS } from '@/ui'

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
		<div>
			<div className="mb-8 text-center">
				<TS variant="h5" gutterBottom content="Расскажите о себе" />
				<TS
					variant="body"
					color="secondary"
					className="text-sm"
					content="Эта информация поможет заказчикам найти вас"
				/>
			</div>

			<Stack vertical gap={4} className="max-w-xl mx-auto">
				<TextField
					label="Ваше имя"
					required
					value={isFreelancer ? profileData.name : ''}
					onChange={(e) =>
						onUpdateField({ kind: 'freelancer', field: 'name', value: e.target.value })
					}
					error={profileErrors.name}
				/>

				<ComboboxSimple
					items={specializationOptions}
					value={isFreelancer ? profileData.specialization || '' : ''}
					onValueChange={(newValue) =>
						onUpdateField({
							kind: 'freelancer',
							field: 'specialization',
							value: newValue || '',
						})
					}
					label="Специализация"
					helper="Необязательно"
				/>

				<TextField
					label="О себе"
					multiline
					rows={4}
					value={isFreelancer ? profileData.bio || '' : ''}
					onChange={(e) =>
						onUpdateField({ kind: 'freelancer', field: 'bio', value: e.target.value })
					}
					error={profileErrors.bio}
					helper={`${isFreelancer ? (profileData.bio || '').length : 0}/500 символов (необязательно)`}
					maxLength={500}
				/>

				<Stack justify="space-between">
					<Button variant="outline" size="lg" onClick={onPrevStep} label="Назад" />
					<Button size="lg" onClick={onValidate} disabled={!isValid} label="Продолжить" />
				</Stack>
			</Stack>
		</div>
	)
}
