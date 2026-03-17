import { isString, map } from 'lodash'
import { type ReactNode, type ComponentProps } from 'react'
import { Icon, type IconName } from './icon'
import {
	Accordion as AccordionRoot,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from './shadcn/accordion'
import { Stack } from './stack'
import { TS } from './text-styled'
import { cn } from '@/utils'

// types ------------------------------------------------------------------------------------------]

export type AccordionOption = {
	value: string
	title: string
	content: ReactNode
	icon?: IconName
	disabled?: boolean
}

type AccordionRootProps = ComponentProps<typeof AccordionRoot>
type AccordionSingleProps = Extract<AccordionRootProps, { type: 'single' }>
export type AccordionProps = Omit<AccordionRootProps, 'type' | 'collapsible'> & {
	type?: AccordionRootProps['type']
	collapsible?: AccordionSingleProps['collapsible']
	items?: AccordionOption[]
	bordered?: boolean
	underline?: boolean
	position?: 'left' | 'right'
	triggerClassName?: string
	contentClassName?: string
}

// Accordion --------------------------------------------------------------------------------------]

export function Accordion({
	type = 'single',
	collapsible,
	position = 'right',
	items,
	bordered,
	underline,
	className,
	triggerClassName,
	contentClassName,
	...accordionProps
}: AccordionProps) {
	return (
		<AccordionRoot
			{...({
				type,
				...(type === 'single' ? { collapsible } : {}),
				defaultValue: items?.[0]?.value,
				className: cn(bordered && 'rounded-lg border', className),
				...accordionProps,
			} as AccordionRootProps)}
		>
			{map(items, ({ value, title, content, icon, disabled }) => (
				<AccordionItem key={value} value={value} disabled={disabled}>
					<AccordionTrigger
						className={cn(
							position === 'left' && 'flex-row-reverse justify-end',
							!underline && 'hover:no-underline',
							triggerClassName,
						)}
					>
						{icon ? (
							<Stack gap={3}>
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
					</AccordionTrigger>
					<AccordionContent className={contentClassName}>
						{isString(content) ? (
							<TS clean variant="subtitle" color="dimmed" content={content} />
						) : (
							content
						)}
					</AccordionContent>
				</AccordionItem>
			))}
		</AccordionRoot>
	)
}

export { AccordionRoot, AccordionItem, AccordionTrigger, AccordionContent }
