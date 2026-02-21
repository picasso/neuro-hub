import { type ComponentDemo } from './components'
import { PlaceholderDemo } from './demo-placeholder'

type DemoRendererProps = {
	component: ComponentDemo
}

export function DemoRenderer({ component }: DemoRendererProps) {
	// Each migrated component will get its own case here
	switch (component.id) {
		default:
			return <PlaceholderDemo component={component} />
	}
}
