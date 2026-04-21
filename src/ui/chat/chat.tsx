import { Avatar } from '../avatar'
import { Badge } from '../badge'
import { Stack } from '../stack'
import { TS } from '../text-styled'
import { TimeDetails } from './time-details'
import { cn } from '@/utils'

export type ChatProps = {
	id: string
	name: string
	image?: string
	lastMessageText?: string
	updatedAt: string
	unreadCount?: number
	onSelect?: (id: string) => void
	// controlled by `Chats` from `activeId`
	active?: boolean
	className?: string
}

export function Chat({
	id,
	name,
	image,
	lastMessageText,
	updatedAt,
	unreadCount = 0,
	onSelect,
	active,
	className,
}: ChatProps) {
	const hasUnread = unreadCount > 0

	return (
		<button
			data-chat={id}
			type="button"
			onClick={() => onSelect?.(id)}
			className={cn(
				'w-full min-w-0 border-b border-border/60 px-3 py-2.5 text-left transition-colors',
				'hover:bg-accent/50 hover:rounded-md',
				active && 'bg-primary/10 hover:bg-primary/15',
				className,
			)}
			aria-current={active ? 'true' : undefined}
		>
			<Stack gap={3} align="center" className="w-full min-w-0">
				<Avatar name={name} src={image} color="auto" size="md" className="shrink-0" />
				<Stack vertical gap={0.5} align="stretch" className="min-w-0 flex-1">
					<Stack direction="row" gap={2} align="center" className="min-w-0">
						<div className="min-w-0 flex-1 overflow-hidden">
							<TS
								variant="body"
								content={name}
								className="block truncate font-medium"
							/>
						</div>
						<TimeDetails timestamp={updatedAt} />
					</Stack>
					<Stack
						direction="row"
						gap={2}
						align="center"
						justify="space-between"
						className="min-w-0"
					>
						<TS
							variant="subtitle"
							color="secondary"
							content={lastMessageText ?? ''}
							className="min-h-4.5 min-w-0 flex-1 truncate text-[13px] leading-tight opacity-90"
						/>
						{hasUnread && (
							<Badge
								variant="primary"
								size="xs"
								label={unreadCount > 99 ? '99+' : String(unreadCount)}
								className="h-5 min-w-5 shrink-0 justify-center px-1.5 text-[11px] font-semibold"
							/>
						)}
					</Stack>
				</Stack>
			</Stack>
		</button>
	)
}
