import { AccountLayout } from './account-layout'
import { AccountFooter } from './footer-account'
import { AccountHeader } from './header-account'
import type { AccountSnapshot } from '@/lib/account'
import type { ReactNode } from 'react'
import { PageContainer, SidebarProvider } from '@/ui'

type AccountShellProps = {
	email: string
	name?: string | null
	context: AccountSnapshot
	children: ReactNode
}

export function AccountShell({ email, name, context, children }: AccountShellProps) {
	return (
		<div className="flex min-h-svh flex-col">
			<SidebarProvider className="block flex-1 min-h-0">
				<header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/85">
					<AccountHeader email={email} name={name} />
				</header>

				<main className="py-4 md:py-6">
					<PageContainer width="desktop">
						<AccountLayout context={context}>{children}</AccountLayout>
					</PageContainer>
				</main>
			</SidebarProvider>
			<AccountFooter />
		</div>
	)
}
