export type ComponentDemo = {
	id: string
	name: string
	group: 'base' | 'forms' | 'feedback' | 'layout' | 'icons'
	description: string
	ready: boolean
}

export const componentDemos: ComponentDemo[] = [
	{
		id: 'buttons',
		name: 'Buttons',
		group: 'base',
		description: 'Button variants, sizes, states',
		ready: false,
	},
	{
		id: 'icons',
		name: 'Icons',
		group: 'icons',
		description: 'Lucide icons mapping from MUI icons',
		ready: false,
	},
	{
		id: 'typography',
		name: 'Typography',
		group: 'base',
		description: 'TextStyled / TS component',
		ready: false,
	},
	{
		id: 'cards',
		name: 'Cards',
		group: 'base',
		description: 'Card, CardHeader, CardContent, CardFooter',
		ready: false,
	},
	{
		id: 'badges',
		name: 'Badges',
		group: 'base',
		description: 'Badge variants and colors',
		ready: false,
	},
	{
		id: 'inputs',
		name: 'Inputs',
		group: 'forms',
		description: 'Input, Label, Textarea',
		ready: false,
	},
	{
		id: 'selects',
		name: 'Selects',
		group: 'forms',
		description: 'Select, Combobox, Autocomplete',
		ready: false,
	},
	{
		id: 'checkboxes',
		name: 'Checkboxes',
		group: 'forms',
		description: 'Checkbox, Switch, Radio',
		ready: false,
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
		description: 'Alert, Toast (Sonner)',
		ready: false,
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
