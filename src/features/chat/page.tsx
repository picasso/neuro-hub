'use client'

import { useGate } from 'effector-react'
import { useParams } from 'next/navigation'
import { ChatConversation } from './chat-conversation'
import { ChatMembers } from './chat-members'
import { ChatGate } from '@/stores'
import { PageShell } from '@/ui'

export function ChatPage() {
	const { conversationId = null } = useParams<{ conversationId?: string }>()
	useGate(ChatGate, { conversationId })

	return (
		<PageShell preset="wide" spacing="md">
			{conversationId ? <ChatConversation /> : <ChatMembers />}
		</PageShell>
	)
}
