import { map } from 'lodash'
import { type ReactNode, type ComponentProps } from 'react'
import { Icon, type IconName } from './icon'
import { Tabs as TabsRoot, TabsList, TabsContent, TabsTrigger } from './shadcn/tabs'
import { Stack } from './stack'
import { TS } from './text-styled'
import { cn } from '@/utils'

// types ------------------------------------------------------------------------------------------]

export type TabItem = {
	value: string
	title: string
	content: ReactNode
	icon?: IconName
	disabled?: boolean
	forceMount?: TabsContentProps['forceMount']
}

type TabsContentProps = ComponentProps<typeof TabsContent>
type TabsListProps = ComponentProps<typeof TabsList>
type TabsSize = 'default' | 'sm' | 'xs'
export type TabsProps = ComponentProps<typeof TabsRoot> & {
	variant?: TabsListProps['variant']
	size?: TabsSize
	bordered?: boolean
	fullWidth?: boolean
	fillContainer?: boolean
	items?: TabItem[]
	triggerClassName?: string
	listClassName?: string
	contentClassName?: string
}

// Tabs -------------------------------------------------------------------------------------------]

export function Tabs({
	items,
	bordered,
	fullWidth,
	fillContainer,
	variant,
	size = 'default',
	className,
	triggerClassName,
	listClassName,
	contentClassName,
	...tabsProps
}: TabsProps) {
	const sizeClassName = size === 'sm' ? 'text-sm' : size === 'xs' ? 'text-xs' : undefined
	return (
		<TabsRoot
			defaultValue={items?.[0]?.value}
			className={cn(bordered && 'rounded-lg border', className)}
			{...tabsProps}
		>
			<TabsList
				variant={variant}
				className={cn(
					size === 'xs' && 'h-8!',
					fullWidth && 'w-full',
					fillContainer && 'w-full justify-start',
					listClassName,
				)}
			>
				{map(items, ({ value, title, icon, disabled }) => (
					<TabsTrigger
						key={value}
						value={value}
						className={cn(
							size === 'xs' && 'px-1.5 py-0.5',
							fillContainer && 'flex-none',
							triggerClassName,
						)}
						disabled={disabled}
					>
						{icon ? (
							<Stack gap={size === 'xs' ? 1 : 2}>
								<Icon
									name={icon}
									color="dimmed"
									size={size === 'xs' ? 'xs' : 'sm'}
								/>
								<TS
									clean
									variant="body"
									className={sizeClassName}
									content={title ?? value}
								/>
							</Stack>
						) : (
							<TS
								clean
								variant="body"
								className={sizeClassName}
								content={title ?? value}
							/>
						)}
					</TabsTrigger>
				))}
			</TabsList>
			{map(items, ({ value, content, forceMount }) => (
				<TabsContent
					key={value}
					value={value}
					className={contentClassName}
					forceMount={forceMount}
				>
					{content}
				</TabsContent>
			))}
		</TabsRoot>
	)
}

export { TabsRoot, TabsList, TabsTrigger, TabsContent }
