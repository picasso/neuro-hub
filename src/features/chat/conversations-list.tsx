import { formatChatDateTime, formatChatParticipantRole } from './helpers'
import { ChatPanel, ChatPanelContent, ChatPanelHeader } from './panel'
import type { ChatConversationSummary } from '@/lib/chat/contracts'
import type { Route } from 'next'
import { Avatar, Badge, Button, Empty, Link, Stack, TS } from '@/ui'
import { cn } from '@/utils'

type ChatConversationsListProps = {
	conversations: ChatConversationSummary[]
	activeConversationId: string | null
	conversationsError: string | null
	isLoadingConversations: boolean
	onRefreshConversations: () => void
}

export function ChatConversationsList({
	conversations,
	activeConversationId,
	conversationsError,
	isLoadingConversations,
	onRefreshConversations,
}: ChatConversationsListProps) {
	return (
		<ChatPanel>
			<ChatPanelHeader>
				<Stack justify="space-between" gap={3}>
					<Stack vertical gap={0.5} align="start">
						<TS clean variant="subtitle" content="Диалоги" />
						<TS
							variant="caption"
							color="secondary"
							content="Только существующие диалоги по проектам"
						/>
					</Stack>
					<Button
						type="button"
						variant="outline"
						size="sm"
						label="Обновить"
						leftIcon={isLoadingConversations ? 'spinner' : 'message-circle-check'}
						iconOptions={{ spinning: isLoadingConversations }}
						onClick={onRefreshConversations}
						disabled={isLoadingConversations}
					/>
				</Stack>
			</ChatPanelHeader>

			{conversationsError && conversations.length === 0 ? (
				<ChatPanelContent className="p-4">
					<Stack vertical justify="center" align="center" className="flex-1">
						<Empty
							fullWidth
							outline
							error
							icon="message-circle-check"
							title="Диалоги не загрузились"
							helper={conversationsError}
						>
							<Button
								type="button"
								variant="outline"
								label="Повторить"
								onClick={onRefreshConversations}
							/>
						</Empty>
					</Stack>
				</ChatPanelContent>
			) : conversations.length === 0 && !isLoadingConversations ? (
				<ChatPanelContent className="p-4">
					<Stack vertical justify="center" align="center" className="flex-1">
						<Empty
							fullWidth
							outline
							icon="message-circle-check"
							title="Диалогов пока нет"
							helper="Сейчас раздел показывает только уже существующие чаты."
						/>
					</Stack>
				</ChatPanelContent>
			) : (
				<ChatPanelContent>
					<div className="flex-1 overflow-y-auto p-2">
						<Stack vertical gap={2} align="stretch">
							{conversations.map((conversation) => {
								const href = `/account/chat/${conversation.id}` as Route
								const isActive = conversation.id === activeConversationId

								return (
									<Link
										key={conversation.id}
										href={href}
										className={cn(
											'w-full rounded-xl border border-transparent p-3 transition-colors',
											'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary',
											isActive
												? 'border-primary/20 bg-primary/8'
												: 'bg-surface hover:bg-muted/40',
										)}
									>
										<Stack gap={3} align="start" className="w-full">
											<Avatar
												name={conversation.otherParticipant.name}
												src={
													conversation.otherParticipant.image ?? undefined
												}
												size="md"
											/>
											<Stack
												vertical
												gap={1.5}
												align="stretch"
												className="min-w-0 flex-1"
											>
												<Stack
													justify="space-between"
													align="start"
													className="gap-2"
												>
													<Stack
														vertical
														gap={0.5}
														align="start"
														className="min-w-0"
													>
														<TS
															clean
															variant="body"
															thin
															className="truncate"
															content={
																conversation.otherParticipant.name
															}
														/>
														<TS
															variant="caption"
															color="secondary"
															className="truncate"
															content={formatChatParticipantRole(
																conversation.otherParticipant.role,
															)}
														/>
													</Stack>
													<TS
														variant="caption"
														color="secondary"
														className="shrink-0 text-right"
														content={formatChatDateTime(
															conversation.lastMessage?.createdAt ??
																conversation.updatedAt,
															{ withDate: true },
														)}
													/>
												</Stack>

												<Stack
													justify="space-between"
													align="center"
													className="gap-2"
												>
													<TS
														variant="caption"
														color="secondary"
														className="min-w-0 flex-1 truncate"
														content={
															conversation.lastMessage?.text ??
															'Сообщений пока нет'
														}
													/>
													{conversation.unreadCount > 0 ? (
														<Badge
															variant="primary"
															size="xs"
															label={String(conversation.unreadCount)}
														/>
													) : null}
												</Stack>
											</Stack>
										</Stack>
									</Link>
								)
							})}
						</Stack>
					</div>
				</ChatPanelContent>
			)}
		</ChatPanel>
	)
}
