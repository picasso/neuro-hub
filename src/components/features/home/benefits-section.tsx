'use client'

import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { map } from 'lodash'
import type { ReactNode } from 'react'
import { Icon } from '@/components/ui/icon'
import { benefitsContent } from '@/config/mocks'

type BenefitCardProps = {
	icon: ReactNode
	title: string
	description: string
}

function BenefitCard({ icon, title, description }: BenefitCardProps) {
	return (
		<Paper
			elevation={0}
			sx={{
				p: 3,
				height: '100%',
				width: 1,
				display: 'flex',
				flexDirection: 'row',
				gap: 2,
				border: 1,
				borderColor: 'divider',
				transition: 'all 0.3s',
				'&:hover': {
					boxShadow: 3,
					borderColor: 'primary.main',
				},
			}}
		>
			<Box
				sx={{
					color: 'primary.main',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					width: 56,
					height: 56,
					flexShrink: 0,
					bgcolor: 'primary.light',
					borderRadius: 2,
				}}
			>
				{icon}
			</Box>
			<Box sx={{ display: 'flex', flexDirection: 'column' }}>
				<Typography variant="h6" gutterBottom fontWeight={600}>
					{title}
				</Typography>
				<Typography variant="body2" color="text.secondary">
					{description}
				</Typography>
			</Box>
		</Paper>
	)
}

const freelancerIcons = [
	<Icon name="groups" sx={{ fontSize: 32 }} />,
	<Icon name="star" sx={{ fontSize: 32 }} />,
	<Icon name="code" sx={{ fontSize: 32 }} />,
	<Icon name="verified" sx={{ fontSize: 32 }} />,
]
const clientIcons = [
	<Icon name="verified-user" sx={{ fontSize: 32 }} />,
	<Icon name="visibility" sx={{ fontSize: 32 }} />,
	<Icon name="thumb-up" sx={{ fontSize: 32 }} />,
	<Icon name="search" sx={{ fontSize: 32 }} />,
]

export function BenefitsSection() {
	return (
		<Box sx={{ py: 8, bgcolor: 'grey.50' }}>
			<Container maxWidth="lg">
				<Typography
					variant="h3"
					component="h2"
					align="center"
					gutterBottom
					fontWeight={700}
					sx={{ fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }, mb: 6 }}
				>
					Почему выбирают NeuroGig
				</Typography>

				<Grid container spacing={6}>
					<Grid size={{ xs: 12 }}>
						<Typography
							variant="h5"
							gutterBottom
							fontWeight={600}
							sx={{ mb: 3, color: 'primary.main' }}
						>
							{benefitsContent.freelancers.title}
						</Typography>
						<Grid container spacing={3} sx={{ width: 1 }}>
							{map(benefitsContent.freelancers.items, (item, index) => {
								return (
									<Grid size={{ xs: 12, md: 6 }} key={item.title}>
										<BenefitCard
											icon={freelancerIcons[index]}
											title={item.title}
											description={item.description}
										/>
									</Grid>
								)
							})}
						</Grid>
					</Grid>

					<Grid size={{ xs: 12 }}>
						<Typography
							variant="h5"
							gutterBottom
							fontWeight={600}
							sx={{ mb: 3, color: 'secondary.main' }}
						>
							{benefitsContent.clients.title}
						</Typography>
						<Grid container spacing={3} sx={{ width: 1 }}>
							{map(benefitsContent.clients.items, (item, index) => {
								return (
									<Grid size={{ xs: 12, md: 6 }} key={item.title}>
										<BenefitCard
											icon={clientIcons[index]}
											title={item.title}
											description={item.description}
										/>
									</Grid>
								)
							})}
						</Grid>
					</Grid>
				</Grid>
			</Container>
		</Box>
	)
}
