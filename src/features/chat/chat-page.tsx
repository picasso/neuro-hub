'use client'

import { useGate, useUnit } from 'effector-react'
import { useParams } from 'next/navigation'
import {
	$activeConversation,
	$activeConversationId,
	$activeMessages,
	$activeMessagesError,
	$conversations,
	$conversationsError,
	$hasLoadedActiveMessages,
	$realtimeStatus,
	$unreadConversationsCount,
	chatActiveConversationReloadRequested,
	chatConversationsRefreshRequested,
	chatHistoryLoadRequested,
	chatMessageSubmitted,
	ChatGate,
	loadActiveChatMessagesFx,
	loadChatConversationsFx,
	loadOlderChatMessagesFx,
	sendChatMessageFx,
	$activeNextCursor,
} from './chat-model'
import { ChatWorkspace } from './chat-workspace'

export function ChatPage() {
	const params = useParams<{ conversationId?: string }>()
	const conversationId = typeof params.conversationId === 'string' ? params.conversationId : null

	useGate(ChatGate, {
		conversationId,
	})

	const [
		conversations,
		activeConversationId,
		activeConversation,
		activeMessages,
		conversationsError,
		activeMessagesError,
		activeNextCursor,
		hasLoadedActiveMessages,
		realtimeStatus,
		unreadConversationsCount,
		isLoadingConversations,
		isLoadingActiveMessages,
		isLoadingOlderMessages,
		isSendingMessage,
		onRefreshConversations,
		onReloadConversation,
		onLoadOlderMessages,
		onSubmitMessage,
	] = useUnit([
		$conversations,
		$activeConversationId,
		$activeConversation,
		$activeMessages,
		$conversationsError,
		$activeMessagesError,
		$activeNextCursor,
		$hasLoadedActiveMessages,
		$realtimeStatus,
		$unreadConversationsCount,
		loadChatConversationsFx.pending,
		loadActiveChatMessagesFx.pending,
		loadOlderChatMessagesFx.pending,
		sendChatMessageFx.pending,
		chatConversationsRefreshRequested,
		chatActiveConversationReloadRequested,
		chatHistoryLoadRequested,
		chatMessageSubmitted,
	])

	return (
		<ChatWorkspace
			conversations={conversations}
			activeConversationId={activeConversationId}
			activeConversation={activeConversation}
			activeMessages={activeMessages}
			conversationsError={conversationsError}
			activeMessagesError={activeMessagesError}
			hasLoadedActiveMessages={hasLoadedActiveMessages}
			hasOlderMessages={Boolean(activeNextCursor)}
			isLoadingConversations={isLoadingConversations}
			isLoadingActiveMessages={isLoadingActiveMessages}
			isLoadingOlderMessages={isLoadingOlderMessages}
			isSendingMessage={isSendingMessage}
			realtimeStatus={realtimeStatus}
			unreadConversationsCount={unreadConversationsCount}
			onRefreshConversations={onRefreshConversations}
			onReloadConversation={onReloadConversation}
			onLoadOlderMessages={onLoadOlderMessages}
			onSubmitMessage={onSubmitMessage}
		/>
	)
}
