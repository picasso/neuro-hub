import type { ReactNode } from 'react'
import { AuthHeaderGateProvider } from '@/features/auth-header-gate'
import { MarketingFooter, MarketingHeader } from '@/features/server'
import { getAuthHeaderState } from '@/lib/account'
import { getSsrSafeSession } from '@/lib/auth/server'

type MarketingLayoutProps = {
	children: ReactNode
}

export default async function MarketingLayout({ children }: MarketingLayoutProps) {
	const session = await getSsrSafeSession()
	const authState = session ? await getAuthHeaderState(session) : null

	const content = (
		<div className="flex min-h-screen flex-col">
			<MarketingHeader authState={authState} session={session} />
			<main className="flex-1">{children}</main>
			<MarketingFooter />
		</div>
	)

	if (!authState) {
		return content
	}

	return <AuthHeaderGateProvider state={authState}>{content}</AuthHeaderGateProvider>
}
