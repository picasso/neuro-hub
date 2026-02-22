'use client'

import { useState } from 'react'
import { useRegisterSettings } from './settings-context'
import { Label } from '@/components/shadcn/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/shadcn/select'
import { Separator } from '@/components/shadcn/separator'
import { Slider } from '@/components/shadcn/slider'
import { Switch } from '@/components/shadcn/switch'
import { ToggleGroup, ToggleGroupItem } from '@/components/shadcn/toggle-group'
import { Icon, type IconName } from '@/components/ui/icon'
import { cn } from '@/lib/utils'

// data -------------------------------------------------------------------------------------------]

const libraryIcons: IconName[] = [
	'alert-triangle',
	'badge-check',
	'ban',
	'book-marked',
	'briefcase',
	'building',
	'check',
	'chevron-down',
	'circle-alert',
	'circle-check',
	'code',
	'credit-card',
	'eye',
	'eye-off',
	'file-text',
	'gavel',
	'github',
	'image',
	'layout-grid',
	'log-in',
	'mail',
	'percent',
	'quote',
	'search',
	'shield-check',
	'star',
	'thumbs-up',
	'trash',
	'user',
	'user-plus',
	'users',
	'video',
	'volume',
	'x',
]

const customIconNames: IconName[] = ['spinner', 'linked-in', 'telegram', 'x-twitter']

const sizePresets = ['xs', 'sm', 'md', 'lg', 'xl'] as const
const colorOptions = [
	'primary',
	'cta',
	'muted',
	'dimmed',
	'destructive',
	'success',
	'warning',
	'info',
	'contrast',
] as const

type IconColor = (typeof colorOptions)[number]
type IconSize = (typeof sizePresets)[number]

// settings state ---------------------------------------------------------------------------------]

type IconDemoState = {
	showName: boolean
	showBorder: boolean
	showBg: boolean
	color: IconColor | null
	sizePreset: IconSize | 'custom'
	customSize: number
}

const defaultState: IconDemoState = {
	showName: false,
	showBorder: false,
	showBg: false,
	color: null,
	sizePreset: 'lg',
	customSize: 24,
}

// settings panel component -----------------------------------------------------------------------]

type DemoIconsSettingsProps = {
	state: IconDemoState
	onChange: (next: IconDemoState) => void
}

function DemoIconsSettings({ state, onChange }: DemoIconsSettingsProps) {
	const set = <K extends keyof IconDemoState>(key: K, value: IconDemoState[K]) =>
		onChange({ ...state, [key]: value })

	return (
		<div className="flex flex-col gap-4">
			{/* show name toggle */}
			<div className="flex items-center justify-between">
				<Label htmlFor="show-name" className="text-xs">
					Показывать имя
				</Label>
				<Switch
					id="show-name"
					checked={state.showName}
					onCheckedChange={(v) => set('showName', v)}
				/>
			</div>
			{/* show border toggle */}
			<div className="flex items-center justify-between">
				<Label htmlFor="show-border" className="text-xs">
					Рамка вокруг иконки
				</Label>
				<Switch
					id="show-border"
					checked={state.showBorder}
					onCheckedChange={(v) => set('showBorder', v)}
				/>
			</div>
			{/* show background toggle */}
			<div className="flex items-center justify-between">
				<Label htmlFor="show-bg" className="text-xs">
					Подложка под иконкой
				</Label>
				<Switch
					id="show-bg"
					checked={state.showBg}
					onCheckedChange={(v) => set('showBg', v)}
				/>
			</div>
			<Separator />
			{/* color select */}
			<div className="flex flex-col gap-2">
				<Label className="text-xs">Цвет</Label>
				<Select
					value={state.color ?? 'none'}
					onValueChange={(v) => set('color', v === 'none' ? null : (v as IconColor))}
				>
					<SelectTrigger className="h-8 text-xs">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="none">По умолчанию</SelectItem>
						{colorOptions.map((c) => (
							<SelectItem key={c} value={c}>
								{c}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
			<Separator />
			{/* size presets */}
			<div className="flex flex-col gap-2">
				<Label className="text-xs">Размер</Label>
				<ToggleGroup
					type="single"
					value={state.sizePreset}
					onValueChange={(v: IconSize | 'custom') => {
						if (!v) return
						onChange({
							...state,
							sizePreset: v,
							...(v !== 'custom' && { customSize: sizeMap[v] }),
						})
					}}
					className="justify-start border border-border"
				>
					{sizePresets.map((s) => (
						<ToggleGroupItem
							key={s}
							value={s}
							size="lg"
							className="text-[14px] p-2.5 font-semibold"
						>
							{s}
						</ToggleGroupItem>
					))}
					<ToggleGroupItem
						value="custom"
						size="lg"
						className="text-[14px] p-2.5 font-semibold"
					>
						px
					</ToggleGroupItem>
				</ToggleGroup>
			</div>
			{/* custom size slider */}
			<div className="flex flex-col gap-4">
				<div className="flex items-center justify-between">
					<Label className="text-xs">Свой размер</Label>
					<span className="text-[10px] text-muted-foreground">{state.customSize}px</span>
				</div>
				<Slider
					value={[state.customSize]}
					onValueChange={([v]) => set('customSize', v)}
					min={10}
					max={80}
					step={2}
					disabled={state.sizePreset !== 'custom'}
				/>
			</div>
		</div>
	)
}

// helpers ----------------------------------------------------------------------------------------]

const sizeMap: Record<IconSize, number> = { xs: 14, sm: 16, md: 20, lg: 24, xl: 32 }

function resolveSize(sizePreset: IconSize | 'custom', customSize: number): number {
	return sizePreset === 'custom' ? customSize : sizeMap[sizePreset]
}

// icon cell --------------------------------------------------------------------------------------]

type IconCellProps = {
	name: IconName
	state: IconDemoState
	spinning?: boolean
}

function IconCell({
	name,
	state: { showName, showBorder, showBg, color, sizePreset, customSize },
	spinning,
}: IconCellProps) {
	return (
		<div
			className={cn(
				'group flex flex-col items-center gap-1.5 transition-colors rounded-md hover:bg-primary/15',
				showBorder && 'border p-2.5',
				showBg && 'bg-primary rounded-full hover:bg-emerald-600',
				showBg && showBorder && 'border-emerald-600',
				!showBorder && 'p-1.5',
			)}
		>
			<Icon
				name={name}
				size={resolveSize(sizePreset, customSize)}
				color={color ?? undefined}
				spinning={spinning}
			/>
			{showName && (
				<span className="max-w-18 truncate text-[10px] text-muted-foreground group-hover:text-foreground">
					{name}
				</span>
			)}
		</div>
	)
}

// main demo component ----------------------------------------------------------------------------]

export function DemoIcons() {
	const [state, setState] = useState<IconDemoState>(defaultState)

	useRegisterSettings(<DemoIconsSettings state={state} onChange={setState} />)

	return (
		<div className="flex flex-col gap-4">
			{/* lucide icons grid */}
			<section>
				<h3 className="my-1 text-sm font-medium text-foreground">
					Lucide Icons ({libraryIcons.length})
				</h3>
				<p className="mb-4 text-xs text-muted-foreground">
					Основная библиотека. Имена в kebab-case.
				</p>
				<div className="flex flex-wrap gap-2">
					{libraryIcons.map((name) => (
						<IconCell key={name} name={name} state={state} />
					))}
				</div>
			</section>
			<Separator />
			{/* custom SVG icons */}
			<section>
				<h3 className="my-1 text-sm font-medium text-foreground">
					Custom SVG ({customIconNames.length})
				</h3>
				<p className="mb-4 text-xs text-muted-foreground">
					Брендовые и специальные иконки. Кастомные SVG-компоненты.
				</p>
				<div className="flex flex-wrap gap-2">
					{customIconNames.map((name) => (
						<IconCell
							key={name}
							name={name}
							state={state}
							spinning={name === 'spinner'}
						/>
					))}
				</div>
			</section>
			<Separator />
			{/* color presets — always shows all colors, ignores settings */}
			<section>
				<h3 className="my-1 text-sm font-medium text-foreground">Color Presets</h3>
				<p className="mb-4 text-xs text-muted-foreground">
					color prop → Tailwind text-* класс. className перебивает color.
				</p>
				<div className="flex items-center gap-4">
					{colorOptions.map((c) => (
						<div key={c} className="flex flex-col items-center gap-2">
							<Icon name="circle-check" size="xl" color={c} />
							<span className="text-[10px] text-muted-foreground">{c}</span>
						</div>
					))}
				</div>
				<div className="mt-4 flex items-center gap-3 rounded-md border p-3">
					<Icon name="star" size="lg" color="primary" className="text-yellow-400" />
					<span className="text-xs text-muted-foreground">
						color=&quot;primary&quot; + className=&quot;text-yellow-400&quot; →
						className wins
					</span>
				</div>
			</section>
			<Separator />
			{/* size presets — always shows all sizes, ignores settings */}
			<section>
				<h3 className="my-1 text-sm font-medium text-foreground">Size Presets</h3>
				<p className="mb-4 text-xs text-muted-foreground">
					xs=14, sm=16, md=20 (default), lg=24, xl=32. Также принимает число (px).
				</p>
				<div className="flex items-end gap-6">
					{sizePresets.map((s) => (
						<div key={s} className="flex flex-col items-center gap-2">
							<Icon name="star" size={s} />
							<span className="text-[10px] text-muted-foreground">{s}</span>
						</div>
					))}
					<div className="flex flex-col items-center gap-2">
						<Icon name="star" size={48} />
						<span className="text-[10px] text-muted-foreground">48px</span>
					</div>
					<div className="flex flex-col items-center gap-2">
						<Icon name="star" size={80} />
						<span className="text-[10px] text-muted-foreground">80px</span>
					</div>
				</div>
			</section>
			<Separator />
			{/* spinning — always shows, ignores settings */}
			<section>
				<h3 className="my-1 text-sm font-medium text-foreground">Spinning</h3>
				<p className="mb-4 text-xs text-muted-foreground">
					spinning prop добавляет animate-spin.
				</p>
				<div className="flex items-center gap-6">
					<div className="flex flex-col items-center gap-2">
						<Icon name="spinner" size="lg" spinning />
						<span className="text-[10px] text-muted-foreground">spinner</span>
					</div>
					<div className="flex flex-col items-center gap-2">
						<Icon name="spinner" size="lg" color="primary" spinning />
						<span className="text-[10px] text-muted-foreground">+ primary</span>
					</div>
					<div className="flex flex-col items-center gap-2">
						<Icon name="spinner" size="xl" color="cta" spinning />
						<span className="text-[10px] text-muted-foreground">xl + cta</span>
					</div>
				</div>
			</section>
		</div>
	)
}
