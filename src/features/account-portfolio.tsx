import { PendingContent } from './account-pending'
import { PortfolioEditor } from './account-portfolio-editor'
import { getAccountContext } from '@/lib/account'
import { Stack, TS } from '@/ui'

export async function AccountPortfolio() {
	const context = await getAccountContext()
	if (!context) return null

	const { session, nickname } = context

	return (
		<Stack vertical gap={6} align="stretch" className="w-full min-w-0">
			<TS clean variant="h3" gutterBottom content="Портфолио" />
			<TS
				variant="body"
				color="dimmed"
				className="max-w-3xl text-sm md:text-base"
				content={
					'Собирайте лучшие кейсы в одном месте: загружайте медиа,' +
					' вводите описание, задавайте категорию и инструменты' +
					' и постепенно формируйте витрину своего профиля.'
				}
			/>
			{session.user.role === 'freelancer' && nickname ? (
				<PortfolioEditor userId={session.user.id} nickname={nickname} />
			) : (
				<PendingContent
					icon="construction"
					description="Редактирование портфолио клиента будет добавлено позже."
				/>
			)}
		</Stack>
	)
}
