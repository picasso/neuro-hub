'use client'

import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import { useUnit } from 'effector-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { TS } from '@/components/ui/text-styled'
import {
	$credentials,
	$credentialsErrors,
	prevStep,
	registerUserFx,
	submitRegistration,
	updateCredentialField,
} from '@/stores/onboarding'

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
		<Box>
			<Box sx={{ mb: 4, textAlign: 'center' }}>
				<TS variant="h5" gutterBottom content="Создайте аккаунт" />
				<TS
					variant="body2"
					color="text.secondary"
					content="Введите email и придумайте надежный пароль"
				/>
			</Box>

			<Box sx={{ maxWidth: 500, mx: 'auto' }}>
				<TextField
					label="Email"
					type="email"
					fullWidth
					value={credentials?.email || ''}
					onChange={(e) => onUpdateField({ field: 'email', value: e.target.value })}
					error={!!credentialsErrors.email}
					helperText={credentialsErrors.email}
					sx={{ mb: 3 }}
				/>

				<TextField
					label="Пароль"
					type={showPassword ? 'text' : 'password'}
					fullWidth
					value={credentials?.password ?? ''}
					onChange={(e) => onUpdateField({ field: 'password', value: e.target.value })}
					error={!!credentialsErrors.password}
					helperText={credentialsErrors.password || 'Минимум 8 символов'}
					slotProps={{
						input: {
							endAdornment: (
								<InputAdornment position="end">
									<IconButton
										onClick={() => setShowPassword(!showPassword)}
										edge="end"
									>
										<Icon
											name={showPassword ? 'visibility-off' : 'visibility'}
										/>
									</IconButton>
								</InputAdornment>
							),
						},
					}}
					sx={{ mb: 4 }}
				/>

				<Stack direction="row" justifyContent="space-between">
					<Button variant="outlined" size="large" onClick={onPrevStep} label="Назад" />
					<Button
						variant="contained"
						size="large"
						onClick={onSubmit}
						disabled={!isValid}
						label={isRegistering ? 'Регистрация...' : 'Продолжить'}
					/>
				</Stack>
			</Box>
		</Box>
	)
}
