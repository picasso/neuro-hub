import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import { Button } from '@/components/ui/button'
import { TS } from '@/components/ui/text-styled'

export { postProjectMetadata as metadata } from '@/config/metadata'

export default function PostProjectPage() {
	return (
		<Container maxWidth="md">
			<Box sx={{ mt: 8, mb: 8, textAlign: 'center' }}>
				<TS variant="h3" gutterBottom content="Разместить проект" />
				<TS
					variant="body1"
					color="text.secondary"
					sx={{ mb: 4 }}
					content="Эта страница в разработке"
				/>
				<Button variant="contained" href="/">
					На главную
				</Button>
			</Box>
		</Container>
	)
}
