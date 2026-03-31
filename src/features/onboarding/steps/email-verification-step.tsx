'use client'

import { useUnit } from 'effector-react'
import { useRouter } from 'next/navigation'
import { $credentials, setCurrentStep } from '@/stores/onboarding'
import { Alert, Button, Icon, Stack, TS } from '@/ui'

export function EmailVerificationStep() {
	const credentials = useUnit($credentials)
	const router = useRouter()

	return (
		<Stack vertical gap={8}>
			<Stack vertical align="center" gap={6} className="text-center">
				<Stack
					justify="center"
					align="center"
					className="mx-auto size-20 rounded-full bg-primary"
				>
					<Icon name="email" size={40} color="contrast" />
				</Stack>

				<TS variant="h5" gutterBottom content="Подтвердите email" />
				<TS
					variant="subtitle"
					color="secondary"
					gutterBottom
					content="Мы отправили письмо на адрес:"
				/>
				<TS
					variant="body"
					strong
					gutterBottom
					content={credentials?.email || 'ваш email'}
				/>
			</Stack>

			<Stack vertical gap={8} className="mx-auto max-w-125">
				<Alert severity="info" className="mb-8">
					<TS
						variant="subtitle"
						content={
							'Проверьте почту и перейдите по ссылке в письме для подтверждения вашего' +
							' аккаунта. Если письмо не пришло, проверьте папку "Спам".'
						}
					/>
				</Alert>

				<Stack vertical gap={4}>
					<Button
						size="lg"
						onClick={() => router.push('/account/dashboard')}
						fullWidth
						label="Готово"
					/>
					<Button
						variant="outline"
						size="lg"
						onClick={() => setCurrentStep(2)}
						fullWidth
						label="Изменить email"
					/>
				</Stack>
			</Stack>
		</Stack>
	)
}
