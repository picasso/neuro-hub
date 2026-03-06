import { isString } from 'lodash'
import { VisuallyHidden } from 'radix-ui'
import { type ComponentProps, type ReactNode } from 'react'
import { Button } from './button'
import { Icon, type IconName, type IconOptions } from './icon'
import {
	type DialogAnimation,
	Dialog as ShadcnDialog,
	DialogClose,
	DialogContent as ShadcnDialogContent,
	DialogDescription as ShadcnDialogDescription,
	DialogFooter as ShadcnDialogFooter,
	DialogHeader as ShadcnDialogHeader,
	DialogOverlay,
	DialogPortal,
	DialogTitle as ShadcnDialogTitle,
	DialogTrigger,
} from './shadcn/dialog'
import { type TextStyledProps, TS } from './text-styled'
import { cn } from '@/utils'

export type { DialogAnimation }
export type DialogSize = 'sm' | 'md' | 'lg' | 'xl' | 'full'

export type DialogProps = ComponentProps<typeof ShadcnDialogContent> & {
	// controlled / uncontrolled
	open?: boolean
	onClose?: () => void
	defaultOpen?: boolean
	modal?: boolean

	// title area — icon rendered inline before title text
	title?: ReactNode
	icon?: IconName
	iconOptions?: IconOptions
	srTitle?: string

	// description — string → simpleMarkdown via TS; ReactNode → render as-is
	description?: ReactNode

	// composition shortcuts
	trigger?: ReactNode
	footer?: ReactNode

	// appearance
	size?: DialogSize
	showFooterClose?: boolean

	// these props already exist in ShadcnDialogContent:
	// overlay?: boolean
	// showCloseButton?: boolean
	// noPadding?: boolean
	// animation?: DialogAnimation
	// className?: string
	// children?: ReactNode

	md?: TextStyledProps['md']
}

export function Dialog({
	open,
	onClose,
	defaultOpen,
	modal = true,
	title,
	icon,
	iconOptions,
	srTitle,
	description,
	trigger,
	footer,
	size = 'md',
	overlay = true,
	showCloseButton = true,
	noPadding = false,
	animation = 'zoom',
	showFooterClose,
	className,
	children,
	md,
	...props
}: DialogProps) {
	const titleNode =
		icon || title ? (
			<span className="flex items-center gap-2">
				{icon && (
					<Icon
						name={icon}
						size={iconOptions?.size ?? 'md'}
						color={iconOptions?.color}
						spinning={iconOptions?.spinning}
						className={iconOptions?.tw}
					/>
				)}
				{title}
			</span>
		) : null

	const descriptionNode = description ? (
		<ShadcnDialogDescription asChild>
			{isString(description) ? <TS content={description} md={md} /> : description}
		</ShadcnDialogDescription>
	) : null

	const hiddenTitle = (
		<VisuallyHidden.Root asChild>
			<ShadcnDialogTitle>{srTitle ?? 'Dialog'}</ShadcnDialogTitle>
		</VisuallyHidden.Root>
	)

	return (
		<ShadcnDialog
			open={open}
			onOpenChange={(isOpen) => {
				if (!isOpen) onClose?.()
			}}
			defaultOpen={defaultOpen}
			modal={modal}
		>
			{trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
			<ShadcnDialogContent
				overlay={overlay}
				showCloseButton={showCloseButton}
				noPadding={noPadding}
				animation={animation}
				className={cn(sizeClasses[size], className)}
				{...props}
			>
				{titleNode || descriptionNode ? (
					<ShadcnDialogHeader>
						{titleNode ? (
							<ShadcnDialogTitle>{titleNode}</ShadcnDialogTitle>
						) : (
							hiddenTitle
						)}
						{descriptionNode}
					</ShadcnDialogHeader>
				) : (
					hiddenTitle
				)}
				{children}
				{(footer !== undefined || showFooterClose) && (
					<ShadcnDialogFooter>
						{footer}
						{showFooterClose && (
							<DialogClose asChild>
								<Button size="sm" variant="outline" label="Close" />
							</DialogClose>
						)}
					</ShadcnDialogFooter>
				)}
			</ShadcnDialogContent>
		</ShadcnDialog>
	)
}

const sizeClasses: Record<DialogSize, string> = {
	sm: 'sm:max-w-sm',
	md: 'sm:max-w-lg',
	lg: 'sm:max-w-2xl',
	xl: 'sm:max-w-4xl',
	full: 'sm:max-w-[95vw]',
}

export {
	Dialog as DialogRoot,
	DialogTrigger,
	ShadcnDialogContent as DialogContent,
	ShadcnDialogHeader as DialogHeader,
	ShadcnDialogFooter as DialogFooter,
	ShadcnDialogTitle as DialogTitle,
	ShadcnDialogDescription as DialogDescription,
	DialogClose,
	DialogOverlay,
	DialogPortal,
}
