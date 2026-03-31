import { useMemo, useState, type KeyboardEvent, type SyntheticEvent } from 'react'
import type { ChatUiMessage } from './chat-model.helpers'
import type { ChatRealtimeStatus } from './chat-realtime'
import type { ChatConversationSummary } from '@/lib/chat/contracts'
import { Badge, Avatar, Button, Empty, Stack, TextField, TS } from '@/ui'
import { cn } from '@/utils'

type ChatThreadProps = {
	activeConversationId: string | null
	activeConversation: ChatConversationSummary | null
	activeMessages: ChatUiMessage[]
	activeMessagesError: string | null
	hasLoadedActiveMessages: boolean
	hasOlderMessages: boolean
	isLoadingActiveMessages: boolean
	isLoadingOlderMessages: boolean
	isSendingMessage: boolean
	realtimeStatus: ChatRealtimeStatus
	onLoadOlderMessages: () => void
	onReloadConversation: () => void
	onSubmitMessage: (text: string) => void
}

export function ChatThread({
	activeConversationId,
	activeConversation,
	activeMessages,
	activeMessagesError,
	hasLoadedActiveMessages,
	hasOlderMessages,
	isLoadingActiveMessages,
	isLoadingOlderMessages,
	isSendingMessage,
	realtimeStatus,
	onLoadOlderMessages,
	onReloadConversation,
	onSubmitMessage,
}: ChatThreadProps) {
	if (!activeConversationId) {
		return (
			<div className="flex h-full min-h-96 items-center justify-center rounded-2xl border border-border bg-background p-4">
				<Empty
					fullWidth
					outline
					icon="message-circle-check"
					title="Выберите диалог"
					helper="Слева доступен список существующих чатов. Справа откроется активная переписка."
				/>
			</div>
		)
	}

	if (!activeConversation && !isLoadingActiveMessages) {
		return (
			<div className="flex h-full min-h-96 items-center justify-center rounded-2xl border border-border bg-background p-4">
				<Empty
					fullWidth
					outline
					error
					icon="message-circle-check"
					title="Диалог недоступен"
					helper="Проверьте URL или обновите список диалогов."
				>
					<Button
						type="button"
						variant="outline"
						label="Обновить"
						onClick={onReloadConversation}
					/>
				</Empty>
			</div>
		)
	}

	return (
		<div className="flex h-full min-h-96 flex-col rounded-2xl border border-border bg-background">
			<div className="border-b border-border px-4 py-4">
				<Stack justify="space-between" align="start" className="gap-3">
					<Stack gap={3} align="center" className="min-w-0">
						<Avatar
							name={activeConversation?.otherParticipant.name ?? 'Чат'}
							src={activeConversation?.otherParticipant.image ?? undefined}
							size="md"
						/>
						<Stack vertical gap={0.5} align="start" className="min-w-0">
							<TS
								clean
								variant="subtitle"
								className="truncate"
								content={activeConversation?.otherParticipant.name ?? 'Диалог'}
							/>
							<TS
								variant="caption"
								color="secondary"
								content={
									activeConversation
										? formatParticipantRole(activeConversation)
										: 'Загрузка...'
								}
							/>
						</Stack>
					</Stack>
					<Badge
						variant="outline"
						size="xs"
						color={realtimeStatusColor[realtimeStatus]}
						label={realtimeStatusLabel[realtimeStatus]}
					/>
				</Stack>
			</div>

			<div className="flex flex-1 flex-col overflow-hidden">
				<div className="flex-1 overflow-y-auto px-4 py-4">
					<ChatMessageList
						activeConversation={activeConversation}
						activeMessages={activeMessages}
						activeMessagesError={activeMessagesError}
						hasLoadedActiveMessages={hasLoadedActiveMessages}
						hasOlderMessages={hasOlderMessages}
						isLoadingActiveMessages={isLoadingActiveMessages}
						isLoadingOlderMessages={isLoadingOlderMessages}
						onLoadOlderMessages={onLoadOlderMessages}
						onReloadConversation={onReloadConversation}
					/>
				</div>

				<div className="border-t border-border px-4 py-4">
					<ChatMessageComposer
						disabled={!activeConversation || isLoadingActiveMessages}
						isSendingMessage={isSendingMessage}
						onSubmitMessage={onSubmitMessage}
					/>
				</div>
			</div>
		</div>
	)
}

type ChatMessageListProps = {
	activeConversation: ChatConversationSummary | null
	activeMessages: ChatUiMessage[]
	activeMessagesError: string | null
	hasLoadedActiveMessages: boolean
	hasOlderMessages: boolean
	isLoadingActiveMessages: boolean
	isLoadingOlderMessages: boolean
	onLoadOlderMessages: () => void
	onReloadConversation: () => void
}

function ChatMessageList({
	activeConversation,
	activeMessages,
	activeMessagesError,
	hasLoadedActiveMessages,
	hasOlderMessages,
	isLoadingActiveMessages,
	isLoadingOlderMessages,
	onLoadOlderMessages,
	onReloadConversation,
}: ChatMessageListProps) {
	if (activeMessagesError && activeMessages.length === 0) {
		return (
			<div className="flex h-full items-center justify-center">
				<Empty
					fullWidth
					outline
					error
					icon="message-circle-check"
					title="История не загрузилась"
					helper={activeMessagesError}
				>
					<Button
						type="button"
						variant="outline"
						label="Повторить"
						onClick={onReloadConversation}
					/>
				</Empty>
			</div>
		)
	}

	if (isLoadingActiveMessages && !hasLoadedActiveMessages) {
		return (
			<div className="flex h-full items-center justify-center">
				<Stack vertical gap={2} align="center">
					<TS clean variant="subtitle" content="Загружаем переписку..." />
					<TS
						variant="caption"
						color="secondary"
						content="История сообщений подтягивается с backend foundation"
					/>
				</Stack>
			</div>
		)
	}

	if (activeMessages.length === 0) {
		return (
			<div className="flex h-full items-center justify-center">
				<Empty
					fullWidth
					outline
					icon="message-circle-check"
					title="Сообщений пока нет"
					helper="Как только в этом диалоге появятся сообщения, они будут показаны здесь."
				/>
			</div>
		)
	}

	const peerId = activeConversation?.otherParticipant.id ?? ''

	return (
		<Stack vertical gap={3} align="stretch">
			{hasOlderMessages ? (
				<Button
					type="button"
					variant="outline"
					size="sm"
					label={
						isLoadingOlderMessages
							? 'Загрузка истории...'
							: 'Загрузить более ранние сообщения'
					}
					leftIcon={isLoadingOlderMessages ? 'spinner' : 'message-circle-check'}
					iconOptions={{ spinning: isLoadingOlderMessages }}
					onClick={onLoadOlderMessages}
					disabled={isLoadingOlderMessages}
				/>
			) : null}

			{activeMessages.map((message) => {
				const isOwnMessage = message.senderId !== peerId

				return (
					<div
						key={message.localId ?? message.id}
						className={cn('flex', isOwnMessage ? 'justify-end' : 'justify-start')}
					>
						<div
							className={cn(
								'max-w-[90%] rounded-2xl px-4 py-3 shadow-sm md:max-w-[75%]',
								isOwnMessage
									? 'bg-primary text-primary-foreground'
									: 'border border-border bg-surface text-foreground',
							)}
						>
							<Stack vertical gap={1.5} align="stretch">
								<TS
									variant="body"
									className="whitespace-pre-wrap wrap-break-word"
									content={message.text}
								/>
								<Stack
									justify="space-between"
									align="center"
									className={cn(
										'gap-2 text-xs',
										isOwnMessage
											? 'text-primary-foreground/70'
											: 'text-muted-foreground',
									)}
								>
									<TS
										variant="caption"
										className="shrink-0"
										content={formatMessageTime(message.createdAt)}
									/>
									<TS
										variant="caption"
										className="shrink-0 text-right"
										content={messageStatusLabel[message.status]}
									/>
								</Stack>
							</Stack>
						</div>
					</div>
				)
			})}
		</Stack>
	)
}

type ChatMessageComposerProps = {
	disabled: boolean
	isSendingMessage: boolean
	onSubmitMessage: (text: string) => void
}

function ChatMessageComposer({
	disabled,
	isSendingMessage,
	onSubmitMessage,
}: ChatMessageComposerProps) {
	const [draft, setDraft] = useState('')

	const canSubmit = useMemo(() => draft.trim().length > 0 && !disabled, [draft, disabled])

	const onSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
		event.preventDefault()
		if (!canSubmit) {
			return
		}

		onSubmitMessage(draft)
		setDraft('')
	}

	const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
		if (event.key !== 'Enter' || event.shiftKey) {
			return
		}

		event.preventDefault()
		if (!canSubmit) {
			return
		}

		onSubmitMessage(draft)
		setDraft('')
	}

	return (
		<form onSubmit={onSubmit}>
			<Stack vertical gap={3} align="stretch">
				<TextField
					label="Сообщение"
					placeholder="Напишите сообщение..."
					value={draft}
					onChange={(event) => setDraft(event.target.value)}
					onKeyDown={onKeyDown}
					rows={4}
					maxLength={4000}
					multiline
					disabled={disabled || isSendingMessage}
				/>
				<Stack justify="space-between" align="center" className="gap-3">
					<TS
						variant="caption"
						color="secondary"
						content="Enter отправляет сообщение, Shift+Enter переносит строку"
					/>
					<Button
						type="submit"
						label={isSendingMessage ? 'Отправляем...' : 'Отправить'}
						rightIcon={isSendingMessage ? 'spinner' : 'message-circle-check'}
						iconOptions={{ spinning: isSendingMessage }}
						disabled={!canSubmit || isSendingMessage}
					/>
				</Stack>
			</Stack>
		</form>
	)
}

function formatMessageTime(value: string) {
	const date = new Date(value)

	if (Number.isNaN(date.getTime())) {
		return ''
	}

	return new Intl.DateTimeFormat('ru-RU', {
		hour: '2-digit',
		minute: '2-digit',
	}).format(date)
}

function formatParticipantRole(conversation: ChatConversationSummary) {
	return conversation.otherParticipant.role === 'customer' ? 'Заказчик' : 'Фрилансер'
}

const messageStatusLabel: Record<ChatUiMessage['status'], string> = {
	sent: 'Отправлено',
	sending: 'Отправляется...',
	failed: 'Ошибка отправки',
}

const realtimeStatusLabel: Record<ChatRealtimeStatus, string> = {
	idle: 'Realtime idle',
	connecting: 'Подключение...',
	connected: 'Realtime online',
	error: 'Ошибка realtime',
}

const realtimeStatusColor: Record<
	ChatRealtimeStatus,
	'secondary' | 'success' | 'warning' | 'error'
> = {
	idle: 'secondary',
	connecting: 'warning',
	connected: 'success',
	error: 'error',
}
