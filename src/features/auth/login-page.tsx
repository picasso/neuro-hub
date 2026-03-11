import { Suspense } from 'react'
import { LoginForm } from './login-form'
import { Icon, PageShell } from '@/ui'

export function LoginPage() {
	return (
		<Suspense
			fallback={
				<PageShell preset="form" spacing="none">
					<div className="flex items-center justify-center min-h-[60vh]">
						<Icon name="loader-circle" spinning size="lg" />
					</div>
				</PageShell>
			}
		>
			<LoginForm />
		</Suspense>
	)
}
