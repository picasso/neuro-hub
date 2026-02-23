import { type ComponentDemo } from './components'
import { Stack } from '@/components/ui'
import { Icon } from '@/components/ui/icon'

type PlaceholderDemoProps = {
	component: Partial<ComponentDemo>
}

export function PlaceholderDemo({ component }: PlaceholderDemoProps) {
	return (
		<Stack
			vertical
			gap={3}
			align="center"
			justify="center"
			className="h-full text-muted-foreground"
		>
			<Icon name="circle" size={40} className="text-border" />
			<div className="text-center">
				<p className="text-sm font-medium text-foreground">
					{component.name ?? 'Unknown component'}
				</p>
				<p className="text-xs">{component.description ?? 'Unknown description'}</p>
				<p className="mt-2 text-xs text-dimmed">Демо будет добавлено при миграции</p>
			</div>
		</Stack>
	)
}
