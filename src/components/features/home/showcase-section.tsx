'use client'

import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import { map, toUpper } from 'lodash'
import type { ReactElement } from 'react'
import { Icon } from '@/components/ui/icon'
import { TS } from '@/components/ui/text-styled'
import { showcaseContent } from '@/config/mocks'

type CategoryConfig = {
	icon: ReactElement
	gradient: string
	chipColor: string
	quoteBg: string
}

const categoryConfig: Record<string, CategoryConfig> = {
	'Генерация текста': {
		icon: <Icon name="article" sx={{ fontSize: 20 }} />,
		gradient: 'linear-gradient(90deg, #5a4fcf 0%, #a78bfa 100%)',
		chipColor: '#667eea',
		quoteBg: 'rgba(102, 126, 234, 0.1)',
	},
	'Генерация изображений': {
		icon: <Icon name="image" sx={{ fontSize: 20 }} />,
		gradient: 'linear-gradient(90deg, #db2777 0%, #f9a8d4 100%)',
		chipColor: '#f093fb',
		quoteBg: 'rgba(240, 147, 251, 0.1)',
	},
	'Генерация видео': {
		icon: <Icon name="video-library" sx={{ fontSize: 20 }} />,
		gradient: 'linear-gradient(90deg, #0891b2 0%, #67e8f9 100%)',
		chipColor: '#4facfe',
		quoteBg: 'rgba(79, 172, 254, 0.1)',
	},
}

type CaseCardProps = {
	category: string
	title: string
	description: string
	result: string
	feedback: string
	client: string
}

function CaseCard({ category, title, description, result, feedback, client }: CaseCardProps) {
	const config = categoryConfig[category] || categoryConfig['Генерация текста']
	const clientInitial = toUpper(client.charAt(0))

	return (
		<Card
			elevation={0}
			sx={{
				height: 1,
				display: 'flex',
				flexDirection: 'column',
				border: 1,
				borderColor: 'divider',
				transition: 'all 0.3s',
				overflow: 'hidden',
				'&:hover': {
					boxShadow: 6,
					transform: 'translateY(-4px)',
				},
			}}
		>
			<Box
				sx={{
					background: config.gradient,
					p: 2,
					display: 'flex',
					alignItems: 'center',
					gap: 1,
				}}
			>
				<Chip
					icon={config.icon}
					label={category}
					size="small"
					sx={{
						bgcolor: 'transparent',
						border: 'none',
						color: 'white',
						fontWeight: 600,
						'& .MuiChip-icon': {
							color: 'white',
						},
					}}
				/>
			</Box>

			<CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 3 }}>
				<TS variant="h5" gutterBottom fontWeight={700} sx={{ mb: 2 }} content={title} />

				<TS variant="body2" color="text.secondary" sx={{ mb: 2 }} content={description} />

				<Box sx={{ display: 'flex', gap: 1.5, mb: 2, alignItems: 'flex-start' }}>
					<Icon
						name="check-circle"
						sx={{ fontSize: 20, color: '#10b981', mt: 0.5, flexShrink: 0 }}
					/>
					<Box>
						<TS
							variant="body2"
							fontWeight={600}
							color="#10b981"
							gutterBottom
							content="Результат:"
						/>
						<TS variant="body2" color="text.secondary" content={result} />
					</Box>
				</Box>

				<Box
					sx={{
						mt: 'auto',
						pt: 0,
					}}
				>
					<Box
						sx={{
							bgcolor: config.quoteBg,
							p: 2,
							borderRadius: 2,
						}}
					>
						<Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1.5 }}>
							<Icon
								name="format-quote"
								sx={{
									fontSize: 20,
									color: config.chipColor,
									mt: 0.5,
									flexShrink: 0,
								}}
							/>
							<TS
								variant="body2"
								fontStyle="italic"
								color="text.secondary"
								content={feedback}
							/>
						</Box>
						<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
							<Avatar
								sx={{
									width: 32,
									height: 32,
									bgcolor: config.chipColor,
									fontSize: 14,
									fontWeight: 700,
								}}
							>
								{clientInitial}
							</Avatar>
							<TS
								variant="caption"
								color="text.secondary"
								fontWeight={600}
								content={client}
							/>
						</Box>
					</Box>
				</Box>
			</CardContent>
		</Card>
	)
}

export function ShowcaseSection() {
	return (
		<Box sx={{ py: 8, bgcolor: 'background.paper' }}>
			<Container maxWidth="lg">
				<TS
					variant="h3"
					component="h2"
					align="center"
					gutterBottom
					fontWeight={700}
					content={showcaseContent.title}
					sx={{ fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }, mb: 2 }}
				/>
				<TS
					variant="h6"
					align="center"
					color="text.secondary"
					content={showcaseContent.subtitle}
					sx={{ mb: 6, fontWeight: 400 }}
				/>

				<Grid container spacing={4}>
					{map(showcaseContent.cases, (caseItem) => (
						<Grid size={{ xs: 12, md: 4 }} key={caseItem.id}>
							<CaseCard
								category={caseItem.category}
								title={caseItem.title}
								description={caseItem.description}
								result={caseItem.result}
								feedback={caseItem.feedback}
								client={caseItem.client}
							/>
						</Grid>
					))}
				</Grid>
			</Container>
		</Box>
	)
}
