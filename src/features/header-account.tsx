'use client'

import { HeaderAuth } from './header-auth'
import type { ReactNode } from 'react'
import { Link, PageContainer, Separator, SidebarTrigger, Stack, TS } from '@/ui'

type AccountHeaderProps = {
	email: string
	name?: string | null
	banner?: string | null
	slot?: ReactNode
}

export function AccountHeader({ email, name, banner, slot }: AccountHeaderProps) {
	return (
		<PageContainer width="desktop">
			<Stack justify="space-between" gap={4} className="h-16">
				<Stack gap={3}>
					<SidebarTrigger className="-ml-1 md:hidden" />
					<Separator orientation="vertical" className="h-4 md:hidden" />
					<Stack vertical gap={0.5}>
						<Link href="/" className="inline-flex items-center gap-2">
							<TS variant="h5" clean strong content="NeuroGig" />
						</Link>
						<TS variant="caption" color="secondary" className="mt-1">
							{banner ?? 'Рабочая зона'}
						</TS>
					</Stack>
					{slot}
				</Stack>

				<HeaderAuth email={email} name={name} variant="account" />
			</Stack>
		</PageContainer>
	)
}
