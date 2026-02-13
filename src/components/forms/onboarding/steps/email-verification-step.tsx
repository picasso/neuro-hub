'use client'

import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import { useUnit } from 'effector-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { TS } from '@/components/ui/text-styled'
import { $credentials, setCurrentStep } from '@/stores/onboarding'

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
					<Icon name="email" sx={{ fontSize: 40, color: 'white' }} />
				</Box>

				<TS variant="h5" gutterBottom content="Подтвердите email" />
				<TS
					variant="body2"
					color="text.secondary"
					sx={{ mb: 2 }}
					content="Мы отправили письмо на адрес:"
				/>
				<TS
					variant="body1"
					fontWeight={600}
					sx={{ mb: 3 }}
					content={credentials?.email || 'ваш email'}
				/>
			</Box>

			<Box sx={{ maxWidth: 500, mx: 'auto' }}>
				<Alert severity="info" sx={{ mb: 4 }}>
					<TS variant="body2">
						Проверьте почту и перейдите по ссылке в письме для подтверждения вашего
						аккаунта. Если письмо не пришло, проверьте папку "Спам".
					</TS>
				</Alert>

				<Stack spacing={2}>
					<Button
						variant="contained"
						size="large"
						onClick={() => router.push('/dashboard' as never)}
						fullWidth
						label="Готово"
					/>
					<Button
						variant="outlined"
						size="large"
						onClick={() => setCurrentStep(2)}
						fullWidth
						label="Изменить email"
					/>
				</Stack>
			</Box>
		</Box>
	)
}
