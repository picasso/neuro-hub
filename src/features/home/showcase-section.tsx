import { map } from 'lodash'
import { showcaseContent } from '@/config'
import { Avatar, PageContainer, Stack, TS, type IconName, Icon, Card } from '@/ui'

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
			flush
			size="sm"
			className="h-full"
			headerClassName="px-6 pt-3 pb-1 text-background"
			footerClassName="p-4"
			headerStyle={{ background: config.gradient }}
			title={
				<Stack>
					<Icon name={config.icon} size={24} color="contrast" />
					{category}
				</Stack>
			}
			footer={
				<Stack vertical align="flex-start" gap={4}>
					<Stack align="flex-start">
						<Icon
							name="format-quote"
							style={{ color: config.chipColor }}
							className="mt-1"
						/>
						<TS
							variant="subtitle"
							color="dimmed"
							className="italic"
							content={feedback}
						/>
					</Stack>
					<Stack>
						<Avatar name={client} />
						<TS strong variant="caption" color="secondary" content={client} />
					</Stack>
				</Stack>
			}
			footerStyle={{ background: config.quoteBg }}
		>
			<TS variant="h4" gutterBottom content={title} />
			<TS variant="subtitle" color="secondary" gutterBottom content={description} />
			<Stack align="flex-start">
				<Icon name="badge-check" size="lg" color="primary" />
				<TS strong variant="subtitle" color="secondary" content="Результат:" />
				<TS variant="caption" color="dimmed" content={result} gutterBottom />
			</Stack>
		</Card>
	)
}

export function ShowcaseSection() {
	return (
		<div className="py-12 bg-surface">
			<PageContainer width="desktop">
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

				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					{map(showcaseContent.cases, (caseItem) => (
						<div key={caseItem.id}>
							<CaseCard
								category={caseItem.category}
								title={caseItem.title}
								description={caseItem.description}
								result={caseItem.result}
								feedback={caseItem.feedback}
								client={caseItem.client}
							/>
						</div>
					))}
				</div>
			</PageContainer>
		</div>
	)
}
