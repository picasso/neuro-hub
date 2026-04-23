'use client'

import { HeaderAuth } from './header-auth'
import { PlaygroundButton } from './playground/playground-page'
import type { AccountSnapshot, AccountViewer } from '@/lib/account'
import type { ReactNode } from 'react'
import { Link, PageContainer, Separator, SidebarTrigger, Stack, TS } from '@/ui'

type AccountHeaderProps = {
	viewer: AccountViewer
	snapshot: AccountSnapshot
	banner?: string | null
	slot?: ReactNode
}

export function AccountHeader({ viewer, snapshot, banner, slot }: AccountHeaderProps) {
	return (
		<PageContainer width="desktop">
			<Stack justify="space-between" gap={4} className="h-16">
				<Stack gap={3}>
					<SidebarTrigger className="-ml-1 md:hidden" />
					<Separator orientation="vertical" className="h-8! md:hidden bg-accent-dark" />
					<Stack vertical gap={0}>
						<Link href="/" className="inline-flex items-center gap-2">
							<TS variant="h5" clean strong content="NeuroGig" />
						</Link>
						<TS variant="caption" color="dimmed">
							{banner ?? 'Рабочая зона'}
						</TS>
					</Stack>
					{slot}
				</Stack>

				<HeaderAuth
					viewer={viewer}
					snapshot={snapshot}
					variant="account"
					slot={<PlaygroundButton />}
				/>
			</Stack>
		</PageContainer>
	)
}
