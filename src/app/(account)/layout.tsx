import { redirect } from 'next/navigation'
import type { ReactNode } from 'react'
import { AccountShell } from '@/features/server'
import { getSession } from '@/lib/auth/server'

type AccountLayoutProps = {
	children: ReactNode
}

export default async function AccountLayout({ children }: AccountLayoutProps) {
	const session = await getSession()

	if (!session) redirect('/login?next=/dashboard')

	return (
		<AccountShell email={session.user.email} name={session.user.name}>
			{children}
		</AccountShell>
	)
}
