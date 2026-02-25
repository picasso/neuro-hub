'use client'

import { useEffect } from 'react'
import { useReset, useSettings, useUpdateSettings } from './settings-store'
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
import { Stack, TS, type IconName } from '@/components/ui'

type IconColor = (typeof colorOptions)[number]
type IconSize = (typeof sizePresets)[number]

// settings state ---------------------------------------------------------------------------------]

export type IconDemoState = {
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

export function DemoIconsSettings() {
	const [update, toggle] = useUpdateSettings<IconDemoState>()
	const reset = useReset<IconDemoState>(defaultState)
	const { showName, showBorder, showBg, color, sizePreset, customSize } =
		useSettings<IconDemoState>()

	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(() => reset(), [])

	return (
		<Stack vertical gap={4} align="stretch">
			{/* show name toggle */}
			<Stack gap={0} justify="space-between">
				<Label htmlFor="show-name" className="text-xs">
					Показывать имя
				</Label>
				<Switch
					id="show-name"
					checked={showName}
					onCheckedChange={() => toggle('showName')}
				/>
			</Stack>
			{/* show border toggle */}
			<Stack gap={0} justify="space-between">
				<Label htmlFor="show-border" className="text-xs">
					Рамка вокруг иконки
				</Label>
				<Switch
					id="show-border"
					checked={showBorder}
					onCheckedChange={() => toggle('showBorder')}
				/>
			</Stack>
			{/* show background toggle */}
			<Stack gap={0} justify="space-between">
				<Label htmlFor="show-bg" className="text-xs">
					Подложка под иконкой
				</Label>
				<Switch id="show-bg" checked={showBg} onCheckedChange={() => toggle('showBg')} />
			</Stack>
			<Separator />
			{/* color select */}
			<Stack vertical gap={2} align="stretch">
				<Label className="text-xs">Цвет</Label>
				<Select
					value={color ?? 'none'}
					onValueChange={(v: IconColor | 'none') =>
						update({ color: v === 'none' ? null : v })
					}
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
			</Stack>
			<Separator />
			{/* size presets */}
			<Stack vertical gap={2} align="stretch">
				<Label className="text-xs">Размер</Label>
				<ToggleGroup
					type="single"
					value={sizePreset}
					onValueChange={(v: IconSize | 'custom') => {
						if (!v) return
						update({ sizePreset: v })
						if (v !== 'custom') update({ customSize: sizeMap[v] })
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
			</Stack>
			{/* custom size slider */}
			<Stack vertical gap={4} align="stretch">
				<Stack gap={0} justify="space-between">
					<Label className="text-xs">Свой размер</Label>
					<TS
						variant="caption"
						color="secondary"
						content={`${customSize}px`}
						inline
						className="text-[10px]"
					/>
				</Stack>
				<Slider
					value={[customSize]}
					onValueChange={([v]) => update({ customSize: v })}
					min={10}
					max={80}
					step={2}
					disabled={sizePreset !== 'custom'}
				/>
			</Stack>
		</Stack>
	)
}

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
	'loader',
	'loader-circle',
	'loader-pinwheel',
	'chevron-left',
	'chevron-right',
	'chevrons-up-down',
]

const customIconNames: IconName[] = ['spinner', 'linked-in', 'telegram', 'x-twitter']

const sizePresets = ['xs', 'sm', 'md', 'lg', 'xl'] as const
const colorOptions = [
	'primary',
	'cta',
	'muted',
	'dimmed',
	'error',
	'success',
	'warning',
	'info',
	'contrast',
] as const

export const demoData = {
	libraryIcons,
	customIconNames,
	sizePresets,
	colorOptions,
}

// helpers ----------------------------------------------------------------------------------------]

const sizeMap: Record<IconSize, number> = { xs: 14, sm: 16, md: 20, lg: 24, xl: 32 }

export function resolveSize(sizePreset: IconSize | 'custom', customSize: number): number {
	return sizePreset === 'custom' ? customSize : sizeMap[sizePreset]
}
