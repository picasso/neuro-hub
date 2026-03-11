import { Button, PageShell, TS } from '@/ui'

export function FreelancersPage() {
	return (
		<PageShell preset="content" width="compact">
			<div className="text-center">
				<TS variant="h3" gutterBottom content="Фрилансеры" />
				<TS
					variant="body"
					color="secondary"
					className="mb-8"
					content="Эта страница в разработке"
				/>
				<Button href="/" label="На главную" />
			</div>
		</PageShell>
	)
}
