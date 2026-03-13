import { PortfolioEditor } from './portfolio/portfolio-editor'
import { getAccountContext } from '@/lib/account'
import { Breadcrumb, TS } from '@/ui'

export async function AccountPortfolio() {
	const context = await getAccountContext()
	if (!context) return null

	const { session, profileId } = context

	return (
		<div className="w-full min-w-0">
			<TS clean variant="h3" gutterBottom content="Портфолио" />
			<Breadcrumb
				path={[['Портфолио', '/account/portfolio'], 'Посмотреть']}
				className="px-3"
			/>
			{session.user.role === 'freelancer' && profileId ? (
				<div className="mt-8">
					<PortfolioEditor userId={session.user.id} profileId={profileId} />
				</div>
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
