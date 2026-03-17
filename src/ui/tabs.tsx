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
export type TabsProps = ComponentProps<typeof TabsRoot> & {
	variant?: TabsListProps['variant']
	bordered?: boolean
	items?: TabItem[]
	triggerClassName?: string
	contentClassName?: string
}

// Tabs -------------------------------------------------------------------------------------------]

export function Tabs({
	items,
	bordered,
	variant,
	className,
	triggerClassName,
	contentClassName,
	...tabsProps
}: TabsProps) {
	return (
		<TabsRoot
			defaultValue={items?.[0]?.value}
			className={cn(bordered && 'rounded-lg border', className)}
			{...tabsProps}
		>
			<TabsList variant={variant}>
				{map(items, ({ value, title, icon, disabled }) => (
					<TabsTrigger
						key={value}
						value={value}
						className={triggerClassName}
						disabled={disabled}
					>
						{icon ? (
							<Stack>
								<Icon name={icon} color="dimmed" />
								<TS clean variant="body">
									{title ?? value}
								</TS>
							</Stack>
						) : (
							<TS clean variant="body">
								{title ?? value}
							</TS>
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
