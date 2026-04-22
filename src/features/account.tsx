'use client'

import { useGate } from 'effector-react'
import { AccountLayout } from './account-layout'
import { AccountFooter } from './footer-account'
import { AccountHeader } from './header-account'
import type { AccountShellState } from '@/lib/account'
import type { ReactNode } from 'react'
import { AccountContextGate } from '@/stores'
import { PageContainer, SidebarProvider } from '@/ui'

type AccountShellProps = {
	state: AccountShellState
	children: ReactNode
}

export function AccountShell({ state, children }: AccountShellProps) {
	useGate(AccountContextGate, state.snapshot)

	return (
		<div className="flex min-h-svh flex-col">
			<SidebarProvider className="block flex-1 min-h-0">
				<header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/85">
					<AccountHeader viewer={state.viewer} snapshot={state.snapshot} />
				</header>

				<main className="py-4 md:py-6">
					<PageContainer width="desktop">
						<AccountLayout snapshot={state.snapshot}>{children}</AccountLayout>
					</PageContainer>
				</main>
			</SidebarProvider>
			<AccountFooter />
		</div>
	)
}
