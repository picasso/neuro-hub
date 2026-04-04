import { type ReactNode } from 'react'
import { cn } from '@/utils'

type Limit = 'md' | 'lg' | 'xl' | '2xl'

export type ChatContainerProps = {
	children: ReactNode
	header?: ReactNode
	footer?: ReactNode
	background?: 'default' | 'muted' | 'transparent'
	padding?: 'none' | 'sm' | 'md' | 'lg'
	limitWidth?: Limit | 'full'
	limitHeight?: Limit | 'none'
	bordered?: boolean
	stickyHeader?: boolean
	stickyFooter?: boolean
	className?: string
	headerClassName?: string
	footerClassName?: string
}

export function ChatContainer({
	children,
	background = 'transparent',
	padding = 'none',
	limitWidth = 'lg',
	limitHeight = 'xl',
	bordered,
	header,
	footer,
	stickyHeader,
	stickyFooter,
	className,
	headerClassName,
	footerClassName,
}: ChatContainerProps) {
	return (
		<div
			className={cn(
				'flex min-h-0 min-w-0 flex-1 flex-col',
				bordered && 'border rounded-md',
				limitWidthClassName[limitWidth],
				limitHeightClassName[limitHeight],
				className,
				limitWidth === 'md' && '**:data-[slot=chat-message]:max-w-[min(100%,18rem)]',
				limitWidth === 'lg' && '**:data-[slot=chat-message]:max-w-[min(100%,21rem)]',
				limitWidth === 'xl' && '**:data-[slot=chat-message]:max-w-[min(100%,24rem)]',
				limitWidth === '2xl' && '**:data-[slot=chat-message]:max-w-[min(100%,28rem)]',
			)}
		>
			<div className={cn('flex h-full min-h-0 flex-col overflow-auto')}>
				{header && (
					<div
						className={cn(
							'border-b p-2',
							stickyHeader && stickyClassName,
							stickyHeader && 'top-0 shadow-[0_6px_12px_-12px_rgba(0,0,0,0.3)]',
							headerClassName,
						)}
					>
						{header}
					</div>
				)}
				<div className={cn('flex-1', backgroundClass[background], paddingClass[padding])}>
					{children}
				</div>
				{footer && (
					<div
						className={cn(
							'border-t p-2',
							stickyFooter && stickyClassName,
							stickyFooter && 'bottom-0 shadow-[0_-6px_12px_-12px_rgba(0,0,0,0.3)]',
							footerClassName,
						)}
					>
						{footer}
					</div>
				)}
			</div>
		</div>
	)
}

const stickyClassName = 'sticky z-20 px-3 bg-accent/95'
const limitWidthClassName: Record<NonNullable<ChatContainerProps['limitWidth']>, string> = {
	md: 'max-w-md',
	lg: 'max-w-lg',
	xl: 'max-w-xl',
	'2xl': 'max-w-2xl',
	full: 'max-w-full',
}

const limitHeightClassName: Record<NonNullable<ChatContainerProps['limitHeight']>, string> = {
	md: 'h-80',
	lg: 'h-120',
	xl: 'h-160',
	'2xl': 'h-200',
	none: 'h-auto',
}

const paddingClass: Record<NonNullable<ChatContainerProps['padding']>, string> = {
	none: 'p-0',
	sm: 'p-2',
	md: 'p-3',
	lg: 'p-4',
}

const backgroundClass: Record<NonNullable<ChatContainerProps['background']>, string> = {
	default:
		'[--chat-from:var(--surface)] ' +
		'bg-[linear-gradient(to_right,var(--chat-from),transparent)]' +
		' has-data-[theme=green]:[--chat-from:color-mix(in_oklab,var(--chat-1)_40%,transparent)]' +
		' has-data-[theme=blue]:[--chat-from:color-mix(in_oklab,var(--chat-2)_40%,transparent)]' +
		' has-data-[theme=purple]:[--chat-from:color-mix(in_oklab,var(--chat-3)_40%,transparent)]' +
		' has-data-[theme=yellow]:[--chat-from:color-mix(in_oklab,var(--chat-4)_40%,transparent)]' +
		' has-data-[theme=cyan]:[--chat-from:color-mix(in_oklab,var(--chat-5)_20%,transparent)]',
	muted: 'bg-accent/60',
	transparent: 'bg-transparent',
}
