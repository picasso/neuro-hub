import { Circle } from 'lucide-react'
import { type ComponentDemo } from './components'

type PlaceholderDemoProps = {
	component: ComponentDemo
}

export function PlaceholderDemo({ component }: PlaceholderDemoProps) {
	return (
		<div className="flex h-full flex-col items-center justify-center gap-3 text-muted-foreground">
			<Circle className="size-10 text-border" />
			<div className="text-center">
				<p className="text-sm font-medium text-foreground">{component.name}</p>
				<p className="text-xs">{component.description}</p>
				<p className="mt-2 text-xs text-dimmed">Демо будет добавлено при миграции</p>
			</div>
		</div>
	)
}
