'use client'

import { AccountSidebar, AccountNavMobile } from './account-sidebar'
import type { ReactNode } from 'react'
import { Separator, SidebarInset, SidebarTrigger, Stack, TS, useSidebar } from '@/ui'
import { cn } from '@/utils'

type AccountLayoutProps = {
	children: ReactNode
}

export function AccountLayout({ children }: AccountLayoutProps) {
	const { open, toggleSidebar } = useSidebar()

	return (
		<>
			<AccountNavMobile />

			<div className="overflow-hidden rounded-2xl border bg-background">
				<Stack gap={0} align="stretch" className="min-h-[calc(100vh-14rem)]">
					<div
						className={cn(
							'hidden shrink-0 bg-background text-foreground transition-[width] duration-200 ease-linear md:block',
							open ? 'w-70' : 'w-14',
						)}
					>
						<AccountSidebar collapsed={!open} />
					</div>

					<Stack gap={0} align="stretch" className="relative min-w-0 flex-1">
						<Separator
							decorative
							className="pointer-events-none absolute top-14 left-1.5 right-0 z-1"
						/>

						<button
							type="button"
							aria-label="Toggle sidebar"
							title="Toggle sidebar"
							onClick={toggleSidebar}
							className={cn(
								'group relative hidden w-3 shrink-0 bg-[linear-gradient(to_right,var(--background)_0_50%,var(--surface)_50%_100%)] md:block',
								open ? 'cursor-w-resize' : 'cursor-e-resize',
							)}
						>
							<span className="sr-only">Toggle sidebar</span>
							<span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-border transition-all group-hover:w-0.5 group-hover:bg-primary/30" />
						</button>

						<SidebarInset className="min-w-0 bg-surface shadow-none">
							<Stack gap={2} className="h-14 bg-surface px-4">
								<SidebarTrigger className="-ml-1 hidden md:flex" />
								<Separator orientation="vertical" className="hidden h-4 md:block" />
								<TS variant="body" clean strong content="Личный кабинет" />
							</Stack>

							<Stack vertical gap={0} className="flex-1 p-5 md:p-6">
								{children}
							</Stack>
						</SidebarInset>
					</Stack>
				</Stack>
			</div>
		</>
	)
}
