import { AccountNav } from './account-nav'
import { HeaderAuthControls } from './header-auth-controls'
import type { ReactNode } from 'react'
import { Link, PageContainer, Stack, TS } from '@/ui'

type AccountShellProps = {
	email: string
	name?: string | null
	children: ReactNode
}

export function AccountShell({ email, name, children }: AccountShellProps) {
	return (
		<div className="flex min-h-screen flex-col bg-muted/20">
			<header className="border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/85">
				<PageContainer width="desktop">
					<Stack justify="space-between" className="py-4">
						<div>
							<Link href="/" className="inline-flex items-center gap-2">
								<TS variant="h5" clean strong content="NeuroGig" />
							</Link>
							<TS variant="caption" color="secondary" className="mt-1">
								Account workspace
							</TS>
						</div>
						<HeaderAuthControls email={email} name={name} variant="account" />
					</Stack>
				</PageContainer>
			</header>

			<main className="flex-1 py-6 md:py-8">
				<PageContainer width="desktop">
					<div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
						<aside className="h-fit rounded-3xl border bg-background p-4 shadow-sm">
							<AccountNav />
						</aside>

						<div className="min-w-0 rounded-3xl border bg-background p-5 shadow-sm md:p-6">
							{children}
						</div>
					</div>
				</PageContainer>
			</main>
		</div>
	)
}
