import { isString, map } from 'lodash'
import { Empty } from '../empty'
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
	onSelect?: (id: string) => void
	className?: string
	empty?: boolean
}

export function Chats({
	items = [],
	activeId = null,
	loading,
	error,
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
			{map(items, (row) => (
				<Chat key={row.id} {...row} active={row.id === activeId} onSelect={onSelect} />
			))}
		</Stack>
	)
}
