import { type ComponentDemo } from './components'
import { Icon } from '@/components/ui/icon'

type PlaceholderDemoProps = {
	component: Partial<ComponentDemo>
}

export function PlaceholderDemo({ component }: PlaceholderDemoProps) {
	return (
		<div className="flex h-full flex-col items-center justify-center gap-3 text-muted-foreground">
			<Icon name="circle" size={40} className="text-border" />
			<div className="text-center">
				<p className="text-sm font-medium text-foreground">
					{component.name ?? 'Unknown component'}
				</p>
				<p className="text-xs">{component.description ?? 'Unknown description'}</p>
				<p className="mt-2 text-xs text-dimmed">Демо будет добавлено при миграции</p>
			</div>
		</div>
	)
}
