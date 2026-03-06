import * as React from 'react'
import { cn } from '@/utils'

const cardVariants = {
	default: 'gap-6 py-6',
	sm: 'gap-3 py-3 mx-auto',
} as const

type CardProps = React.ComponentProps<'div'> & {
	size?: keyof typeof cardVariants
}

function Card({ className, size = 'default', ...props }: CardProps) {
	return (
		<div
			data-slot="card"
			data-size={size}
			className={cn(
				'bg-card text-card-foreground group/card flex flex-col overflow-hidden rounded-xl text-sm border' +
					' has-data-[slot=card-header]:pt-0 has-data-[slot=card-footer]:pb-0' +
					' has-[>img:first-child]:pt-0 *:[img:first-child]:rounded-t-xl w-full max-w-sm',
				// NOTE: uncomment this to use the default card style from shadcn
				// 'bg-card text-card-foreground group/card flex flex-col rounded-xl border shadow-sm',
				cardVariants[size],
				className,
			)}
			{...props}
		/>
	)
}

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div
			data-slot="card-header"
			className={cn(
				'@container/card-header rounded-t-xl grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6',
				className,
			)}
			{...props}
		/>
	)
}

function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div
			data-slot="card-title"
			className={cn('leading-none font-semibold', className)}
			{...props}
		/>
	)
}

function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div
			data-slot="card-description"
			className={cn('text-muted-foreground text-sm', className)}
			{...props}
		/>
	)
}

function CardAction({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div
			data-slot="card-action"
			className={cn(
				'col-start-2 row-span-2 row-start-1 self-start justify-self-end',
				className,
			)}
			{...props}
		/>
	)
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
	return <div data-slot="card-content" className={cn('px-6 flex-1', className)} {...props} />
}

function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div
			data-slot="card-footer"
			className={cn(
				'flex flex-col justify-center mt-auto bg-muted/50 rounded-b-xl border-t items-center px-6 [.border-t]:pt-6',
				className,
			)}
			{...props}
		/>
	)
}

export { Card, CardHeader, CardFooter, CardTitle, CardAction, CardDescription, CardContent }
