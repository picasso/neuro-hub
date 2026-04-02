'use client'

import { useUnit } from 'effector-react'
import {
	$profileData,
	$profileErrors,
	prevStep,
	updateProfileField,
	validateAndContinue,
} from '@/stores'
import { Button, Stack, TextField, TS } from '@/ui'

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
		<div>
			<div className="mb-8 text-center">
				<TS variant="h5" gutterBottom content="Информация о компании" />
				<TS
					variant="body"
					color="secondary"
					className="text-sm"
					content="Расскажите о вашей компании и вашей роли"
				/>
			</div>

			<Stack vertical gap={4} className="max-w-xl mx-auto">
				<TextField
					label="Ваше имя"
					required
					value={isClient ? profileData.name : ''}
					onChange={(e) =>
						onUpdateField({ kind: 'client', field: 'name', value: e.target.value })
					}
					error={profileErrors.name}
				/>

				<TextField
					label="Название компании"
					required
					value={isClient ? profileData.companyName : ''}
					onChange={(e) =>
						onUpdateField({
							kind: 'client',
							field: 'companyName',
							value: e.target.value,
						})
					}
					error={profileErrors.companyName}
				/>

				<TextField
					label="Ваша роль в компании"
					value={isClient ? profileData.companyRole || '' : ''}
					onChange={(e) =>
						onUpdateField({
							kind: 'client',
							field: 'companyRole',
							value: e.target.value,
						})
					}
					helper="Например: CEO, CTO, Product Manager (необязательно)"
				/>

				<Stack justify="space-between">
					<Button variant="outline" size="lg" onClick={onPrevStep} label="Назад" />
					<Button size="lg" onClick={onValidate} disabled={!isValid} label="Продолжить" />
				</Stack>
			</Stack>
		</div>
	)
}
