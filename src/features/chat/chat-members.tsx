import { useUnit } from 'effector-react'
import { useRouter } from 'next/navigation'
import { toAccountConversationRoute, toChatListItems } from './adapters'
import {
	$conversations,
	$conversationsError,
	chatConversationsRefreshRequested,
	loadChatConversationsFx,
} from '@/stores'
import { ChatUI } from '@/ui'

export function ChatMembers() {
	const router = useRouter()
	const [conversations, error, isLoading, onRefresh] = useUnit([
		$conversations,
		$conversationsError,
		loadChatConversationsFx.pending,
		chatConversationsRefreshRequested,
	])

	const items = toChatListItems(conversations)

	function onSelect(nextConversationId: string) {
		setTimeout(() => {
			router.push(toAccountConversationRoute(nextConversationId))
		}, 500)
	}

	return (
		<ChatUI.Container
			bordered
			stickyHeader
			limitWidth="full"
			limitHeight="none"
			background="default"
			padding="sm"
			className="bg-muted min-h-[50dvh]"
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
	)
}
