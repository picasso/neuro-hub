'use client'

import BusinessIcon from '@mui/icons-material/Business'
import LoginIcon from '@mui/icons-material/Login'
import WorkIcon from '@mui/icons-material/Work'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Link from 'next/link'
import { heroContent } from '@/config/mocks'

export function HeroSection() {
	return (
		<Box
			sx={{
				background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
				color: 'white',
				py: { xs: 8, md: 12 },
				textAlign: 'center',
			}}
		>
			<Container maxWidth="md">
				<Typography
					variant="h2"
					component="h1"
					gutterBottom
					sx={{
						fontWeight: 800,
						fontSize: { xs: '2.5rem', md: '3.5rem' },
					}}
				>
					{heroContent.title}
				</Typography>

				<Typography
					variant="h5"
					sx={{
						fontSize: { xs: '1.25rem', sm: '1.5rem' },
						mb: 2,
						fontWeight: 500,
						opacity: 0.95,
					}}
				>
					{heroContent.subtitle}
				</Typography>

				<Typography
					variant="body1"
					sx={{
						mb: 4,
						fontSize: { xs: '1rem', sm: '1.1rem' },
						opacity: 0.9,
						maxWidth: 600,
						mx: 'auto',
					}}
				>
					{heroContent.description}
				</Typography>

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
						startIcon={<WorkIcon />}
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
					>
						{heroContent.ctaFreelancer}
					</Button>

					<Button
						component={Link}
						href="/signup?role=client"
						variant="outlined"
						size="large"
						startIcon={<BusinessIcon />}
						sx={{
							borderColor: 'white',
							color: 'white',
							px: 4,
							py: 1.5,
							fontSize: '1.1rem',
							fontWeight: 600,
							'&:hover': {
								borderColor: 'white',
								bgcolor: 'rgba(255, 255, 255, 0.1)',
							},
						}}
					>
						{heroContent.ctaClient}
					</Button>
				</Stack>

				<Button
					component={Link}
					href="/login"
					startIcon={<LoginIcon />}
					sx={{
						color: 'white',
						textDecoration: 'underline',
						'&:hover': {
							textDecoration: 'underline',
							bgcolor: 'transparent',
						},
					}}
				>
					{heroContent.ctaLogin}
				</Button>
			</Container>
		</Box>
	)
}
