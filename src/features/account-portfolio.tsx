import { PortfolioEditor } from './account-portfolio-editor'
import { getAccountContext } from '@/lib/account'
import { TS } from '@/ui'

export async function AccountPortfolio() {
	const context = await getAccountContext()
	if (!context) return null

	const { session, profileId } = context

	return (
		<div className="w-full min-w-0 space-y-6">
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
			{session.user.role === 'freelancer' && profileId ? (
				<PortfolioEditor userId={session.user.id} profileId={profileId} />
			) : (
				<TS
					variant="body"
					color="secondary"
					className="text-sm"
					content="Редактирование портфолио клиента будет добавлено позже."
				/>
			)}
		</div>
	)
}
