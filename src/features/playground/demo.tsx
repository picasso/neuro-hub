import { type ComponentDemo } from './components'
import { PlaceholderDemo } from './demo-placeholder'

type DemoRendererProps = {
	component: ComponentDemo | null
}

export function DemoRenderer({ component }: DemoRendererProps) {
	return component?.demo ?? <PlaceholderDemo component={component ?? {}} />
}

export function SettingsRenderer({ component }: DemoRendererProps) {
	return component?.settings
}
