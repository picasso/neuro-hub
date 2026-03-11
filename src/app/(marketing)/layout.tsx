import type { ReactNode } from 'react'
import { MarketingFooter, MarketingHeader } from '@/features/server'

type MarketingLayoutProps = {
	children: ReactNode
}

export default function MarketingLayout({ children }: MarketingLayoutProps) {
	return (
		<div className="flex min-h-screen flex-col">
			<MarketingHeader />
			<main className="flex-1">{children}</main>
			<MarketingFooter />
		</div>
	)
}
