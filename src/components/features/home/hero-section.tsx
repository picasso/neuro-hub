'use client'

import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { TS } from '@/components/ui/text-styled'
import { heroContent } from '@/config/mocks'

export function HeroSection() {
	return (
		<Box
			sx={{
				background: 'linear-gradient(135deg, #169e5f 0%, #764ba2 100%)',
				py: { xs: 8, md: 12 },
				textAlign: 'center',
			}}
		>
			<Container maxWidth="md">
				<TS
					variant="h2"
					component="h1"
					gutterBottom
					color="contrast"
					content={heroContent.title}
					sx={{
						fontWeight: 800,
						fontSize: { xs: '2.5rem', md: '3.5rem' },
					}}
				/>

				<TS
					variant="h5"
					color="contrast"
					content={heroContent.subtitle}
					sx={{
						fontSize: { xs: '1.25rem', sm: '1.5rem' },
						mb: 2,
						fontWeight: 500,
						opacity: 0.95,
					}}
				/>

				<TS
					variant="body1"
					color="contrast"
					content={heroContent.description}
					sx={{
						mb: 4,
						fontSize: { xs: '1rem', sm: '1.1rem' },
						opacity: 0.9,
						maxWidth: 600,
						mx: 'auto',
					}}
				/>

				<Stack
					direction={{ xs: 'column', sm: 'row' }}
					spacing={2}
					justifyContent="center"
					sx={{ mb: 3 }}
				>
					<Button
						component={Link}
						href="/signup?role=freelancer"
						variant="contained"
						size="large"
						leftIcon="work"
						iconOptions={{ color: 'primary' }}
						label={heroContent.ctaFreelancer}
						sx={{
							bgcolor: 'white',
							color: 'primary.main',
							px: 4,
							py: 1.5,
							fontSize: '1.1rem',
							fontWeight: 600,
							'&:hover': {
								bgcolor: 'grey.100',
							},
						}}
					/>

					<Button
						component={Link}
						href="/signup?role=client"
						variant="outlined"
						color="contrast"
						size="large"
						leftIcon="business"
						iconOptions={{ color: 'contrast' }}
						label={heroContent.ctaClient}
						sx={{
							px: 4,
							py: 1.5,
							fontSize: '1.1rem',
							fontWeight: 600,
							'&:hover': {
								bgcolor: 'rgba(255, 255, 255, 0.1)',
							},
						}}
					/>
				</Stack>

				<Button
					component={Link}
					href="/login"
					color="contrast"
					leftIcon="login"
					iconOptions={{ color: 'contrast' }}
					label={heroContent.ctaLogin}
					sx={{
						textDecoration: 'underline',
						'&:hover': {
							textDecoration: 'underline',
							bgcolor: 'transparent',
						},
					}}
				/>
			</Container>
		</Box>
	)
}
