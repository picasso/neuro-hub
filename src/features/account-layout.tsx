'use client'

import { useGate } from 'effector-react'
import { useAccountBreadcrumb } from './account-breadcrumb'
import { AccountSidebar } from './account-sidebar'
import type { AccountSnapshot } from '@/lib/account'
import type { PropsWithChildren } from 'react'
import { AccountContextGate } from '@/stores'
import { Breadcrumb, Separator, SidebarInset, SidebarTrigger, Stack } from '@/ui'

type AccountLayoutProps = PropsWithChildren<{
	context: AccountSnapshot
}>

export function AccountLayout({ children, context }: AccountLayoutProps) {
	useGate(AccountContextGate, context)
	const path = useAccountBreadcrumb()
	return (
		<div className="flex w-full overflow-auto rounded-2xl border bg-background">
			<AccountSidebar context={context} />
			<SidebarInset className="bg-surface min-w-0">
				<Stack
					vertical
					gap={0}
					className="shrink-0 transition-[width,height] ease-linear"
					align="stretch"
				>
					<Stack
						gap={0}
						align="stretch"
						justify="start"
						className="h-16 p-2 relative min-w-0 flex-1 border-b max-md:hidden group-has-data-[collapsible=icon]/sidebar-wrapper:p-1"
					>
						<SidebarTrigger className="mr-2 group-has-data-[collapsible=icon]/sidebar-wrapper:mr-1" />
						<Separator
							orientation="vertical"
							className={
								'-mt-4 -mb-2 h-13! group-has-data-[collapsible=icon]/sidebar-wrapper:-mb-1' +
								' group-has-data-[collapsible=icon]/sidebar-wrapper:-mt-1' +
								' group-has-data-[collapsible=icon]/sidebar-wrapper:h-9!'
							}
						/>
						<Breadcrumb path={path} className="px-3 self-center" />
					</Stack>
					<Stack vertical gap={0} align="stretch" className="min-w-0 flex-1 p-5 md:p-6">
						{children}
					</Stack>
				</Stack>
			</SidebarInset>
		</div>
	)
}
