'use client'

import { XIcon } from 'lucide-react'
import { Dialog as DialogPrimitive } from 'radix-ui'
import { type ComponentProps } from 'react'
import { Toaster, type ToasterProps } from 'sonner'
import { cn } from '@/utils'

export type DialogAnimation = 'zoom' | 'fade' | 'slide-up' | 'slide-down' | 'none'

const animationClasses: Record<DialogAnimation, string> = {
	zoom: [
		'data-[state=open]:animate-in data-[state=closed]:animate-out',
		'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
		'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
		'data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]',
		'data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]',
	].join(' '),
	fade: [
		'data-[state=open]:animate-in data-[state=closed]:animate-out',
		'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
	].join(' '),
	'slide-up': [
		'data-[state=open]:animate-in data-[state=closed]:animate-out',
		'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
		'data-[state=open]:slide-in-from-bottom-8 data-[state=closed]:slide-out-to-bottom-8',
	].join(' '),
	'slide-down': [
		'data-[state=open]:animate-in data-[state=closed]:animate-out',
		'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
		'data-[state=open]:slide-in-from-top-8 data-[state=closed]:slide-out-to-top-8',
	].join(' '),
	none: '',
}

function Dialog({ ...props }: ComponentProps<typeof DialogPrimitive.Root>) {
	return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

function DialogTrigger({ ...props }: ComponentProps<typeof DialogPrimitive.Trigger>) {
	return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

function DialogPortal({ ...props }: ComponentProps<typeof DialogPrimitive.Portal>) {
	return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

function DialogClose({ ...props }: ComponentProps<typeof DialogPrimitive.Close>) {
	return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

function DialogOverlay({ className, ...props }: ComponentProps<typeof DialogPrimitive.Overlay>) {
	return (
		<DialogPrimitive.Overlay
			data-slot="dialog-overlay"
			className={cn(
				'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50 backdrop-blur-xs',
				className,
			)}
			{...props}
		/>
	)
}

function DialogContent({
	className,
	children,
	showCloseButton = true,
	overlay = true,
	withToaster,
	toasterOptions,
	noPadding = false,
	animation = 'zoom',
	...props
}: ComponentProps<typeof DialogPrimitive.Content> & {
	showCloseButton?: boolean
	overlay?: boolean
	withToaster?: boolean
	toasterOptions?: ToasterProps
	noPadding?: boolean
	animation?: DialogAnimation
}) {
	const bodyClassName = cn(
		'bg-background z-50 grid w-full max-w-[calc(100%-2rem)] overflow-hidden rounded-lg border shadow-lg duration-200 outline-none sm:max-w-lg',
		!noPadding && 'py-6 px-5 gap-4',
		animationClasses[animation],
		className,
	)
	const mainClassName = 'fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]'
	const bodyNode = (
		<>
			{children}
			{showCloseButton ? (
				<DialogPrimitive.Close
					data-slot="dialog-close"
					className="focus:ring-ring p-0.5 absolute top-4 right-5 rounded-full border-0 bg-transparent opacity-70 transition hover:opacity-100 hover:bg-foreground/10 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
				>
					<XIcon />
					<span className="sr-only">Close</span>
				</DialogPrimitive.Close>
			) : null}
		</>
	)

	return (
		<DialogPortal data-slot="dialog-portal">
			{overlay && <DialogOverlay />}
			<DialogPrimitive.Content
				data-slot="dialog-content"
				className={cn(
					withToaster
						? 'fixed inset-0 z-50 pointer-events-none outline-none'
						: mainClassName,
					!withToaster && bodyClassName,
				)}
				{...props}
			>
				{withToaster ? (
					<>
						<Toaster
							id="dialog-toaster"
							{...(toasterOptions ?? {
								position: 'bottom-left',
								gap: 10,
								expand: true,
							})}
						/>
						<div className={cn(mainClassName, 'pointer-events-auto', bodyClassName)}>
							{bodyNode}
						</div>
					</>
				) : (
					bodyNode
				)}
			</DialogPrimitive.Content>
		</DialogPortal>
	)
}

function DialogHeader({ className, ...props }: ComponentProps<'div'>) {
	return (
		<div
			data-slot="dialog-header"
			className={cn('-mt-2 flex flex-col gap-2 text-center sm:text-left', className)}
			{...props}
		/>
	)
}

function DialogFooter({ className, children, ...props }: ComponentProps<'div'>) {
	return (
		<div
			data-slot="dialog-footer"
			className={cn(
				'-mx-5 -mb-6 flex flex-col-reverse gap-2 border-t bg-accent/80 px-6 py-4 sm:flex-row sm:justify-end',
				className,
			)}
			{...props}
		>
			{children}
		</div>
	)
}

function DialogTitle({ className, ...props }: ComponentProps<typeof DialogPrimitive.Title>) {
	return (
		<DialogPrimitive.Title
			data-slot="dialog-title"
			className={cn('text-lg leading-none font-semibold tracking-tight', className)}
			{...props}
		/>
	)
}

function DialogDescription({
	className,
	...props
}: ComponentProps<typeof DialogPrimitive.Description>) {
	return (
		<DialogPrimitive.Description
			data-slot="dialog-description"
			className={cn('text-muted-foreground text-sm', className)}
			{...props}
		/>
	)
}

export {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogOverlay,
	DialogPortal,
	DialogTitle,
	DialogTrigger,
}
