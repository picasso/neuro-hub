'use client'

import { find } from 'lodash'
import { RotateCcw } from 'lucide-react'
import { useCallback, useState } from 'react'
import { type ComponentDemo, componentDemos } from './components'
import { ComponentSelector } from './components-selector'
import { DemoRenderer } from './demo'
import { QuickAccess } from './quick-access'
import { Button } from '@/components/shadcn/button'
import { Separator } from '@/components/shadcn/separator'

const MAX_RECENT = 3

export default function PlaygroundPage() {
	const [selected, setSelected] = useState<ComponentDemo | null>(componentDemos[0] ?? null)
	const [recent, setRecent] = useState<ComponentDemo[]>([])

	const handleSelect = useCallback((component: ComponentDemo) => {
		setSelected(component)
		setRecent((prev) => {
			if (find(prev, { id: component.id })) return prev
			const filtered = prev.filter((c) => c.id !== component.id)
			return [component, ...filtered].slice(0, MAX_RECENT)
		})
	}, [])

	return (
		<div className="mx-auto my-8 flex h-[calc(100vh-300px)] w-full max-w-[1400px] flex-col gap-0 rounded-lg border">
			{/* Header — title left, controls right */}
			<div className="flex items-center justify-between pl-4 md:pl-8 pr-2 md:pr-4 bg-surface rounded-t-lg border-b">
				<h2 className="text-lg font-semibold tracking-tight text-foreground">Playground</h2>
				<div className="flex items-center gap-2">
					<QuickAccess recent={recent} current={selected} onSelect={handleSelect} />
					{recent.length > 0 && <Separator orientation="vertical" className="mx-1 h-5" />}
					<ComponentSelector selected={selected} onSelect={handleSelect} />
					<Button
						variant="ghost"
						size="icon"
						onClick={() => setSelected((s) => (s ? { ...s } : s))}
						title="Сбросить состояние демо"
					>
						<RotateCcw />
					</Button>
				</div>
			</div>

			{/* Content — bordered container like shadcn example */}
			<div className="flex min-h-0 flex-1 overflow-hidden rounded-b-lg">
				{/* Demo area */}
				<div className="flex-1 overflow-auto p-6">
					{selected ? (
						<DemoRenderer component={selected} />
					) : (
						<div className="flex h-full items-center justify-center text-sm text-muted-foreground">
							Выберите компонент из списка
						</div>
					)}
				</div>

				{/* Side panel — component-specific settings */}
				<div className="hidden w-[260px] shrink-0 border-l bg-surface md:block">
					<div className="flex flex-col gap-4 px-4 pb-4 pt-2">
						<div>
							<h3 className="text-sm font-medium text-foreground">Настройки</h3>
							<p className="text-xs text-muted-foreground">
								Параметры выбранного компонента.
							</p>
						</div>
						<Separator />
						{selected ? (
							<p className="text-xs text-muted-foreground">
								Настройки для «{selected.name}» появятся при миграции.
							</p>
						) : (
							<p className="text-xs text-muted-foreground">Выберите компонент.</p>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}
