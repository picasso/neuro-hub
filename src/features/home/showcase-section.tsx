'use client'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import { map } from 'lodash'
import { showcaseContent } from '@/config'
import { Avatar, Badge, TS, type IconName, Icon } from '@/ui'

type CategoryConfig = {
	icon: IconName
	gradient: string
	chipColor: string
	quoteBg: string
}

const categoryConfig: Record<string, CategoryConfig> = {
	'Генерация текста': {
		icon: 'article',
		gradient: 'linear-gradient(90deg, #5a4fcf 0%, #a78bfa 100%)',
		chipColor: '#667eea',
		quoteBg: 'rgba(102, 126, 234, 0.1)',
	},
	'Генерация изображений': {
		icon: 'image',
		gradient: 'linear-gradient(90deg, #db2777 0%, #f9a8d4 100%)',
		chipColor: '#f093fb',
		quoteBg: 'rgba(240, 147, 251, 0.1)',
	},
	'Генерация видео': {
		icon: 'video-library',
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
				<Badge
					variant="ghost"
					size="md"
					color="contrast"
					label={category}
					icon={config.icon}
				/>
			</Box>

			<CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 3 }}>
				<TS variant="h5" strong gutterBottom content={title} />

				<TS
					variant="body"
					color="secondary"
					gutterBottom
					className="text-sm"
					content={description}
				/>

				<Stack direction="row" spacing={1.5} sx={{ mb: 2 }} alignItems="flex-start">
					<span className="mt-0.5 shrink-0" style={{ color: '#10b981' }}>
						<Icon name="check-circle" size={20} />
					</span>
					<Box>
						<TS
							variant="body"
							className="text-sm font-semibold text-emerald-500"
							gutterBottom
							content="Результат:"
						/>
						<TS variant="body" color="secondary" className="text-sm" content={result} />
					</Box>
				</Stack>

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
						<Stack direction="row" spacing={1} sx={{ mb: 1.5 }} alignItems="flex-start">
							<span className="mt-0.5 shrink-0" style={{ color: config.chipColor }}>
								<Icon name="format-quote" size={20} />
							</span>
							<TS
								variant="body"
								color="secondary"
								className="text-sm italic"
								content={feedback}
							/>
						</Stack>
						<Stack direction="row" spacing={1} alignItems="center">
							<Avatar name={client} />
							<TS
								variant="caption"
								color="secondary"
								inline
								className="font-semibold"
								content={client}
							/>
						</Stack>
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
					strong
					gutterBottom
					className="text-[2rem] sm:text-[2.5rem] md:text-[3rem] text-center"
					content={showcaseContent.title}
				/>
				<TS
					variant="h5"
					color="secondary"
					className="text-center mb-12 font-normal"
					content={showcaseContent.subtitle}
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
