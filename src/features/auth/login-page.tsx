import CircularProgress from '@mui/material/CircularProgress'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import { Suspense } from 'react'
import { LoginForm } from './login-form'

export function LoginPage() {
	return (
		<Suspense
			fallback={
				<Container maxWidth="md">
					<Stack
						sx={{
							justifyContent: 'center',
							alignItems: 'center',
							minHeight: '60vh',
						}}
					>
						<CircularProgress />
					</Stack>
				</Container>
			}
		>
			<LoginForm />
		</Suspense>
	)
}
