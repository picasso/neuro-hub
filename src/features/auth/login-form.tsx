'use client'

import { useGate, useUnit } from 'effector-react'
import { useRouter, useSearchParams } from 'next/navigation'
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
import { Button, Checkbox, PageShell, Stack, TextField, TS } from '@/ui'

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
		<PageShell preset="form">
			<div className="text-center">
				<TS variant="h3" gutterBottom content="Вход" />
				<TS
					variant="body"
					color="secondary"
					className="mb-8"
					content="Войдите, чтобы управлять профилем и портфолио"
				/>

				<div className="max-w-130 mx-auto text-left">
					<Stack vertical gap={4} className="mb-6">
						<TextField
							label="Email"
							value={credentials.email}
							onChange={(e) => onUpdatedEmail(e.target.value)}
						/>
						<TextField
							label="Пароль"
							type="password"
							value={credentials.password}
							onChange={(e) => onUpdatedPassword(e.target.value)}
						/>
					</Stack>

					<div className="mb-6">
						<Checkbox
							checked={credentials.rememberMe}
							onCheckedChange={() => onToggleRemember()}
							label="Запомнить меня"
						/>
					</div>

					<Stack gap={4} justify="space-between">
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

					<div className="mt-6 text-center">
						<Button variant="ghost" href="/" label="На главную" />
					</div>
				</div>
			</div>
		</PageShell>
	)
}
