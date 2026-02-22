import { type ComponentDemo } from './components'
import { DemoIcons } from './demo-icons'
import { PlaceholderDemo } from './demo-placeholder'

type DemoRendererProps = {
	component: ComponentDemo
}

export function DemoRenderer({ component }: DemoRendererProps) {
	switch (component.id) {
		case 'icons':
			return <DemoIcons />
		default:
			return <PlaceholderDemo component={component} />
	}
}
