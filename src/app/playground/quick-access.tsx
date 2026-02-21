import { type ComponentDemo } from './components'
import { Button } from '@/components/shadcn/button'

type QuickAccessProps = {
	recent: ComponentDemo[]
	current: ComponentDemo | null
	onSelect: (component: ComponentDemo) => void
}

export function QuickAccess({ recent, current, onSelect }: QuickAccessProps) {
	if (recent.length === 0) return null

	return (
		<div className="flex items-center gap-1.5">
			{recent.map((component) => (
				<Button
					key={component.id}
					variant={current?.id === component.id ? 'secondary' : 'ghost'}
					size="sm"
					onClick={() => onSelect(component)}
					className="text-xs"
				>
					{component.name}
				</Button>
			))}
		</div>
	)
}
