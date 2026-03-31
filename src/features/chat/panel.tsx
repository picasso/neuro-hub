import { type ComponentPropsWithoutRef } from 'react'
import { cn } from '@/utils'

type ChatPanelProps = ComponentPropsWithoutRef<'section'>

export function ChatPanel({ className, ...props }: ChatPanelProps) {
	return (
		<section
			className={cn(
				'flex h-full min-h-96 flex-col rounded-2xl border border-border bg-background',
				className,
			)}
			{...props}
		/>
	)
}

type ChatPanelHeaderProps = ComponentPropsWithoutRef<'header'>

export function ChatPanelHeader({ className, ...props }: ChatPanelHeaderProps) {
	return <header className={cn('border-b border-border px-4 py-4', className)} {...props} />
}

type ChatPanelContentProps = ComponentPropsWithoutRef<'div'>

export function ChatPanelContent({ className, ...props }: ChatPanelContentProps) {
	return <div className={cn('flex min-h-0 flex-1 flex-col', className)} {...props} />
}

type ChatPanelFooterProps = ComponentPropsWithoutRef<'footer'>

export function ChatPanelFooter({ className, ...props }: ChatPanelFooterProps) {
	return <footer className={cn('border-t border-border px-4 py-4', className)} {...props} />
}
