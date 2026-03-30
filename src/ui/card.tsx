import { isString } from 'lodash'
import Image from 'next/image'
import { type ReactNode, type ComponentProps } from 'react'
import { Badge, type BadgeProps } from './badge'
import { Button, type ButtonProps } from './button'
import { Icon, type IconName } from './icon'
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

type ShadcnCardProps = Omit<ComponentProps<typeof ShadcnCard>, 'title'>

export type ImageAspect = 'square' | 'video' | '4/3' | '3/2' | '5/4' | '9/16' | '2/1' | 'none'
export type CardProps = ShadcnCardProps & {
	title?: ReactNode
	description?: ReactNode
	footer?: ReactNode
	button?: string
	buttonProps?: Omit<ButtonProps, 'children' | 'label' | 'asChild'>
	badge?: ReactNode
	badgeProps?: Omit<BadgeProps, 'children' | 'label' | 'asChild'>
	image?: ReactNode | 'portfolio' | 'person' | 'project'
	imageAspect?: ImageAspect
	titleOver?: boolean
	descriptionOver?: boolean
	imageClassName?: string
	shadow?: Shadow
	flush?: boolean
	maxW?: MaxW
	fullWidth?: boolean
	headerClassName?: string
	headerStyle?: React.CSSProperties
	footerClassName?: string
	footerStyle?: React.CSSProperties
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
	image,
	imageAspect = 'video',
	titleOver,
	descriptionOver,
	button,
	buttonProps,
	footer,
	className,
	flush,
	fullWidth,
	headerClassName,
	headerStyle,
	footerClassName,
	footerStyle,
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
				flush && 'has-data-[slot=card-header]:pt-0 has-data-[slot=card-content]:gap-0',
				image && 'has-data-[slot=card-header]:pt-0',
				className,
			)}
			{...props}
		>
			{(title || description || badge || image) && (
				<CardHeader className={headerClassName} style={headerStyle}>
					{image && (
						<div
							className={cn(
								'relative -mx-6 rounded-t-lg overflow-hidden bg-muted/30',
								imageAspectClasses[imageAspect],
							)}
						>
							{isString(image) ? renderImage(image, title, imageAspect) : image}
							{badge && (
								<Badge
									variant="outline"
									size={isSmall ? 'sm' : 'xs'}
									color="contrast"
									{...badgeProps}
									className={cn(
										'absolute right-3 top-3',
										isSmall ? 'tracking-tight' : 'tracking-normal',
										badgeProps?.className,
									)}
								>
									{badge}
								</Badge>
							)}
							{title && titleOver && (
								<CardTitle
									className={cn(
										'absolute inset-x-3 bottom-8 text-white text-shadow-md',
										description && descriptionOver ? 'bottom-8' : 'bottom-4',
										isSmall ? 'text-xs' : 'text-sm',
										'backdrop-blur-xs w-fit rounded-lg',
									)}
								>
									{title}
								</CardTitle>
							)}
							{description && descriptionOver && (
								<CardDescription
									className={cn(
										'absolute inset-x-3 bottom-3 text-white/80 text-shadow-md',
										isSmall ? 'text-xs' : 'text-sm',
									)}
								>
									{description}
								</CardDescription>
							)}
						</div>
					)}
					{!image && badge && (
						<CardAction>
							<Badge
								lowercased
								size={isSmall ? 'sm' : 'xs'}
								variant="secondary"
								{...badgeProps}
								className={cn(
									isSmall ? 'tracking-tight' : 'tracking-normal',
									badgeProps?.className,
								)}
							>
								{badge}
							</Badge>
						</CardAction>
					)}
					{title && !(titleOver && image) && (
						<CardTitle className={isSmall ? 'text-sm' : 'text-base'}>{title}</CardTitle>
					)}
					{description && !(descriptionOver && image) && (
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
					style={footerStyle}
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

const imageStubs = {
	portfolio: {
		name: 'missing',
		forceSize: 120,
		color: '#a855f7',
		color2: '#f97316',
		accent: '#16eaf9',
	},
	person: {
		name: 'nobody',
		forceSize: 120,
		color: '#f75555',
		color2: '#f9d716',
		accent: '#f91643',
	},
	project: {
		name: 'missing-more',
		forceSize: 120,
		color: '#0ea5e9',
		color2: '#22c55e',
		accent: '#e90ee9',
	},
}

function renderImage(image: string, title: CardProps['title'], imageAspect: ImageAspect) {
	if (imageStubs[image as never]) {
		const { color, color2, name, forceSize, accent } =
			imageStubs[image as keyof typeof imageStubs]
		return (
			<div
				className={cn(
					'inset-0 rounded-t-lg',
					imageAspect === 'none' ? 'relative p-4' : 'absolute',
					'flex items-center justify-center',
				)}
				style={{ background: `linear-gradient(135deg, ${color} 0%, ${color2} 100%)` }}
			>
				<Icon name={name as IconName} size={forceSize} color="contrast" accent={accent} />
			</div>
		)
	}
	return (
		<Image
			fill
			src={image}
			alt={isString(title) ? title : ''}
			sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
			className="object-cover transition-transform duration-300 group-hover:scale-[1.1]"
		/>
	)
}

const imageAspectClasses = {
	none: '',
	square: 'aspect-square',
	video: 'aspect-video',
	'4/3': 'aspect-4/3',
	'3/2': 'aspect-3/2',
	'5/4': 'aspect-5/4',
	'9/16': 'aspect-9/16',
	'2/1': 'aspect-2/1',
}
