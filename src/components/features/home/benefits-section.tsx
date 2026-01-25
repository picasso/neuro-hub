'use client'

import CodeIcon from '@mui/icons-material/Code'
import GroupsIcon from '@mui/icons-material/Groups'
import SearchIcon from '@mui/icons-material/Search'
import StarIcon from '@mui/icons-material/Star'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import VerifiedIcon from '@mui/icons-material/Verified'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import VisibilityIcon from '@mui/icons-material/Visibility'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import type { ReactNode } from 'react'
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

const freelancerIcons = [GroupsIcon, StarIcon, CodeIcon, VerifiedIcon]
const clientIcons = [VerifiedUserIcon, VisibilityIcon, ThumbUpIcon, SearchIcon]

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
					Почему выбирают NeuroHub
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
							{benefitsContent.freelancers.items.map((item, index) => {
								const Icon = freelancerIcons[index]
								return (
									<Grid size={{ xs: 12, md: 6 }} key={item.title}>
										<BenefitCard
											icon={<Icon sx={{ fontSize: 32 }} />}
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
							{benefitsContent.clients.items.map((item, index) => {
								const Icon = clientIcons[index]
								return (
									<Grid size={{ xs: 12, md: 6 }} key={item.title}>
										<BenefitCard
											icon={<Icon sx={{ fontSize: 32 }} />}
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
