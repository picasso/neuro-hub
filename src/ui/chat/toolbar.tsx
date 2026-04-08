import { Avatar, type AvatarProps } from '../avatar'
import { Badge, type BadgeColor } from '../badge'
import { Button, type ButtonProps } from '../button'
import { IconButton } from '../icon-button'
import { Stack } from '../stack'
import { TS } from '../text-styled'
import { Tooltip } from '../tooltip'
import { cn } from '@/utils'

type ChatStatus = 'idle' | 'connecting' | 'connected' | 'error'

export type ChatToolbarProps = {
	back?: boolean
	backHref?: ButtonProps['href']
	backLabel?: string
	title?: string
	desc?: string
	avatar?: boolean
	avatarSrc?: AvatarProps['src']
	onReload?: () => void
	disabled?: boolean
	loading?: boolean
	status?: ChatStatus | null
	className?: string
}

export function ChatToolbar({
	back,
	backHref,
	backLabel,
	title,
	desc,
	avatar,
	avatarSrc,
	onReload,
	disabled,
	status,
	loading,
	className,
}: ChatToolbarProps) {
	return (
		<Stack
			justify="space-between"
			align="center"
			gap={3}
			className={cn(disabled && 'opacity-50 pointer-events-none', className)}
		>
			<Stack gap={3} align="center" className="min-w-0 w-full">
				{back && (
					<Button
						href={backHref}
						type="button"
						variant="ghost"
						size="sm"
						leftIcon="chevron-left"
						label={backLabel}
						className="shrink-0 hover:bg-accent-dark"
					/>
				)}
				<Stack
					vertical
					gap={0}
					align="center"
					className={cn('min-w-0 flex-1', !avatar && 'ml-0 lg:ml-3')}
				>
					{avatar && title && (
						<Stack gap={3} justify="center">
							<Avatar src={avatarSrc} bordered={!!avatarSrc} name={title} size="sm" />
							<Stack vertical gap={0} align="start" className="min-w-0">
								<TS
									clean
									variant="subtitle"
									className="w-full truncate font-bold leading-tight"
									content={title}
								/>
								{desc && (
									<TS
										variant="caption"
										color="dimmed"
										className="w-full truncate leading-tight"
										content={desc}
									/>
								)}
							</Stack>
						</Stack>
					)}
					{!avatar && title && (
						<TS
							clean
							variant="subtitle"
							className="w-full truncate font-bold leading-relaxed"
							content={title}
						/>
					)}
					{!avatar && desc && (
						<TS
							variant="caption"
							color="dimmed"
							className="w-full truncate leading-tight"
							content={desc}
						/>
					)}
				</Stack>
			</Stack>
			<Stack gap={2} align="center">
				{onReload && (
					<IconButton
						rounded
						icon={loading ? 'spinner' : 'rotate-ccw'}
						spinning={loading}
						variant="ghost"
						aria-label="Reload"
						onClick={onReload}
						disabled={loading}
						className="cursor-pointer hover:bg-accent-dark"
					/>
				)}
				{status && (
					<Tooltip content={statusLabel[status]} side="right">
						<Badge
							variant="primary"
							size="xs"
							color={statusColor[status]}
							className={cn(
								'rounded-full w-4 h-4 p-0 opacity-80',
								status === 'error' && 'animate-pulse',
								status === 'connecting' && 'animate-ping',
							)}
						/>
					</Tooltip>
				)}
			</Stack>
		</Stack>
	)
}

const statusLabel: Record<ChatStatus, string> = {
	idle: 'Ожидание соединения',
	connecting: 'Подключение...',
	connected: 'Соединение активно',
	error: 'Ошибка соединения',
}

const statusColor: Record<ChatStatus, BadgeColor> = {
	idle: 'info',
	connecting: 'warning',
	connected: 'success',
	error: 'error',
}
