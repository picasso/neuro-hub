import { type ReactNode, type ComponentProps } from 'react'
import { Badge, type BadgeProps } from './badge'
import { Button, type ButtonProps } from './button'
import {
	CardHeader,
	CardDescription,
	CardTitle,
	CardAction,
	CardContent,
	CardFooter,
	Card as ShadcnCard,
} from './shadcn/card'
import { maxWClasses, type Shadow, shadowClasses, type MaxW, buttonOnAccent } from './types'
import { cn } from '@/utils'

type ShadcnCardProps = ComponentProps<typeof ShadcnCard>
type CardTitleProps = ComponentProps<typeof CardTitle>
type CardDescriptionProps = ComponentProps<typeof CardDescription>
type CardFooterProps = ComponentProps<typeof CardFooter>

export type CardProps = ShadcnCardProps & {
	title?: CardTitleProps['children']
	description?: CardDescriptionProps['children']
	footer?: CardFooterProps['children']
	button?: string
	buttonProps?: Omit<ButtonProps, 'children' | 'label' | 'asChild'>
	badge?: ReactNode
	badgeProps?: Omit<BadgeProps, 'children' | 'label' | 'asChild'>
	shadow?: Shadow
	flush?: boolean
	maxW?: MaxW
	fullWidth?: boolean
	headerClassName?: string
	footerClassName?: string
	contentClassName?: string
}

export function Card({
	title,
	description,
	size,
	shadow = 'none',
	maxW = '3xl',
	badge,
	badgeProps,
	button,
	buttonProps,
	footer,
	className,
	flush,
	fullWidth,
	headerClassName,
	footerClassName,
	contentClassName,
	children,
	...props
}: CardProps) {
	const isSmall = size === 'sm'
	return (
		<ShadcnCard
			size={size}
			className={cn(
				'mx-auto w-full has-data-[slot=card-footer]:pb-0',
				'*:[img:first-child]:rounded-t-xl has-[>img:first-child]:pt-0',
				shadowClasses[shadow],
				!fullWidth && maxWClasses[maxW],
				// fullWidth && '',
				flush && 'has-data-[slot=card-header]:pt-0 has-data-[slot=card-content]:gap-0',
				className,
			)}
			{...props}
		>
			{(title || description || badge) && (
				<CardHeader className={headerClassName}>
					{badge && (
						<CardAction>
							<Badge
								lowercased
								size="xs"
								variant="secondary"
								{...badgeProps}
								className={isSmall ? 'tracking-tight' : 'tracking-normal text-sm'}
							>
								{badge}
							</Badge>
						</CardAction>
					)}
					{title && (
						<CardTitle className={isSmall ? 'text-sm' : 'text-base'}>{title}</CardTitle>
					)}
					{description && (
						<CardDescription className={isSmall ? 'text-xs' : 'text-sm'}>
							{description}
						</CardDescription>
					)}
				</CardHeader>
			)}
			<CardContent className={cn(isSmall ? 'text-sm' : null, contentClassName)}>
				{children}
			</CardContent>
			{(footer || button) && (
				<CardFooter
					className={cn(
						buttonOnAccent(true),
						isSmall ? 'py-3! text-sm' : 'py-5!',
						footerClassName,
					)}
				>
					{footer}
					{button && (
						<Button
							fullWidth
							size={isSmall ? 'xs' : 'sm'}
							variant="secondary"
							{...buttonProps}
						>
							{button}
						</Button>
					)}
				</CardFooter>
			)}
		</ShadcnCard>
	)
}
