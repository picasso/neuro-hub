'use client'

import { useGate, useUnit } from 'effector-react'
import { useParams, useRouter } from 'next/navigation'
import { toChatConversationRoute, toChatListItems, toChatMessageItems } from './adapters'
import { ChatConversationPage } from './chat-conversation-page'
import { ChatListPage } from './chat-list-page'
import {
	$activeConversation,
	$activeMessages,
	$activeMessagesError,
	$activePeerReadState,
	$conversations,
	$conversationsError,
	$hasLoadedActiveMessages,
	$realtimeStatus,
	$unreadConversationsCount,
	chatActiveConversationReloadRequested,
	chatConversationsRefreshRequested,
	chatMessageSubmitted,
	ChatGate,
	loadActiveChatMessagesFx,
	loadChatConversationsFx,
	sendChatMessageFx,
} from '@/stores'
import { PageShell } from '@/ui'

export function ChatPage() {
	const router = useRouter()
	const params = useParams<{ conversationId?: string }>()
	const conversationId = typeof params.conversationId === 'string' ? params.conversationId : null

	useGate(ChatGate, {
		conversationId,
	})

	const [
		conversations,
		activeConversation,
		activeMessages,
		activePeerReadState,
		conversationsError,
		activeMessagesError,
		hasLoadedActiveMessages,
		realtimeStatus,
		unreadConversationsCount,
		isLoadingConversations,
		isLoadingActiveMessages,
		isSendingMessage,
		onRefreshConversations,
		onReloadConversation,
		onSubmitMessage,
	] = useUnit([
		$conversations,
		$activeConversation,
		$activeMessages,
		$activePeerReadState,
		$conversationsError,
		$activeMessagesError,
		$hasLoadedActiveMessages,
		$realtimeStatus,
		$unreadConversationsCount,
		loadChatConversationsFx.pending,
		loadActiveChatMessagesFx.pending,
		sendChatMessageFx.pending,
		chatConversationsRefreshRequested,
		chatActiveConversationReloadRequested,
		chatMessageSubmitted,
	])

	const chatItems = toChatListItems(conversations)
	const messageItems = activeConversation
		? toChatMessageItems({
				messages: activeMessages,
				peerId: activeConversation.otherParticipant.id,
				peerReadState: activePeerReadState,
			})
		: []

	return (
		<PageShell preset="wide" spacing="md">
			{conversationId ? (
				<ChatConversationPage
					activeConversation={activeConversation}
					activeMessages={messageItems}
					activeMessagesError={activeMessagesError}
					hasLoadedActiveMessages={hasLoadedActiveMessages}
					isLoadingConversations={isLoadingConversations}
					isLoadingActiveMessages={isLoadingActiveMessages}
					isSendingMessage={isSendingMessage}
					realtimeStatus={realtimeStatus}
					onReloadConversation={onReloadConversation}
					onSubmitMessage={onSubmitMessage}
				/>
			) : (
				<ChatListPage
					items={chatItems}
					error={conversationsError}
					isLoading={isLoadingConversations}
					unreadConversationsCount={unreadConversationsCount}
					onRefresh={onRefreshConversations}
					onSelect={(nextConversationId) => {
						router.push(toChatConversationRoute(nextConversationId))
					}}
				/>
			)}
		</PageShell>
	)
}
