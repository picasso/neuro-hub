'use client'

import { find } from 'lodash'
import { useCallback, useEffect, useState } from 'react'
import { type ComponentDemo, componentDemos } from './components'
import { ComponentSelector } from './components-selector'
import { DemoRenderer, SettingsRenderer } from './demo'
import { QuickAccess } from './quick-access'
import { Separator, Stack, TS, IconButton } from '@/ui'

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

export function PlaygroundPage() {
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
		<Stack
			vertical
			gap={0}
			align="stretch"
			className="mx-auto my-8 h-[calc(100vh-300px)] w-full max-w-350 rounded-lg border"
		>
			{/* Header — title left, controls right */}
			<Stack
				gap={0}
				justify="space-between"
				className="py-2.5 pl-4 pr-2 md:pl-8 md:pr-4 bg-surface rounded-t-lg border-b"
			>
				<TS clean variant="h2" content="Playground" />
				<Stack gap={2}>
					<QuickAccess recent={recent} current={selected} onSelect={handleSelect} />
					{recent.length > 0 && <Separator orientation="vertical" className="mx-1 h-5" />}
					<ComponentSelector selected={selected} onSelect={handleSelect} />
					<IconButton
						icon="history"
						variant="ghost"
						size="sm"
						onClick={() => {
							setSelected(null)
							setRecent([])
							saveRecent([])
						}}
						title="Сбросить состояние демо"
					/>
				</Stack>
			</Stack>
			{/* Content — bordered container like shadcn example */}
			<Stack gap={0} align="stretch" className="min-h-0 flex-1 overflow-hidden rounded-b-lg">
				{/* Demo area */}
				<div className="flex-1 overflow-auto p-6">
					{selected ? (
						<DemoRenderer component={selected} />
					) : (
						<Stack
							gap={0}
							justify="center"
							className="h-full text-sm text-muted-foreground"
						>
							Выберите компонент из списка
						</Stack>
					)}
				</div>
				{/* Side panel — component-specific settings */}
				<div className="hidden w-65 shrink-0 border-l bg-surface md:block">
					<Stack
						vertical
						gap={4}
						align="stretch"
						className="overflow-y-auto px-4 pb-4 pt-2"
					>
						<Stack vertical gap={0} align="stretch">
							<TS
								variant="h3"
								content={selected?.name ?? 'Настройки'}
								className="font-semibold text-base"
							/>
							<TS
								variant="caption"
								color="secondary"
								content={selected?.description ?? 'Выберите компонент.'}
							/>
						</Stack>
						<Separator />
						<SettingsRenderer component={selected} />
					</Stack>
				</div>
			</Stack>
		</Stack>
	)
}
