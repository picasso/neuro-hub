import { AccountLayout } from './account-layout'
import { AccountFooter } from './footer-account'
import { AccountHeader } from './header-account'
import type { ReactNode } from 'react'
import { PageContainer, SidebarProvider } from '@/ui'

type AccountShellProps = {
	email: string
	name?: string | null
	children: ReactNode
}

export function AccountShell({ email, name, children }: AccountShellProps) {
	return (
		<SidebarProvider className="flex min-h-screen flex-col bg-muted/20">
			<header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/85">
				<AccountHeader email={email} name={name} />
			</header>

			<main className="flex-1 py-4 md:py-6">
				<PageContainer width="desktop">
					<AccountLayout>{children}</AccountLayout>
				</PageContainer>
			</main>

			<AccountFooter />
		</SidebarProvider>
	)
}
