'use client'

import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import { map } from 'lodash'
import { Icon, type IconName } from '@/components/ui/icon'
import { TS } from '@/components/ui/text-styled'
import { benefitsContent } from '@/config/mocks'

type BenefitCardProps = {
	icon: IconName
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
				<Icon name={icon} size={32} color="contrast" />
			</Box>
			<Stack>
				<TS variant="h5" gutterBottom className="font-semibold" content={title} />
				<TS variant="body" color="secondary" className="text-sm" content={description} />
			</Stack>
		</Paper>
	)
}

const freelancerIcons: IconName[] = ['groups', 'star', 'code', 'verified']
const clientIcons: IconName[] = ['verified-user', 'visibility', 'thumb-up', 'search']

export function BenefitsSection() {
	return (
		<Box sx={{ py: 8, bgcolor: 'grey.50' }}>
			<Container maxWidth="lg">
				<TS
					variant="h3"
					strong
					className="text-center text-[2rem] sm:text-[2.5rem] md:text-[3rem] mb-12"
					content="Почему выбирают NeuroGig"
				/>

				<Grid container spacing={6}>
					<Grid size={{ xs: 12 }}>
						<TS
							variant="h5"
							gutterBottom
							className="font-semibold mb-6 text-primary"
							content={benefitsContent.freelancers.title}
						/>
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
						<TS
							variant="h5"
							gutterBottom
							className="font-semibold mb-6 text-secondary-foreground"
							content={benefitsContent.clients.title}
						/>
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
