import { redirect } from 'next/navigation'
import type { ReactNode } from 'react'
import { AccountShell } from '@/features/server'
import { getAccountSnapshot } from '@/lib/account'
import { getSsrSafeSession } from '@/lib/auth/server'

type AccountLayoutProps = {
	children: ReactNode
}

export default async function AccountLayout({ children }: AccountLayoutProps) {
	const session = await getSsrSafeSession()
	if (!session) redirect('/login?next=/dashboard')

	const context = await getAccountSnapshot(session)

	return (
		<AccountShell email={session.user.email} name={session.user.name} context={context}>
			{children}
		</AccountShell>
	)
}
