import { useState } from 'react'
import { formatChatParticipantRole } from './adapters'
import { CHAT_MESSAGE_MAX_LENGTH, type ChatConversationSummary } from '@/lib/chat/contracts'
import { type ChatRealtimeStatus } from '@/stores'
import {
	Button,
	ChatComposer,
	ChatContainer,
	ChatToolbar,
	Empty,
	Messages,
	Stack,
	type MessageItem,
} from '@/ui'

type ChatConversationPageProps = {
	activeConversation: ChatConversationSummary | null
	activeMessages: MessageItem[]
	activeMessagesError: string | null
	hasLoadedActiveMessages: boolean
	isLoadingConversations: boolean
	isLoadingActiveMessages: boolean
	isSendingMessage: boolean
	realtimeStatus: ChatRealtimeStatus
	onReloadConversation: () => void
	onSubmitMessage: (text: string) => void
}

export function ChatConversationPage({
	activeConversation,
	activeMessages,
	activeMessagesError,
	hasLoadedActiveMessages,
	isLoadingConversations,
	isLoadingActiveMessages,
	isSendingMessage,
	realtimeStatus,
	onReloadConversation,
	onSubmitMessage,
}: ChatConversationPageProps) {
	const hasInitialLoadingState =
		(isLoadingActiveMessages && !hasLoadedActiveMessages) ||
		(isLoadingConversations && !activeConversation)
	const hasBlockingError = Boolean(activeMessagesError && activeMessages.length === 0)

	return (
		<ChatContainer
			bordered
			limitWidth="full"
			limitHeight="2xl"
			background="default"
			padding="md"
			header={
				<ChatToolbar
					back
					avatar
					title={activeConversation?.otherParticipant.name ?? 'Обсуждение'}
					desc={
						activeConversation
							? formatChatParticipantRole(activeConversation.otherParticipant.role)
							: 'Загружаем данные...'
					}
					loading={isLoadingConversations || isLoadingActiveMessages}
					status={realtimeStatus}
					onReload={onReloadConversation}
				/>
			}
			footer={
				activeConversation ? (
					<ChatConversationComposer
						isSendingMessage={isSendingMessage}
						isDisabled={isLoadingActiveMessages}
						onSubmitMessage={onSubmitMessage}
					/>
				) : null
			}
			stickyHeader
			stickyFooter
			headerClassName="bg-background/95 px-4 py-4 backdrop-blur-sm"
			footerClassName="bg-background/95 px-0 py-0 backdrop-blur-sm"
		>
			{!activeConversation && !hasInitialLoadingState ? (
				<Stack vertical justify="center" align="center" className="h-full">
					<Empty
						fullWidth
						outline
						error
						icon="message-circle-check"
						title="Диалог недоступен"
						helper="Проверьте ссылку или вернитесь к списку диалогов."
					>
						<Button
							href="/account/chat"
							type="button"
							variant="outline"
							label="Вернуться к списку"
						/>
					</Empty>
				</Stack>
			) : (
				<Messages
					items={activeMessages}
					loading={hasInitialLoadingState}
					error={hasBlockingError ? activeMessagesError : null}
					className="p-1"
				/>
			)}
		</ChatContainer>
	)
}

type ChatConversationComposerProps = {
	isDisabled: boolean
	isSendingMessage: boolean
	onSubmitMessage: (text: string) => void
}

function ChatConversationComposer({
	isDisabled,
	isSendingMessage,
	onSubmitMessage,
}: ChatConversationComposerProps) {
	const [draft, setDraft] = useState('')

	function submitDraft() {
		if (!draft.trim() || isDisabled || isSendingMessage) {
			return
		}

		onSubmitMessage(draft)
		setDraft('')
	}

	return (
		<ChatComposer
			value={draft}
			label="Сообщение"
			placeholder="Напишите сообщение..."
			maxLength={CHAT_MESSAGE_MAX_LENGTH}
			counter
			disabled={isDisabled}
			isSubmitting={isSendingMessage}
			onChange={setDraft}
			onSubmit={submitDraft}
		/>
	)
}
