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
import {
	maxWClasses,
	type Shadow,
	shadowClasses,
	type MaxW,
	buttonOnAccent,
	badgeOnAccent,
} from './types'
import { cn } from '@/utils'

type ShadcnCardProps = Omit<ComponentProps<typeof ShadcnCard>, 'title'>

export type CardProps = ShadcnCardProps & {
	title?: ReactNode
	description?: ReactNode
	gap?: 'none' | 'sm' | 'md' | 'default'
	footer?: ReactNode
	header?: ReactNode
	button?: string
	buttonProps?: Omit<ButtonProps, 'children' | 'label' | 'asChild'>
	badge?: ReactNode
	badgeProps?: Omit<BadgeProps, 'children' | 'label' | 'asChild'>
	image?: ReactNode | ImageStub
	imageAspect?: ImageAspect
	titleOver?: boolean
	descriptionOver?: boolean
	imageClassName?: string
	shadow?: Shadow
	flush?: boolean
	compact?: boolean
	maxW?: MaxW
	fullWidth?: boolean
	hoverable?: boolean
	headerClassName?: string
	headerStyle?: React.CSSProperties
	footerClassName?: string
	footerStyle?: React.CSSProperties
	contentClassName?: string
}

export function Card({
	title,
	description,
	gap,
	size,
	shadow = 'none',
	maxW = '3xl',
	badge,
	badgeProps,
	image,
	imageAspect,
	titleOver,
	descriptionOver,
	button,
	buttonProps,
	header,
	footer,
	className,
	flush,
	compact,
	fullWidth,
	hoverable,
	headerClassName,
	headerStyle,
	footerClassName,
	footerStyle,
	contentClassName,
	children,
	...props
}: CardProps) {
	const isSmall = size === 'sm' || compact
	const pxPadding = compact ? 'px-4' : 'px-6'
	const ptPadding = compact ? 'pt-2' : 'pt-4'
	const pbPadding = compact ? 'pb-2' : 'pb-4'
	const txtGap = !!((title && titleOver) || (description && descriptionOver))

	return (
		<ShadcnCard
			size={size}
			className={cn(
				'mx-auto overflow-hidden w-full has-data-[slot=card-footer]:pb-0',
				'*:[img:first-child]:rounded-t-xl has-[>img:first-child]:pt-0',
				shadowClasses[shadow],
				hoverable && hoverableClassName,
				!fullWidth && maxWClasses[maxW],
				flush && 'has-data-[slot=card-header]:pt-0 has-data-[slot=card-content]:gap-0',
				image && 'has-data-[slot=card-header]:pt-0',
				gapClasses[gap ?? 'default'],
				className,
			)}
			{...props}
		>
			{(title || description || badge || image || header) && (
				<CardHeader
					className={cn('px-0 relative gap-0', headerClassName)}
					style={headerStyle}
				>
					{image && (
						<div
							className={cn(
								'relative rounded-t-lg overflow-hidden bg-muted/30 mb-2',
								imageAspectClasses[imageAspect ?? 'video'],
								fixedAspectClasses[
									`${compact ? 'compact_' : ''}${image as ImageStub}`
								],
							)}
						>
							{isString(image)
								? renderImage(image, title, imageAspect, hoverable, compact, txtGap)
								: image}
							{badge && (
								<Badge
									variant="outline"
									size={isSmall ? 'sm' : 'xs'}
									color="contrast"
									{...badgeProps}
									className={cn(
										'absolute right-3 top-3',
										!badgeProps?.wider &&
											(isSmall ? 'tracking-tight' : 'tracking-normal'),
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
										description && descriptionOver
											? 'bottom-8'
											: txtGap
												? compact
													? 'bottom-1.5'
													: 'bottom-3'
												: 'bottom-4',
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
										'absolute inset-x-3 text-white/80 text-shadow-md',
										txtGap ? (compact ? 'bottom-1.5' : 'bottom-2') : 'bottom-3',
										isSmall ? 'text-xs' : 'text-sm',
									)}
								>
									{description}
								</CardDescription>
							)}
						</div>
					)}
					{!image && badge && (
						<CardAction className={pxPadding}>
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
						<CardTitle className={cn(pxPadding, isSmall ? 'text-sm' : 'text-base')}>
							{title}
						</CardTitle>
					)}
					{description && !(descriptionOver && image) && (
						<CardDescription
							className={cn(pxPadding, 'mt-1', isSmall ? 'text-xs' : 'text-sm')}
						>
							{description}
						</CardDescription>
					)}
					{header}
				</CardHeader>
			)}
			{children && (
				<CardContent
					className={cn(
						pxPadding,
						!image && ptPadding,
						footer && pbPadding,
						isSmall ? 'text-sm' : null,
						contentClassName,
					)}
				>
					{children}
				</CardContent>
			)}
			{(footer || button) && (
				<CardFooter
					className={cn(
						buttonOnAccent(true),
						badgeOnAccent(true),
						isSmall ? 'py-3! text-sm' : 'py-5!',
						footerClassName,
					)}
					style={footerStyle}
				>
					{footer}
					{button && (
						<Button size={isSmall ? 'xs' : 'sm'} variant="secondary" {...buttonProps}>
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
		color: '#0e74e9',
		color2: '#22c55e',
		accent: '#e90ee9',
	},
	request: {
		name: 'apply',
		forceSize: 80,
		color: '#f91643',
		color2: '#0ea5e9',
		accent: '#e90ee9',
	},
} satisfies Record<
	'portfolio' | 'person' | 'project' | 'request',
	{
		name: IconName
		forceSize: number
		color: string
		color2: string
		accent: string
	}
>

function renderImage(
	image: string,
	title: CardProps['title'],
	imageAspect: ImageAspect = 'video',
	hoverable?: boolean,
	compact?: boolean,
	txtGap?: boolean,
) {
	if (isImageStub(image)) {
		const { color, color2, name, forceSize, accent } = imageStubs[image]
		return (
			<div
				className={cn(
					'inset-0 rounded-t-lg',
					imageAspect === 'none' ? 'relative p-4' : 'absolute',
					'flex items-center justify-center',
				)}
				style={{ background: `linear-gradient(135deg, ${color} 0%, ${color2} 100%)` }}
			>
				<Icon
					name={name}
					size={Math.floor(forceSize * (compact ? (txtGap ? 0.6 : 0.7) : 1))}
					color="contrast"
					accent={accent}
					className={txtGap ? '-mt-5' : undefined}
				/>
			</div>
		)
	}
	return (
		<Image
			fill
			src={image}
			alt={isString(title) ? title : ''}
			sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
			className={cn(
				'object-cover transition-transform duration-300',
				hoverable && 'group-hover:scale-[1.05]',
			)}
		/>
	)
}

export type ImageStub = keyof typeof imageStubs
function isImageStub(image: string): image is ImageStub {
	return image in imageStubs
}

const imageAspectClasses = {
	none: 'aspect-auto',
	square: 'aspect-square',
	video: 'aspect-video',
	'4/3': 'aspect-4/3',
	'3/2': 'aspect-3/2',
	'5/4': 'aspect-5/4',
	'9/16': 'aspect-9/16',
	'2/1': 'aspect-2/1',
	'3/1': 'aspect-3/1',
} as const

export type ImageAspect = keyof typeof imageAspectClasses

const fixedAspectClasses: Partial<Record<ImageStub | `compact_${ImageStub}`, string>> = {
	request: 'h-30 aspect-auto',
	compact_request: 'h-20 aspect-auto',
	portfolio: 'h-36 aspect-auto',
	compact_portfolio: 'h-26 aspect-auto',
	person: 'h-40 aspect-auto',
	compact_person: 'h-30 aspect-auto',
	project: 'h-40 aspect-auto',
	compact_project: 'h-30 aspect-auto',
}

const hoverableClassName =
	'group transition-all hover:-translate-y-1' +
	' hover:shadow-[0_0_5px_-2px_rgba(0,0,0,0.7)] hover:border-black/20'

const gapClasses = {
	none: 'gap-0',
	sm: 'gap-2',
	md: 'gap-4',
	default: 'gap-6',
} as const
