import { useUnit } from 'effector-react'
import { formatChatParticipantRole, toChatMessageItems, toAccountChatsRoute } from './adapters'
import { CHAT_MESSAGE_MAX_LENGTH } from '@/lib/chat/contracts'
import {
	$activeConversation,
	$activeMessages,
	$activeMessagesError,
	$activePeerReadState,
	$hasLoadedActiveMessages,
	$realtimeStatus,
	chatActiveConversationReloadRequested,
	chatMessageSubmitted,
	loadActiveChatMessagesFx,
	loadChatConversationsFx,
	sendChatMessageFx,
} from '@/stores'
import { Button, ChatUI } from '@/ui'

export function ChatConversation() {
	const active = useUnit({
		conversation: $activeConversation,
		messages: $activeMessages,
		read: $activePeerReadState,
		error: $activeMessagesError,
		hasLoaded: $hasLoadedActiveMessages,
	})

	const { realtimeStatus, onReload, onSubmit, ...loading } = useUnit({
		realtimeStatus: $realtimeStatus,
		chats: loadChatConversationsFx.pending,
		messages: loadActiveChatMessagesFx.pending,
		send: sendChatMessageFx.pending,
		onReload: chatActiveConversationReloadRequested,
		onSubmit: chatMessageSubmitted,
	})

	const activeMessagesUI = active.conversation
		? toChatMessageItems({
				messages: active.messages,
				peerId: active.conversation.otherParticipant.id,
				peerReadState: active.read,
			})
		: []

	const isInitialLoading =
		(loading.messages && !active.hasLoaded) || (loading.chats && !active.conversation)
	const hasError = Boolean(active.error && activeMessagesUI.length === 0)

	return (
		<ChatUI.Container
			bordered
			limitWidth="full"
			limitHeight="2xl"
			background="default"
			padding="md"
			stickyHeader
			header={
				<ChatUI.Toolbar
					back
					backHref={toAccountChatsRoute()}
					avatar
					title={active.conversation?.otherParticipant.name ?? 'Обсуждение'}
					desc={
						active.conversation
							? formatChatParticipantRole(active.conversation.otherParticipant.role)
							: 'Загружаем данные...'
					}
					loading={loading.chats || loading.messages}
					status={realtimeStatus}
					onReload={onReload}
				/>
			}
			stickyFooter
			footer={
				active.conversation ? (
					<ChatUI.Composer
						counter
						placeholder="Напишите сообщение..."
						maxLength={CHAT_MESSAGE_MAX_LENGTH}
						disabled={loading.messages}
						isSubmitting={loading.send}
						onSubmit={onSubmit}
					/>
				) : null
			}
		>
			<ChatUI.Messages
				items={activeMessagesUI}
				loading={isInitialLoading}
				error={hasError ? active.error : null}
				className="p-1"
				empty={
					isInitialLoading
						? undefined
						: {
								title: 'Cообщения не доступны',
								desc: 'Проверьте ссылку или вернитесь к списку обсуждений',
								children: (
									<Button
										href={toAccountChatsRoute()}
										type="button"
										variant="outline"
										label="Вернуться к списку"
									/>
								),
							}
				}
			/>
		</ChatUI.Container>
	)
}
