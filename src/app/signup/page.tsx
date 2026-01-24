import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'

export { signupMetadata as metadata } from '@/config/metadata'

export default function SignupPage() {
	return (
		<Container maxWidth="md">
			<Box sx={{ mt: 8, mb: 8, textAlign: 'center' }}>
				<Typography variant="h3" gutterBottom>
					Регистрация
				</Typography>
				<Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
					Эта страница в разработке
				</Typography>
				<Button variant="contained" href="/">
					На главную
				</Button>
			</Box>
		</Container>
	)
}
