'use client'

import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { useUnit } from 'effector-react'
import { useRouter } from 'next/navigation'
import { Icon } from '@/components/ui/icon'
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

				<Typography variant="h5" gutterBottom>
					Подтвердите email
				</Typography>
				<Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
					Мы отправили письмо на адрес:
				</Typography>
				<Typography variant="body1" fontWeight={600} sx={{ mb: 3 }}>
					{credentials?.email || 'ваш email'}
				</Typography>
			</Box>

			<Box sx={{ maxWidth: 500, mx: 'auto' }}>
				<Alert severity="info" sx={{ mb: 4 }}>
					<Typography variant="body2">
						Проверьте почту и перейдите по ссылке в письме для подтверждения вашего
						аккаунта. Если письмо не пришло, проверьте папку "Спам".
					</Typography>
				</Alert>

				<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
					<Button
						variant="contained"
						size="large"
						onClick={() => router.push('/dashboard' as never)}
						fullWidth
					>
						Готово
					</Button>
					<Button
						variant="outlined"
						size="large"
						onClick={() => setCurrentStep(2)}
						fullWidth
					>
						Изменить email
					</Button>
				</Box>
			</Box>
		</Box>
	)
}
