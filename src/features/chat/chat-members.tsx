import { useUnit } from 'effector-react'
import { useRouter } from 'next/navigation'
import { toAccountConversationRoute, toChatListItems } from './adapters'
import {
	$conversations,
	$conversationsError,
	$unreadConversationsCount,
	chatConversationsRefreshRequested,
	loadChatConversationsFx,
} from '@/stores'
import { Badge, ChatUI, Stack, TS } from '@/ui'

export function ChatMembers() {
	const router = useRouter()
	const [conversations, error, unreadCount, isLoading, onRefresh] = useUnit([
		$conversations,
		$conversationsError,
		$unreadConversationsCount,
		loadChatConversationsFx.pending,
		chatConversationsRefreshRequested,
	])

	const items = toChatListItems(conversations)

	function onSelect(nextConversationId: string) {
		router.push(toAccountConversationRoute(nextConversationId))
	}

	return (
		<Stack vertical align="start" className="min-h-[50dvh]">
			<Stack justify="space-between" align="start" gap={3}>
				<Stack vertical gap={1} align="start">
					<TS clean variant="h3" content="Чат" />
					<TS
						variant="body"
						color="secondary"
						content="Список существующих диалогов по проектам"
					/>
				</Stack>
				{unreadCount > 0 ? (
					<Badge variant="primary" size="sm" label={`Непрочитанные: ${unreadCount}`} />
				) : null}
			</Stack>

			<ChatUI.Container
				bordered
				stickyHeader
				limitWidth="full"
				limitHeight="none"
				background="default"
				padding="sm"
				className="bg-muted"
				header={
					<ChatUI.Toolbar
						title="Обсуждения"
						desc="Выберите участника чтобы открыть переписку"
						loading={isLoading}
						status={error ? 'error' : undefined}
						onReload={onRefresh}
					/>
				}
			>
				<ChatUI.Chats
					items={items}
					loading={isLoading}
					error={error}
					onSelect={onSelect}
					empty
				/>
			</ChatUI.Container>
		</Stack>
	)
}
