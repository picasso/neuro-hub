'use client'

import { useUnit } from 'effector-react'
import { useState } from 'react'
import {
	$onboardingCredentials as $credentials,
	$credentialsErrors,
	prevStep,
	registerUserFx,
	submitRegistration,
	updateCredentialField,
} from '@/stores'
import { Button, Stack, TextField, TS } from '@/ui'

export function CredentialsStep() {
	const [credentials, credentialsErrors, isRegistering, onPrevStep, onUpdateField, onSubmit] =
		useUnit([
			$credentials,
			$credentialsErrors,
			registerUserFx.pending,
			prevStep,
			updateCredentialField,
			submitRegistration,
		])

	const [showPassword, setShowPassword] = useState(false)
	const isValid = credentials?.email && credentials?.password && !isRegistering

	return (
		<div>
			<div className="mb-8 text-center">
				<TS variant="h5" gutterBottom content="Создайте аккаунт" />
				<TS
					variant="body"
					color="secondary"
					className="text-sm"
					content="Введите email и придумайте надежный пароль"
				/>
			</div>

			<Stack vertical gap={4} className="max-w-125 mx-auto">
				<TextField
					label="Email"
					type="email"
					value={credentials?.email || ''}
					onChange={(e) => onUpdateField({ field: 'email', value: e.target.value })}
					error={credentialsErrors.email}
				/>

				<TextField
					label="Пароль"
					type={showPassword ? 'text' : 'password'}
					value={credentials?.password ?? ''}
					onChange={(e) => onUpdateField({ field: 'password', value: e.target.value })}
					error={credentialsErrors.password}
					helper="Минимум 8 символов"
					endIcon={showPassword ? 'eye-off' : 'eye'}
					onEndClick={() => setShowPassword(!showPassword)}
				/>

				<Stack justify="space-between">
					<Button variant="outline" size="lg" onClick={onPrevStep} label="Назад" />
					<Button
						size="lg"
						onClick={onSubmit}
						disabled={!isValid}
						label={isRegistering ? 'Регистрация...' : 'Продолжить'}
					/>
				</Stack>
			</Stack>
		</div>
	)
}
