import { Button, type ButtonProps } from './button'
import {
	Popover as ShadcnPopoverRoot,
	PopoverTrigger as ShadcnPopoverTrigger,
	PopoverContent as ShadcnPopoverContent,
	PopoverHeader as ShadcnPopoverHeader,
	PopoverTitle as ShadcnPopoverTitle,
	PopoverDescription as ShadcnPopoverDescription,
} from './shadcn/popover'
import { badgeOnAccent, buttonOnAccent } from './types'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@/utils'

type RootProps = ComponentProps<typeof ShadcnPopoverRoot>
type ContentProps = ComponentProps<typeof ShadcnPopoverContent>

export type PopoverProps = RootProps & {
	align?: ContentProps['align']
	sideOffset?: ContentProps['sideOffset']
	button?: string
	buttonProps?: Omit<ButtonProps, 'label' | 'children'>
	trigger?: ReactNode
	title?: ReactNode
	desc?: ReactNode
	header?: ReactNode
	footer?: ReactNode
	className?: string
	headerClassName?: string
	footerClassName?: string
}

export function Popover({
	align,
	sideOffset,
	button,
	buttonProps,
	trigger,
	title,
	desc,
	header,
	footer,
	children,
	className,
	headerClassName,
	footerClassName,
	...props
}: PopoverProps) {
	return (
		<ShadcnPopoverRoot {...props}>
			<ShadcnPopoverTrigger asChild>
				{button ? (
					<Button variant="outline" {...buttonProps}>
						{button}
					</Button>
				) : (
					trigger
				)}
			</ShadcnPopoverTrigger>
			<ShadcnPopoverContent align={align} sideOffset={sideOffset} className={className}>
				{(title || desc || header) && (
					<ShadcnPopoverHeader className={headerClassName}>
						{title && <ShadcnPopoverTitle>{title}</ShadcnPopoverTitle>}
						{desc && <ShadcnPopoverDescription>{desc}</ShadcnPopoverDescription>}
						{header && header}
					</ShadcnPopoverHeader>
				)}
				{children}
				{footer && (
					<PopoverFooter
						className={cn(buttonOnAccent(), badgeOnAccent(), footerClassName)}
					>
						{footer}
					</PopoverFooter>
				)}
			</ShadcnPopoverContent>
		</ShadcnPopoverRoot>
	)
}

function PopoverFooter({ className, children, ...props }: ComponentProps<'div'>) {
	return (
		<div
			data-slot="popover-footer"
			className={cn(
				'mt-4 -mx-4 -mb-4 min-h-0 flex flex-col-reverse gap-2 border-t bg-accent/80 px-4 py-3 sm:flex-row sm:justify-end',
				className,
			)}
			{...props}
		>
			{children}
		</div>
	)
}
