import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'
import { cn } from '@/utils'
// has-data-[slot=alert-icon]
const alertVariants = cva(
	'relative w-full rounded-lg border px-4 py-3 text-sm grid has-data-[slot=alert-icon]:grid-cols-[calc(var(--spacing)*5)_1fr] grid-cols-[0_1fr] has-data-[slot=alert-icon]:gap-x-3 gap-y-0.5 items-start *:data-[slot=alert-icon]:size-5 *:data-[slot=alert-icon]:translate-y-0.5',
	{
		variants: {
			variant: {
				default: 'bg-card text-card-foreground',
				destructive:
					'text-destructive bg-card [&>svg]:text-current *:data-[slot=alert-description]:text-destructive/90',
			},
		},
		defaultVariants: {
			variant: 'default',
		},
	},
)

function Alert({
	className,
	variant,
	...props
}: React.ComponentProps<'div'> & VariantProps<typeof alertVariants>) {
	return (
		<div
			data-slot="alert"
			role="alert"
			className={cn(alertVariants({ variant }), className)}
			{...props}
		/>
	)
}

function AlertTitle({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div
			data-slot="alert-title"
			className={cn('col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight', className)}
			{...props}
		/>
	)
}

function AlertDescription({ className, ...props }: React.ComponentProps<'div'>) {
	return (
		<div
			data-slot="alert-description"
			className={cn(
				'text-muted-foreground col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed',
				className,
			)}
			{...props}
		/>
	)
}

export { Alert, AlertTitle, AlertDescription }
