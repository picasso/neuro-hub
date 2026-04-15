import { PendingContent } from './account-pending'
import { getAccountContext } from '@/lib/account'
import { Link, Stack, TS } from '@/ui'

export async function AccountDashboard() {
	const context = await getAccountContext()
	if (!context) return null

	const { session, nickname } = context

	return (
		<div className="w-full min-w-0">
			<TS clean variant="h3" gutterBottom content="Дашборд аккаунта" />
			<TS
				variant="body"
				color="secondary"
				className="mb-4"
				content={`Вы вошли как ${session.user.email}`}
			/>

			<Stack vertical gap={4} className="mt-8">
				{/* <TS
					variant="body"
					color="secondary"
					content="Управляйте профилем, портфолио и заявками в основных разделах аккаунта."
				/>

				<Stack wrap className="gap-3">
					<Button href="/account/profile" size="lg" label="Открыть профиль" />
					<Button
						href="/account/portfolio"
						size="lg"
						variant="outline"
						label="Открыть портфолио"
					/>
					{session.user.role === 'freelancer' ? (
						<Button
							href={'/account/applications' as Route}
							size="lg"
							variant="outline"
							label="Мои заявки"
						/>
					) : null}
				</Stack> */}

				{session.user.role === 'freelancer' && nickname ? (
					<div className="rounded-xl border border-border p-4">
						<TS variant="subtitle" className="mb-2" content="Публичный профиль" />
						<Link
							color="primary"
							hover="underline"
							href={`/freelancers/${nickname}`}
							className="break-all"
						>
							{`/freelancers/${nickname}`}
						</Link>
					</div>
				) : (
					<PendingContent
						icon="construction"
						description="Редактирование профиля и портфолио клиента будет добавлено позже."
					/>
				)}
			</Stack>
		</div>
	)
}
