import { getAccountContext } from '@/lib/account'
import { Button, Link, Stack, TS } from '@/ui'

export async function AccountDashboard() {
	const context = await getAccountContext()
	if (!context) return null

	const { session, profileId } = context

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
				<TS
					variant="body"
					color="secondary"
					content="Управляйте профилем, портфолио и навигацией по основным разделам аккаунта."
				/>

				<Stack wrap className="gap-3">
					<Button href="/account/profile" size="lg" label="Открыть профиль" />
					<Button
						href="/account/portfolio"
						size="lg"
						variant="outline"
						label="Открыть портфолио"
					/>
				</Stack>

				{session.user.role === 'freelancer' && profileId ? (
					<div className="rounded-xl border border-border p-4">
						<TS variant="subtitle" className="mb-2" content="Публичный профиль" />
						<Link
							color="primary"
							hover="underline"
							href={`/freelancers/${profileId}`}
							className="break-all"
						>
							{`/freelancers/${profileId}`}
						</Link>
					</div>
				) : (
					<TS
						variant="body"
						color="secondary"
						className="text-sm"
						content="Редактирование профиля и портфолио клиента будет добавлено позже."
					/>
				)}
			</Stack>
		</div>
	)
}
