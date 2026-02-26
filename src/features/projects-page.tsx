import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import { Button } from '@/ui/button'
import { TS } from '@/ui/text-styled'

export function ProjectsPage() {
	return (
		<Container maxWidth="md">
			<Box sx={{ mt: 8, mb: 8, textAlign: 'center' }}>
				<TS variant="h3" gutterBottom content="Проекты" />
				<TS
					variant="body"
					color="secondary"
					className="mb-8"
					content="Эта страница в разработке"
				/>
				<Button href="/" label="На главную" />
			</Box>
		</Container>
	)
}
