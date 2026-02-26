'use client'

import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import { useUnit } from 'effector-react'
import { useRouter } from 'next/navigation'
import { $credentials, setCurrentStep } from '@/stores/onboarding'
import { Button } from '@/ui/button'
import { Icon } from '@/ui/icon'
import { TS } from '@/ui/text-styled'

export function EmailVerificationStep() {
	const credentials = useUnit($credentials)
	const router = useRouter()

	return (
		<Box>
			<Box sx={{ mb: 4, textAlign: 'center' }}>
				<Box
					sx={{
						width: 80,
						height: 80,
						borderRadius: '50%',
						bgcolor: 'primary.main',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						mx: 'auto',
						mb: 3,
					}}
				>
					<Icon name="email" size={40} color="contrast" />
				</Box>

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
			</Box>

			<Box sx={{ maxWidth: 500, mx: 'auto' }}>
				<Alert severity="info" sx={{ mb: 4 }}>
					<TS variant="body" className="text-sm">
						Проверьте почту и перейдите по ссылке в письме для подтверждения вашего
						аккаунта. Если письмо не пришло, проверьте папку "Спам".
					</TS>
				</Alert>

				<Stack spacing={2}>
					<Button
						size="lg"
						onClick={() => router.push('/dashboard' as never)}
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
			</Box>
		</Box>
	)
}
