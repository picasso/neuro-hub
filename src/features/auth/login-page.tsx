import { Suspense } from 'react'
import { LoginForm } from './login-form'
import { Icon } from '@/ui'

export function LoginPage() {
	return (
		<Suspense
			fallback={
				<div className="container max-w-3xl mx-auto px-4">
					<div className="flex items-center justify-center min-h-[60vh]">
						<Icon name="loader-circle" spinning size="lg" />
					</div>
				</div>
			}
		>
			<LoginForm />
		</Suspense>
	)
}
