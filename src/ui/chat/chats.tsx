import { isString, map } from 'lodash'
import { Empty } from '../empty'
import { IconButton } from '../icon-button'
import { Skeleton } from '../skeleton'
import { Stack } from '../stack'
import { Chat, type ChatProps } from './chat'
import { cn } from '@/utils'

export type ChatItem = Omit<ChatProps, 'active' | 'onSelect'>

export type ChatsProps = {
	items?: ChatItem[]
	activeId?: string | null
	loading?: boolean
	error?: string | true | null
	onRefresh?: () => void
	onSelect?: (id: string) => void
	className?: string
	empty?: boolean
}

export function Chats({
	items = [],
	activeId = null,
	loading,
	error,
	onRefresh,
	onSelect,
	className,
	empty,
}: ChatsProps) {
	if (loading) {
		return (
			<div className="m-4">
				<Skeleton shape="avatar" slot="chat" />
				<Skeleton shape="avatar" slot="chat" />
				<Skeleton shape="avatar" slot="chat" />
			</div>
		)
	}

	if (error) {
		return (
			<div className="m-4">
				<Empty
					error
					outline
					mediaIcon
					icon="construction"
					title="Что-то пошло не так!"
					desc={isString(error) ? error : 'Произошла ошибка при загрузке чатов'}
					className={cn('mx-auto my-8', className)}
					compact
				/>
			</div>
		)
	}

	if (items.length === 0 && empty) {
		return (
			<div className="m-4">
				<Empty
					outline
					dark
					mediaIcon
					title="Пока никаких чатов нет"
					desc="Когда появятся обсуждения по проектам, они отобразятся здесь."
					icon="message-circle-check"
					className={cn('mx-auto my-8', className)}
					compact
				/>
			</div>
		)
	}

	return (
		<Stack vertical align="stretch" className={cn('min-h-0', className)}>
			{onRefresh && (
				<Stack
					direction="row"
					justify="flex-end"
					className="border-b border-border/40 px-2 py-1"
				>
					<IconButton
						icon="rotate-ccw"
						variant="ghost"
						size="sm"
						aria-label="Refresh list"
						onClick={onRefresh}
					/>
				</Stack>
			)}
			<Stack vertical gap={0} align="stretch" className="min-h-0">
				{map(items, (row) => (
					<Chat key={row.id} {...row} active={row.id === activeId} onSelect={onSelect} />
				))}
			</Stack>
		</Stack>
	)
}
