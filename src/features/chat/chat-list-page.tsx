import { Badge, ChatContainer, Chats, ChatToolbar, Stack, TS, type ChatItem } from '@/ui'
// import { pluralizeRuWithCount } from '@/utils'

type ChatListPageProps = {
	items: ChatItem[]
	error: string | null
	isLoading: boolean
	unreadConversationsCount: number
	onRefresh: () => void
	onSelect: (conversationId: string) => void
}

export function ChatListPage({
	items,
	error,
	isLoading,
	unreadConversationsCount,
	onRefresh,
	onSelect,
}: ChatListPageProps) {
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
				{unreadConversationsCount > 0 ? (
					<Badge
						variant="primary"
						size="sm"
						label={`Непрочитанные: ${unreadConversationsCount}`}
					/>
				) : null}
			</Stack>

			<ChatContainer
				bordered
				limitWidth="full"
				limitHeight="none"
				background="default"
				padding="sm"
				className="bg-background"
				header={
					<ChatToolbar
						title="Диалоги"
						desc="Откройте переписку отдельной страницей"
						loading={isLoading}
						status={error ? 'error' : undefined}
						onReload={onRefresh}
					/>
					// <Stack justify="space-between" align="start" gap={3}>
					// 	<Stack vertical gap={0.5} align="start">
					// 		<TS clean variant="subtitle" content="Диалоги" />
					// 		<TS
					// 			variant="caption"
					// 			color="secondary"
					// 			content="Откройте переписку отдельной страницей"
					// 		/>
					// 	</Stack>
					// 	<TS
					// 		variant="caption"
					// 		color="secondary"
					// 		content={pluralizeRuWithCount(items.length, [
					// 			'диалог',
					// 			'диалога',
					// 			'диалогов',
					// 		])}
					// 	/>
					// </Stack>
				}
				stickyHeader
			>
				<Chats
					items={items}
					loading={isLoading}
					error={error}
					onSelect={onSelect}
					empty
					className="h-full"
				/>
			</ChatContainer>
		</Stack>
	)
}
