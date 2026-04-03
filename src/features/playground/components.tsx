import { type ReactNode } from 'react'
import { DemoAlert } from './demo-alert'
import { DemoAlertSettings } from './demo-alert-settings'
import { DemoAvatar } from './demo-avatar'
import { DemoAvatarSettings } from './demo-avatar-settings'
import { DemoBadge } from './demo-badge'
import { DemoBadgeSettings } from './demo-badge-settings'
import { DemoButtons } from './demo-buttons'
import { DemoButtonsSettings } from './demo-buttons-settings'
import { DemoCard } from './demo-card'
import { DemoCardSettings } from './demo-card-settings'
import { DemoChat } from './demo-chat'
import { DemoChatSettings } from './demo-chat-settings'
import { DemoCheckboxes } from './demo-checkboxes'
import { DemoCheckboxesSettings } from './demo-checkboxes-settings'
import { DemoDialog } from './demo-dialog'
import { DemoDialogSettings } from './demo-dialog-settings'
import { DemoEmpty } from './demo-empty'
import { DemoEmptySettings } from './demo-empty-settings'
import { DemoIconButtons } from './demo-icon-buttons'
import { DemoIconButtonsSettings } from './demo-icon-buttons-settings'
import { DemoIcons } from './demo-icons'
import { DemoIconsSettings } from './demo-icons-settings'
import { DemoInputs } from './demo-inputs'
import { DemoInputsSettings } from './demo-inputs-settings'
import { PortfolioDemo } from './demo-portfolio'
import { DemoPortfolioSettings } from './demo-portfolio-settings'
import { DemoSelects } from './demo-selects'
import { DemoSelectsSettings } from './demo-selects-settings'
import { DemoSkeleton } from './demo-skeleton'
import { DemoSkeletonSettings } from './demo-skeleton-settings'
import { DemoTabs } from './demo-tabs'
import { DemoTabsSettings } from './demo-tabs-settings'
import { DemoTypography } from './demo-typography'
import { DemoTypographySettings } from './demo-typography-settings'
import { DemoUploader } from './demo-uploader'
import { DemoUploaderSettings } from './demo-uploader-settings'

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
		description: 'Badge variants, sizes, colors, icon, closable, capitalize',
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
		id: 'uploader',
		name: 'Uploader',
		group: 'forms',
		description: 'File Uploader supporting multiple file selection and drop zone',
		ready: true,
		demo: <DemoUploader />,
		settings: <DemoUploaderSettings />,
	},
	{
		id: 'dialogs',
		name: 'Dialogs',
		group: 'feedback',
		description: 'Dialog wrapper — size, icon in title, markdown description, overlay',
		ready: true,
		demo: <DemoDialog />,
		settings: <DemoDialogSettings />,
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
		id: 'empty',
		name: 'Empty',
		group: 'feedback',
		description: 'Empty state — outline, error, surfaces, mediaIcon, helper, actions',
		ready: true,
		demo: <DemoEmpty />,
		settings: <DemoEmptySettings />,
	},
	{
		id: 'skeleton',
		name: 'Skeleton',
		group: 'feedback',
		description: 'Skeleton — shape presets, maxW, clean, single blocks, filler',
		ready: true,
		demo: <DemoSkeleton />,
		settings: <DemoSkeletonSettings />,
	},
	{
		id: 'chat-ui',
		name: 'Chat UI',
		group: 'layout',
		description:
			'Autonomous chat kit — Message, Messages, Chat, Chats, Status, Composer, Container',
		ready: true,
		demo: <DemoChat />,
		settings: <DemoChatSettings />,
	},
	{
		id: 'cards',
		name: 'Cards and more',
		group: 'layout',
		description: 'Cards for different entities and layouts',
		ready: true,
		demo: <DemoCard />,
		settings: <DemoCardSettings />,
	},
	{
		id: 'tabs',
		name: 'Tabs',
		group: 'layout',
		description: 'Tabs — variant, bordered, icons, disabled tab',
		ready: true,
		demo: <DemoTabs />,
		settings: <DemoTabsSettings />,
	},
	{
		id: 'portfolio',
		name: 'Portfolio',
		group: 'layout',
		description: 'Portfolio component',
		ready: true,
		demo: <PortfolioDemo />,
		settings: <DemoPortfolioSettings />,
	},
]

export const groupLabels: Record<ComponentDemo['group'], string> = {
	base: 'Базовые',
	icons: 'Иконки',
	forms: 'Формы',
	feedback: 'Feedback & Overlay',
	layout: 'Layout',
}
