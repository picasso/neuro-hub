import { describe, expect, it } from 'vitest'
import { buildBreadcrumbMap, resolveBreadcrumbPath } from './account-breadcrumb'
import type { ChatConversationSummary } from '@/lib/chat/contracts'
import type { SidebarGroup } from '@/ui'

const minimalGroups: SidebarGroup[] = [
	{
		title: 'Test',
		items: [{ title: 'Чат', href: '/account/chat', icon: 'messages-square' }],
	},
]

describe('resolveAccountBreadcrumbPath', () => {
	const routeMap = buildBreadcrumbMap(minimalGroups)

	it('returns empty trail for empty pathname', () => {
		expect(resolveBreadcrumbPath('', null, routeMap)).toEqual([])
	})

	it('appends peer display name when active conversation matches chat id', () => {
		const active: ChatConversationSummary = {
			id: 'conv-a',
			contextType: 'project',
			contextId: 'p1',
			createdAt: '2026-01-01T00:00:00.000Z',
			updatedAt: '2026-01-01T00:00:00.000Z',
			otherParticipant: {
				id: 'u1',
				name: 'Иван',
				image: null,
				role: 'freelancer',
			},
			lastMessage: null,
			unreadCount: 0,
			lastReadMessageId: null,
			lastReadAt: null,
		}
		const path = resolveBreadcrumbPath('/account/chat/conv-a', active, routeMap)
		expect(path).toEqual([['Чат', '/account/chat'], 'Обсуждение (Иван)'])
	})

	it('uses fallback label when conversation id does not match active summary', () => {
		const path = resolveBreadcrumbPath('/account/chat/conv-other', null, routeMap)
		expect(path).toEqual([['Чат', '/account/chat'], 'Обсуждение (...)'])
	})
})
