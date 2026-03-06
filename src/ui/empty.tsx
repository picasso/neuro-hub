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
import { cn } from '@/lib/utils'
import { simpleMarkdown, type MarkdownParams } from '@/utils'

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
	outline?: boolean
	fullWidth?: boolean
	compact?: boolean
	mediaIcon?: boolean
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
				fullWidth && 'w-full max-w-none',
				compact && 'p-3 md:p-6 gap-1',
				align === 'start' && 'items-start',
				disabled && 'opacity-50',
				className,
			)}
			{...props}
		>
			<EmptyHeader
				className={cn(
					align === 'start' && 'items-start',
					fullWidth && 'w-full max-w-none',
					mediaIcon ? 'gap-2' : 'gap-1',
				)}
			>
				{icon && (
					<EmptyMedia variant={mediaIcon ? 'icon' : 'default'} className={mediaClassName}>
						<Icon
							name={icon}
							color={iconOptions?.color ?? (outline ? 'dimmed' : 'secondary')}
							size={iconOptions?.size ?? 'sm'}
							spinning={iconOptions?.spinning}
							className={iconOptions?.tw}
						/>
					</EmptyMedia>
				)}
				{title && <EmptyTitle className="text-md font-semibold">{title}</EmptyTitle>}
				{desc && (
					<EmptyDescription>
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
					className={cn('pt-2', align === 'start' && 'text-left', helperClassName)}
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
