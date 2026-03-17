'use client'

import {
	SidebarInset,
	SidebarProvider,
	SidebarRail,
	SidebarSeparator,
	SidebarTrigger,
	useSidebar,
} from './shadcn/sidebar'
import type { ComponentProps } from 'react'
export {
	SidebarRoot,
	Sidebar,
	type SidebarRootProps,
	type SidebarProps,
	type SidebarGroup,
	type SidebarItem,
	type SidebarItemClick,
	type SidebarMenuProps,
} from './sidebar'

export type SidebarProviderProps = ComponentProps<typeof SidebarProvider>
export type SidebarTriggerProps = ComponentProps<typeof SidebarTrigger>
export type SidebarRailProps = ComponentProps<typeof SidebarRail>
export type SidebarInsetProps = ComponentProps<typeof SidebarInset>
export type SidebarSeparatorProps = ComponentProps<typeof SidebarSeparator>

export { SidebarProvider, SidebarRail, SidebarInset, SidebarTrigger, SidebarSeparator, useSidebar }
