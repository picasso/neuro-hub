import { type ComponentDemo } from '../data/components'
import { PlaceholderDemo } from './placeholder'

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
