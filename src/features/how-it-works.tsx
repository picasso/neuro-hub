import { Button, TS } from '@/ui'

export function HowItWorksPage() {
	return (
		<div className="container max-w-3xl mx-auto px-4">
			<div className="mt-16 mb-16 text-center">
				<TS variant="h3" gutterBottom content="Как это работает" />
				<TS
					variant="body"
					color="secondary"
					className="mb-8"
					content="Эта страница в разработке"
				/>
				<Button href="/" label="На главную" />
			</div>
		</div>
	)
}
