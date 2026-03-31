import { ChatConversationsList } from './chat-conversations-list'
import { ChatThread } from './chat-thread'
import type { ChatUiMessage } from './chat-model.helpers'
import type { ChatRealtimeStatus } from './chat-realtime'
import type { ChatConversationSummary } from '@/lib/chat/contracts'
import { Badge, Stack, TS } from '@/ui'

type ChatWorkspaceProps = {
	conversations: ChatConversationSummary[]
	activeConversationId: string | null
	activeConversation: ChatConversationSummary | null
	activeMessages: ChatUiMessage[]
	conversationsError: string | null
	activeMessagesError: string | null
	hasLoadedActiveMessages: boolean
	hasOlderMessages: boolean
	isLoadingConversations: boolean
	isLoadingActiveMessages: boolean
	isLoadingOlderMessages: boolean
	isSendingMessage: boolean
	realtimeStatus: ChatRealtimeStatus
	unreadConversationsCount: number
	onRefreshConversations: () => void
	onReloadConversation: () => void
	onLoadOlderMessages: () => void
	onSubmitMessage: (text: string) => void
}

export function ChatWorkspace({
	conversations,
	activeConversationId,
	activeConversation,
	activeMessages,
	conversationsError,
	activeMessagesError,
	hasLoadedActiveMessages,
	hasOlderMessages,
	isLoadingConversations,
	isLoadingActiveMessages,
	isLoadingOlderMessages,
	isSendingMessage,
	realtimeStatus,
	unreadConversationsCount,
	onRefreshConversations,
	onReloadConversation,
	onLoadOlderMessages,
	onSubmitMessage,
}: ChatWorkspaceProps) {
	return (
		<Stack vertical gap={4} align="stretch">
			<Stack justify="space-between" align="start" className="gap-3">
				<Stack vertical gap={1} align="start">
					<TS clean variant="h3" content="Чат" />
					<TS
						variant="body"
						color="secondary"
						content="Frontend phase MVP 1-на-1 чата поверх существующего backend foundation"
					/>
				</Stack>
				{unreadConversationsCount > 0 ? (
					<Badge
						variant="primary"
						size="sm"
						label={`Непрочитанные: ${unreadConversationsCount}`}
					/>
				) : null}
			</Stack>

			<div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
				<ChatConversationsList
					conversations={conversations}
					activeConversationId={activeConversationId}
					conversationsError={conversationsError}
					isLoadingConversations={isLoadingConversations}
					onRefreshConversations={onRefreshConversations}
				/>
				<ChatThread
					activeConversationId={activeConversationId}
					activeConversation={activeConversation}
					activeMessages={activeMessages}
					activeMessagesError={activeMessagesError}
					hasLoadedActiveMessages={hasLoadedActiveMessages}
					hasOlderMessages={hasOlderMessages}
					isLoadingActiveMessages={isLoadingActiveMessages}
					isLoadingOlderMessages={isLoadingOlderMessages}
					isSendingMessage={isSendingMessage}
					realtimeStatus={realtimeStatus}
					onLoadOlderMessages={onLoadOlderMessages}
					onReloadConversation={onReloadConversation}
					onSubmitMessage={onSubmitMessage}
				/>
			</div>
		</Stack>
	)
}
