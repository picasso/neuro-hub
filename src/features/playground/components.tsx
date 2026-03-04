import { type ReactNode } from 'react'
import { DemoAlert } from './demo-alert'
import { DemoAlertSettings } from './demo-alert-settings'
import { DemoAvatar } from './demo-avatar'
import { DemoAvatarSettings } from './demo-avatar-settings'
import { DemoBadge } from './demo-badge'
import { DemoBadgeSettings } from './demo-badge-settings'
import { DemoButtons } from './demo-buttons'
import { DemoButtonsSettings } from './demo-buttons-settings'
import { DemoCheckboxes } from './demo-checkboxes'
import { DemoCheckboxesSettings } from './demo-checkboxes-settings'
import { DemoIconButtons } from './demo-icon-buttons'
import { DemoIconButtonsSettings } from './demo-icon-buttons-settings'
import { DemoIcons } from './demo-icons'
import { DemoIconsSettings } from './demo-icons-settings'
import { DemoInputs } from './demo-inputs'
import { DemoInputsSettings } from './demo-inputs-settings'
import { DemoSelects } from './demo-selects'
import { DemoSelectsSettings } from './demo-selects-settings'
import { DemoTypography } from './demo-typography'
import { DemoTypographySettings } from './demo-typography-settings'

export type ComponentDemo = {
	id: string
	name: string
	group: 'base' | 'forms' | 'feedback' | 'layout' | 'icons'
	description: string
	ready: boolean
	demo?: ReactNode
	settings?: ReactNode
}

export const componentDemos: ComponentDemo[] = [
	{
		id: 'buttons',
		name: 'Buttons',
		group: 'base',
		description: 'Button variants, sizes, states',
		ready: true,
		demo: <DemoButtons />,
		settings: <DemoButtonsSettings />,
	},
	{
		id: 'icon-buttons',
		name: 'IconButtons',
		group: 'base',
		description: 'IconButton variants, sizes, icon sizing',
		ready: true,
		demo: <DemoIconButtons />,
		settings: <DemoIconButtonsSettings />,
	},
	{
		id: 'avatar',
		name: 'Avatar',
		group: 'base',
		description: 'Avatar sizes, initials, image, badge, color',
		ready: true,
		demo: <DemoAvatar />,
		settings: <DemoAvatarSettings />,
	},
	{
		id: 'badges',
		name: 'Badges',
		group: 'base',
		description: 'Badge variants, sizes, icon, closable',
		ready: true,
		demo: <DemoBadge />,
		settings: <DemoBadgeSettings />,
	},
	{
		id: 'icons',
		name: 'Icons',
		group: 'icons',
		description: 'Lucide icons mapping from MUI icons',
		ready: true,
		demo: <DemoIcons />,
		settings: <DemoIconsSettings />,
	},
	{
		id: 'typography',
		name: 'Typography',
		group: 'base',
		description: 'TS (styled text) — variants, colors, modifiers, markdown',
		ready: true,
		demo: <DemoTypography />,
		settings: <DemoTypographySettings />,
	},
	{
		id: 'inputs',
		name: 'Inputs',
		group: 'forms',
		description: 'TextField — Input, Textarea, icons, onEndClick',
		ready: true,
		demo: <DemoInputs />,
		settings: <DemoInputsSettings />,
	},
	{
		id: 'selects',
		name: 'Selects + Combobox',
		group: 'forms',
		description: 'Combobox (с поиском и freeSolo), Select',
		ready: true,
		demo: <DemoSelects />,
		settings: <DemoSelectsSettings />,
	},
	{
		id: 'checkboxes',
		name: 'Checkboxes',
		group: 'forms',
		description: 'Checkbox, Switch, группа чекбоксов',
		ready: true,
		demo: <DemoCheckboxes />,
		settings: <DemoCheckboxesSettings />,
	},
	{
		id: 'dialogs',
		name: 'Dialogs',
		group: 'feedback',
		description: 'Dialog, AlertDialog, Sheet',
		ready: false,
	},
	{
		id: 'alerts',
		name: 'Alerts',
		group: 'feedback',
		description: 'Alert (shadcn/Sonner) — variants, title, description',
		ready: true,
		demo: <DemoAlert />,
		settings: <DemoAlertSettings />,
	},
	{
		id: 'tooltips',
		name: 'Tooltips',
		group: 'feedback',
		description: 'Tooltip, HoverCard',
		ready: false,
	},
	{
		id: 'progress',
		name: 'Progress',
		group: 'feedback',
		description: 'Progress, Skeleton',
		ready: false,
	},
	{
		id: 'tabs',
		name: 'Tabs',
		group: 'layout',
		description: 'Tabs component',
		ready: false,
	},
]

export const groupLabels: Record<ComponentDemo['group'], string> = {
	base: 'Базовые',
	icons: 'Иконки',
	forms: 'Формы',
	feedback: 'Feedback & Overlay',
	layout: 'Layout',
}
