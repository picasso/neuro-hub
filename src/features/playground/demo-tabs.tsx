'use client'

import { DemoRoot, DemoSection } from './components-utils'
import { type TabsDemoState } from './demo-tabs-settings'
import { useSettings } from './settings-store'
import { Stack, Tabs, type TabItem, TS } from '@/ui'

export function DemoTabs() {
	const { variant, size, bordered, fullWidth, fillContainer, useIcons, disabledTab } =
		useSettings<TabsDemoState>()

	const interactiveItems: TabItem[] = [
		{
			value: 'overview',
			title: 'Overview',
			icon: useIcons ? 'layout-dashboard' : undefined,
			content: tabContent(1, 'Overview'),
		},
		{
			value: 'details',
			title: 'Details',
			icon: useIcons ? 'file-text' : undefined,
			disabled: disabledTab,
			content: tabContent(2, 'Details'),
		},
		{
			value: 'export',
			title: 'Export',
			icon: useIcons ? 'workflow' : undefined,
			content: tabContent(3, 'Export'),
		},
	]

	return (
		<DemoRoot>
			<DemoSection
				title="Interactive"
				desc="Обёртка `?Tabs` на базе **shadcn** —> варианты, size, обводка, иконки и disabled"
				separator
			>
				<Tabs
					fullWidth={fullWidth}
					fillContainer={fillContainer}
					variant={variant}
					size={size}
					bordered={bordered}
					className="max-w-xl"
					items={interactiveItems}
				/>
			</DemoSection>
			<DemoSection
				title="Line + без border"
				desc="Вариант **line** и без `bordered` — для встраивания в панели"
				separator
			>
				<Tabs variant="line" className="max-w-lg" items={staticLineItems} />
			</DemoSection>
			<DemoSection title="Icon labels" desc="Очень мелкие табы с **icon** и `fillContainer`">
				<Tabs size="xs" bordered fillContainer className="max-w-xl" items={iconTabsItems} />
			</DemoSection>
		</DemoRoot>
	)
}

const tabContent = (index: number, title?: string, desc?: string) => (
	<Stack vertical align="start" className="p-6">
		<TS
			variant="body"
			content={
				desc ??
				`Раздел **«${title ?? index}»** — \`${index == 1 ? '?' : index == 2 ? '!' : '+'}контент\` вкладки.\n\n` +
					'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
			}
		/>
	</Stack>
)

const staticLineItems: TabItem[] = [
	{
		value: 'a',
		title: 'Drafts',
		content: tabContent(1, 'Drafts', 'Черновики — line-стиль списка вкладок.'),
	},
	{
		value: 'b',
		title: 'Published',
		content: tabContent(2, 'Published', 'Что-то там было «опубликовано».'),
	},
]

const iconTabsItems: TabItem[] = [
	{ value: 'inbox', title: 'Inbox', icon: 'mail', content: tabContent(1, 'Inbox') },
	{ value: 'sent', title: 'Movies', icon: 'film', content: tabContent(2, 'Movies') },
	{
		value: 'archive',
		title: 'Archive',
		icon: 'folder-kanban',
		content: tabContent(3, 'Archive'),
	},
]
