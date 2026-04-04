'use client'

import { has, isPlainObject, isString } from 'lodash'
import { type ReactNode, type ComponentProps } from 'react'
import { type IconName } from './assets'
import { Icon, type IconOptions } from './icon'
import {
	Empty as EmptyRoot,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from './shadcn/empty'
import { TS } from './text-styled'
import { cn, simpleMarkdown, type MarkdownParams } from '@/utils'

// types ------------------------------------------------------------------------------------------]

// eslint-disable-next-line @typescript-eslint/no-namespace
export declare namespace EmptyShadcnProps {
	type Root = ComponentProps<typeof EmptyRoot>
	type Header = ComponentProps<typeof EmptyHeader>
	type Title = ComponentProps<typeof EmptyTitle>
	type Description = ComponentProps<typeof EmptyDescription>
	type Content = ComponentProps<typeof EmptyContent>
	type Media = ComponentProps<typeof EmptyMedia>
}

type EmptyHelper = {
	helper?: string
	md?: Partial<MarkdownParams> | false
}

export type EmptyProps = EmptyShadcnProps.Root & {
	title?: EmptyShadcnProps.Title['children']
	icon?: IconName
	iconOptions?: IconOptions
	disabled?: boolean
	error?: boolean
	dark?: boolean
	light?: boolean
	outline?: boolean
	fullWidth?: boolean
	compact?: boolean
	mediaIcon?: boolean | 'center' | 'start'
	align?: 'center' | 'start'
	desc?: EmptyShadcnProps.Description['children'] | EmptyHelper
	helper?: string | EmptyHelper
	children?: EmptyShadcnProps.Content['children']
	className?: string
	mediaClassName?: string
	contentClassName?: string
	helperClassName?: string
}

// empty wrapper ----------------------------------------------------------------------------------]

export function Empty({
	title,
	desc,
	icon,
	iconOptions,
	disabled,
	error,
	dark,
	light,
	outline,
	fullWidth,
	compact,
	mediaIcon,
	align = 'center',
	helper,
	children,
	className,
	mediaClassName,
	contentClassName,
	helperClassName,
	...props
}: EmptyProps) {
	const isHelper = isEmptyHelper(helper)
	const isDesc = isEmptyDesc(desc)
	const {
		helper: descText,
		md: descMd,
		descNode,
	}: EmptyHelper & { descNode?: ReactNode } = isDesc
		? { helper: desc.helper, md: desc.md === false ? false : { br: true, ...desc.md } }
		: isString(desc)
			? { helper: desc, md: { br: true } }
			: { descNode: desc, md: {} }
	const { helper: helperText, md: helperMd }: EmptyHelper = isHelper
		? { helper: helper.helper, md: helper.md === false ? false : { br: true, ...helper.md } }
		: { helper, md: { br: true } }

	return (
		<EmptyRoot
			data-disabled={disabled}
			data-invalid={!!error}
			className={cn(
				'gap-1.5',
				outline && 'border border-dashed',
				helperMd !== false && 'markdown-root',
				!fullWidth && 'max-w-xl',
				fullWidth && 'w-full max-w-none',
				compact && 'p-3 md:p-6 gap-1',
				align === 'start' && 'items-start',
				error && 'text-destructive/80 bg-red-100 border-red-300',
				dark && 'bg-secondary/30 border-border-dark',
				light && 'bg-surface border-border-dark',
				disabled && 'opacity-50',
				className,
			)}
			{...props}
		>
			<EmptyHeader
				className={cn(
					align === 'start' && 'items-start text-left max-w-none w-full',
					fullWidth && 'w-full max-w-none',
					mediaIcon ? 'gap-2' : 'gap-1',
					compact && 'gap-0',
				)}
			>
				{icon && (
					<EmptyMedia
						variant={mediaIcon ? 'icon' : 'default'}
						className={cn(
							!!mediaIcon && 'bg-accent rounded-full',
							!!mediaIcon && dark && 'bg-accent-dark/70',
							!!mediaIcon && light && 'bg-accent/70',
							!!mediaIcon && error && 'bg-red-200/70',
							iconOptions?.size && `w-auto h-auto`,
							mediaIcon === 'start' && 'self-start rounded-full p-6',
							mediaIcon === 'center' && 'self-center rounded-full p-6',
							!!mediaIcon && compact && 'p-2',
							mediaClassName,
						)}
					>
						<Icon
							name={icon}
							color={
								iconOptions?.color ??
								(error ? 'destructive' : outline ? 'dimmed' : 'secondary')
							}
							size={iconOptions?.size ?? 'sm'}
							spinning={iconOptions?.spinning}
							accent={iconOptions?.accent}
							className={iconOptions?.tw}
						/>
					</EmptyMedia>
				)}
				{title && (
					<EmptyTitle className="text-md font-semibold tracking-wide">{title}</EmptyTitle>
				)}
				{desc && (
					<EmptyDescription className={cn('text-dimmed/90', error && 'text-red-900/60')}>
						{descNode}
						{!descNode &&
							(descMd === false ? descText : simpleMarkdown(descText, descMd))}
					</EmptyDescription>
				)}
			</EmptyHeader>
			{children && (
				<EmptyContent
					className={cn(
						align === 'start' && 'items-start',
						fullWidth && 'w-full max-w-none',
						contentClassName,
					)}
				>
					{children}
				</EmptyContent>
			)}
			{helper && (
				<TS
					data-slot="helper"
					variant="caption"
					content={helperMd === false ? helperText : simpleMarkdown(helperText, helperMd)}
					className={cn(
						'pt-2 text-dimmed/70',
						align === 'start' && 'text-left',
						error && 'text-red-900/40',
						helperClassName,
					)}
				/>
			)}
		</EmptyRoot>
	)
}

function isEmptyHelper(helper: EmptyProps['helper']): helper is EmptyHelper {
	return has(helper, 'helper')
}

function isEmptyDesc(desc: EmptyProps['desc']): desc is EmptyHelper {
	return isPlainObject(desc) && isEmptyHelper(desc as EmptyHelper)
}
