'use client'

import Box from '@mui/material/Box'
import Checkbox from '@mui/material/Checkbox'
import Container from '@mui/material/Container'
import FormControlLabel from '@mui/material/FormControlLabel'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import { useGate, useUnit } from 'effector-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button, TS } from '@/components/ui'
import {
	$canSubmit,
	$credentials,
	$isLoading,
	LoginGate,
	signInFx,
	toggledRememberMe,
	updatedEmail,
	updatedPassword,
} from '@/stores/auth-login'

export function LoginForm() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const next = searchParams.get('next') || '/dashboard'

	useGate(LoginGate, { callbackURL: next })

	const [credentials, isLoading, canSubmit] = useUnit([$credentials, $isLoading, $canSubmit])
	const [onUpdatedEmail, onUpdatedPassword, onToggleRemember, onSignIn] = useUnit([
		updatedEmail,
		updatedPassword,
		toggledRememberMe,
		signInFx,
	])

	return (
		<Container maxWidth="md">
			<Box sx={{ mt: 8, mb: 8, textAlign: 'center' }}>
				<TS variant="h3" gutterBottom content="Вход" />
				<TS
					variant="body1"
					color="text.secondary"
					sx={{ mb: 4 }}
					content="Войдите, чтобы управлять профилем и портфолио"
				/>

				<Box sx={{ maxWidth: 520, mx: 'auto', textAlign: 'left' }}>
					<TextField
						label="Email"
						fullWidth
						value={credentials.email}
						onChange={(e) => onUpdatedEmail(e.target.value)}
						sx={{ mb: 2 }}
					/>
					<TextField
						label="Пароль"
						type="password"
						fullWidth
						value={credentials.password}
						onChange={(e) => onUpdatedPassword(e.target.value)}
						sx={{ mb: 2 }}
					/>

					<FormControlLabel
						control={
							<Checkbox
								checked={credentials.rememberMe}
								onChange={() => onToggleRemember()}
							/>
						}
						label="Запомнить меня"
						sx={{ mb: 3 }}
					/>

					<Stack direction="row" spacing={2} justifyContent="space-between">
						<Button
							variant="outline"
							onClick={() => router.push('/signup' as never)}
							label="Создать аккаунт"
						/>
						<Button
							disabled={!canSubmit || isLoading}
							onClick={async () => {
								try {
									await onSignIn(credentials)
									router.push(next as never)
								} catch {
									// handled by signInFx + alerts
								}
							}}
							label={isLoading ? 'Авторизация...' : 'Войти'}
						/>
					</Stack>

					<Box sx={{ mt: 3, textAlign: 'center' }}>
						<Button variant="ghost" href="/" label="На главную" />
					</Box>
				</Box>
			</Box>
		</Container>
	)
}
