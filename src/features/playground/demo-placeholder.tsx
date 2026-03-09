import { type ComponentDemo } from './components'
import { Stack, Icon, TS } from '@/ui'

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
			<Stack vertical gap={0} align="center" className="text-center">
				<TS
					variant="body"
					content={component.name ?? 'Unknown component'}
					className="text-sm font-medium"
				/>
				<TS
					variant="caption"
					content={component.description ?? 'Unknown description'}
					className="text-xs"
				/>
				<TS
					variant="caption"
					color="dimmed"
					content="Демо будет добавлено при миграции"
					className="mt-2 text-xs"
				/>
			</Stack>
		</Stack>
	)
}
