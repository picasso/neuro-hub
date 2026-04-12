'use client'

import { useUnit } from 'effector-react'
import { forEach, has, reduce } from 'lodash'
import { usePathname } from 'next/navigation'
import { useMemo } from 'react'
import { sidebarGroups } from './account-sidebar'
import { toAccountChatsRoute } from './chat/adapters'
import type { ChatConversationSummary } from '@/lib/chat/contracts'
import type { BreadcrumbProps, SidebarGroup, SidebarItem } from '@/ui'
import { $activeConversation } from '@/stores'

export type BreadcrumbPath = NonNullable<BreadcrumbProps['path']>
type BreadcrumbPathItem = BreadcrumbPath[number]
type BreadcrumbMap = Record<string, BreadcrumbPath>
type SidebarItemHref = Extract<SidebarItem, { href: string }>
type SidebarItemItems = Exclude<SidebarItem, SidebarItemHref>

function segmentFromParts(
	current: { title: string; href: string },
	parent?: { title: string; href?: string },
): BreadcrumbPath {
	const currentPath: BreadcrumbPathItem = [current.title, current.href]
	if (!parent) return [currentPath]
	const parentPath: BreadcrumbPathItem = parent.href ? [parent.title, parent.href] : parent.title
	return [parentPath, currentPath] as BreadcrumbPath
}

// builds an href -> breadcrumb trail map from sidebar config (run once at module init)
export function buildBreadcrumbMap(groups: SidebarGroup[]) {
	return reduce(
		groups,
		(acc, { items }) => {
			forEach(items, (item) => {
				if (hasItems(item)) {
					forEach(item.items, (subitem) => {
						if (subitem.href) {
							acc[subitem.href] = segmentFromParts(subitem, item)
						}
					})
				} else if (hasHref(item)) {
					acc[item.href] = segmentFromParts(item)
				}
			})
			return acc
		},
		{} as BreadcrumbMap,
	)
}

// build breadcrumb map once at module init
const breadcrumbMap = buildBreadcrumbMap(sidebarGroups)

function hasItems(item: SidebarItem): item is SidebarItemItems {
	return !!(has(item, 'items') && item.items && item.items.length > 0)
}

function hasHref(item: SidebarItem): item is SidebarItemHref {
	return !!(has(item, 'href') && item.href)
}

function parsePathname(pathname: string) {
	const parts = pathname.split('/').filter(Boolean)
	const last = parts.pop()
	return { base: `/${parts.join('/')}`, full: `/${parts.join('/')}/${last}`, last }
}

function isChat(pathname: string): boolean {
	return pathname === toAccountChatsRoute()
}

export function resolveBreadcrumbPath(
	pathname: string,
	conversation: ChatConversationSummary | null,
	resolveMap: BreadcrumbMap = breadcrumbMap,
): BreadcrumbPath {
	const { base, full, last } = parsePathname(pathname)
	if (!last) return []

	const baseSet = resolveMap[base]
	if (baseSet && isChat(base)) {
		return appendChatDetails(last, baseSet, conversation)
	}
	const fullSet = resolveMap[full]
	return fullSet ?? []
}

function appendChatDetails(
	conversationId: string,
	base: BreadcrumbPath,
	conversation: ChatConversationSummary | null,
) {
	const peerName = `Обсуждение (${conversation?.otherParticipant.name})`
	return [...base, conversationId === conversation?.id ? peerName : 'Обсуждение (...)']
}

// pathname from usePathname() (not a global store) avoids stale trail after layout remount
export function useAccountBreadcrumb(): BreadcrumbPath {
	const pathname = usePathname()
	const activeConversation = useUnit($activeConversation)
	return useMemo(
		() => resolveBreadcrumbPath(pathname, activeConversation),
		[pathname, activeConversation],
	)
}
