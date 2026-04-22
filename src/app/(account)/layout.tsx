import { redirect } from 'next/navigation'
import type { ReactNode } from 'react'
import { AuthHeaderGateProvider } from '@/features/auth-header-gate'
import { AccountShell } from '@/features/server'
import { getAccountShellState } from '@/lib/account'
import { getSsrSafeSession } from '@/lib/auth/server'

type AccountLayoutProps = {
	children: ReactNode
}

export default async function AccountLayout({ children }: AccountLayoutProps) {
	const session = await getSsrSafeSession()
	if (!session) redirect('/login?next=/dashboard')

	const state = await getAccountShellState(session)

	return (
		<AuthHeaderGateProvider
			state={{
				viewer: state.viewer,
				unreadMessages: state.snapshot.messages ?? 0,
			}}
		>
			<AccountShell state={state}>{children}</AccountShell>
		</AuthHeaderGateProvider>
	)
}
