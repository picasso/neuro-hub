import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import { Button } from '@/components/ui/button'
import { TS } from '@/components/ui/text-styled'

export { howItWorksMetadata as metadata } from '@/config/metadata'

export default function HowItWorksPage() {
	return (
		<Container maxWidth="md">
			<Box sx={{ mt: 8, mb: 8, textAlign: 'center' }}>
				<TS variant="h3" gutterBottom content="Как это работает" />
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
