'use client'

import ArticleIcon from '@mui/icons-material/Article'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import FormatQuoteIcon from '@mui/icons-material/FormatQuote'
import ImageIcon from '@mui/icons-material/Image'
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import type { ReactElement } from 'react'
import { showcaseContent } from '@/config/mocks'

type CategoryConfig = {
	icon: ReactElement
	gradient: string
	chipColor: string
	quoteBg: string
}

const categoryConfig: Record<string, CategoryConfig> = {
	'Генерация текста': {
		icon: <ArticleIcon sx={{ fontSize: 20 }} />,
		gradient: 'linear-gradient(90deg, #5a4fcf 0%, #a78bfa 100%)',
		chipColor: '#667eea',
		quoteBg: 'rgba(102, 126, 234, 0.1)',
	},
	'Генерация изображений': {
		icon: <ImageIcon sx={{ fontSize: 20 }} />,
		gradient: 'linear-gradient(90deg, #db2777 0%, #f9a8d4 100%)',
		chipColor: '#f093fb',
		quoteBg: 'rgba(240, 147, 251, 0.1)',
	},
	'Генерация видео': {
		icon: <VideoLibraryIcon sx={{ fontSize: 20 }} />,
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
	const clientInitial = client.charAt(0).toUpperCase()

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
				<Typography variant="h5" gutterBottom fontWeight={700} sx={{ mb: 2 }}>
					{title}
				</Typography>

				<Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
					{description}
				</Typography>

				<Box sx={{ display: 'flex', gap: 1.5, mb: 2, alignItems: 'flex-start' }}>
					<CheckCircleIcon
						sx={{ fontSize: 20, color: '#10b981', mt: 0.5, flexShrink: 0 }}
					/>
					<Box>
						<Typography variant="body2" fontWeight={600} color="#10b981" gutterBottom>
							Результат:
						</Typography>
						<Typography variant="body2" color="text.secondary">
							{result}
						</Typography>
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
							<FormatQuoteIcon
								sx={{
									fontSize: 20,
									color: config.chipColor,
									mt: 0.5,
									flexShrink: 0,
								}}
							/>
							<Typography variant="body2" fontStyle="italic" color="text.secondary">
								{feedback}
							</Typography>
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
							<Typography variant="caption" color="text.secondary" fontWeight={600}>
								{client}
							</Typography>
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
				<Typography
					variant="h3"
					component="h2"
					align="center"
					gutterBottom
					fontWeight={700}
					sx={{ fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }, mb: 2 }}
				>
					{showcaseContent.title}
				</Typography>
				<Typography
					variant="h6"
					align="center"
					color="text.secondary"
					sx={{ mb: 6, fontWeight: 400 }}
				>
					{showcaseContent.subtitle}
				</Typography>

				<Grid container spacing={4}>
					{showcaseContent.cases.map((caseItem) => (
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
