'use client'

import { find } from 'lodash'
import { RotateCcw } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { type ComponentDemo, componentDemos } from './components'
import { ComponentSelector } from './components-selector'
import { DemoRenderer } from './demo'
import { QuickAccess } from './quick-access'
import { PlaygroundSettingsProvider, SettingsSlot } from './settings-context'
import { Button } from '@/components/shadcn/button'
import { Separator } from '@/components/shadcn/separator'

const MAX_RECENT = 3
const LS_KEY = 'playground-recent'

function loadRecent(): ComponentDemo[] {
	try {
		const ids: string[] = JSON.parse(localStorage.getItem(LS_KEY) ?? '[]')
		return ids.map((id) => find(componentDemos, { id })).filter(Boolean) as ComponentDemo[]
	} catch {
		return []
	}
}

function saveRecent(items: ComponentDemo[]) {
	try {
		localStorage.setItem(LS_KEY, JSON.stringify(items.map((c) => c.id)))
	} catch {
		/* noop */
	}
}

export default function PlaygroundPage() {
	const [selected, setSelected] = useState<ComponentDemo | null>(componentDemos[0] ?? null)
	const [recent, setRecent] = useState<ComponentDemo[]>([])

	useEffect(() => {
		const restored = loadRecent()
		if (restored.length) {
			setRecent(restored)
			setSelected(restored[0])
		}
	}, [])

	const handleSelect = useCallback((component: ComponentDemo) => {
		setSelected(component)
		setRecent((prev) => {
			if (find(prev, { id: component.id })) return prev
			const next = [component, ...prev.filter((c) => c.id !== component.id)].slice(
				0,
				MAX_RECENT,
			)
			saveRecent(next)
			return next
		})
	}, [])

	return (
		<div className="mx-auto my-8 flex h-[calc(100vh-300px)] w-full max-w-350 flex-col gap-0 rounded-lg border">
			{/* Header — title left, controls right */}
			<div className="flex items-center justify-between py-2.5 pl-4 md:pl-8 pr-2 md:pr-4 bg-surface rounded-t-lg border-b">
				<h2 className="text-lg font-semibold tracking-tight text-foreground">Playground</h2>
				<div className="flex items-center gap-2">
					<QuickAccess recent={recent} current={selected} onSelect={handleSelect} />
					{recent.length > 0 && <Separator orientation="vertical" className="mx-1 h-5" />}
					<ComponentSelector selected={selected} onSelect={handleSelect} />
					<Button
						variant="ghost"
						size="icon"
						onClick={() => {
							setSelected(null)
							setRecent([])
							saveRecent([])
						}}
						title="Сбросить состояние демо"
					>
						<RotateCcw />
					</Button>
				</div>
			</div>
			{/* Content — bordered container like shadcn example */}
			<PlaygroundSettingsProvider>
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
					<div className="hidden w-65 shrink-0 border-l bg-surface md:block">
						<div className="flex flex-col gap-4 overflow-y-auto px-4 pb-4 pt-2">
							<div>
								<h3 className="text-md font-semibold text-foreground">
									{selected?.name ?? 'Настройки'}
								</h3>
								<p className="text-xs text-muted-foreground">
									{selected?.description ?? 'Выберите компонент.'}
								</p>
							</div>
							<Separator />
							<SettingsSlot />
						</div>
					</div>
				</div>
			</PlaygroundSettingsProvider>
		</div>
	)
}
