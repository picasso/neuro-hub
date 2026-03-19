'use client'

import { useUnit } from 'effector-react'
import { useRouter } from 'next/navigation'
import { $credentials, setCurrentStep } from '@/stores/onboarding'
import { Alert, Button, Icon, Stack, TS } from '@/ui'

export function EmailVerificationStep() {
	const credentials = useUnit($credentials)
	const router = useRouter()

	return (
		<div>
			<div className="mb-8 text-center">
				<div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center mx-auto mb-6">
					<Icon name="email" size={40} color="contrast" />
				</div>

				<TS variant="h5" gutterBottom content="Подтвердите email" />
				<TS
					variant="body"
					color="secondary"
					className="text-sm mb-4"
					content="Мы отправили письмо на адрес:"
				/>
				<TS
					variant="body"
					className="font-semibold mb-6"
					content={credentials?.email || 'ваш email'}
				/>
			</div>

			<div className="max-w-125 mx-auto">
				<Alert severity="info" className="mb-8">
					<TS variant="body" className="text-sm">
						Проверьте почту и перейдите по ссылке в письме для подтверждения вашего
						аккаунта. Если письмо не пришло, проверьте папку "Спам".
					</TS>
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
			</div>
		</div>
	)
}
