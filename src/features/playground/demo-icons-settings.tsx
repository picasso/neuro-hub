'use client'

import { map } from 'lodash'
import { useEffect } from 'react'
import { DemoLabel, DemoRoot, SettingSelect, SettingToggle } from './components-utils'
import { useReset, useSettings, useUpdateSettings } from './settings-store'
import { Label, Separator, Slider, ToggleGroup, ToggleGroupItem, Stack, type IconName } from '@/ui'

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
	const [update] = useUpdateSettings<IconDemoState>()
	const reset = useReset<IconDemoState>(defaultState)
	const { showName, showBorder, showBg, color, sizePreset, customSize } =
		useSettings<IconDemoState>()

	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(() => reset(), [])

	return (
		<DemoRoot>
			<SettingToggle id="showName" label="Показывать имя" checked={showName} />
			<SettingToggle id="showBorder" label="Рамка вокруг иконки" checked={showBorder} />
			<SettingToggle id="showBg" label="Подложка под иконкой" checked={showBg} />
			<Separator />
			<SettingSelect id="color" label="Цвет" value={color ?? 'none'} options={selectOps} />
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
					<DemoLabel content={`${customSize}px`} size="xs" />
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
		</DemoRoot>
	)
}

// data -------------------------------------------------------------------------------------------]

const libraryIcons: IconName[] = [
	'alert-triangle',
	'badge-check',
	'ban',
	'blocks',
	'book-marked',
	'bot',
	'briefcase',
	'briefcase-business',
	'building',
	'check',
	'check-check',
	'chevron-down',
	'chevron-left',
	'chevron-right',
	'chevrons-up-down',
	'circle',
	'circle-alert',
	'circle-check',
	'code',
	'circuit-board',
	'credit-card',
	'eye',
	'eye-off',
	'file-text',
	'folder-kanban',
	'frown',
	'gavel',
	'github',
	'history',
	'image',
	'info',
	'layout-dashboard',
	'layout-grid',
	'loader',
	'loader-circle',
	'loader-pinwheel',
	'log-in',
	'log-out',
	'mail',
	'message-circle-check',
	'more-horizontal',
	'percent',
	'plus',
	'quote',
	'rotate-ccw',
	'scale',
	'search',
	'shield-check',
	'sliders-horizontal',
	'star',
	'thumbs-up',
	'trash',
	'user',
	'user-plus',
	'users',
	'users-round',
	'video',
	'volume',
	'workflow',
	'x',
	'brain-circuit',
	'binoculars',
	'film',
	'cog',
	'file-sliders',
	'construction',
	'weight-tilde',
	'chart-area',
]

const customIconNames: IconName[] = [
	'spinner',
	'linked-in',
	'telegram',
	'x-twitter',
	'api',
	'missing',
	'missing-more',
	'nobody',
]

const sizePresets = ['xs', 'sm', 'md', 'lg', 'xl'] as const
const colorOptions = [
	'primary',
	'secondary',
	'current',
	'cta',
	'dimmed',
	'error',
	'success',
	'warning',
	'info',
	'contrast',
	'soft',
] as const

const selectOps = [
	{ label: 'По умолчанию', value: 'none' },
	...map(colorOptions, (c) => ({ label: c, value: c })),
]

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
