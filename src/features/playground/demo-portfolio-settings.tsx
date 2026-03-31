'use client'

import { useEffect } from 'react'
import { DemoLabel, DemoRoot, SettingSelect, SettingToggle } from './components-utils'
import { useReset, useSettings, useUpdateSettings } from './settings-store'
import { Button, Label, Separator, Slider, Stack, type PortfolioAlbumProps } from '@/ui'

// settings state ---------------------------------------------------------------------------------]

type MediaAction = NonNullable<PortfolioAlbumProps['selectedActions']>[number]
export type PortfolioDemoState = {
	disabled: boolean
	onlyImages: boolean
	allowSelection: boolean
	selectedActions: string
	linkActionPreview: boolean
	refreshKey: number
	fade: '200' | '300' | '500' | '800' | '1000'
	fadeFn: 'ease-in-out' | 'ease-in' | 'ease-out' | 'linear'
	slow: boolean
	random: boolean
	delay: number
}

const defaultState: PortfolioDemoState = {
	disabled: false,
	onlyImages: true,
	allowSelection: false,
	selectedActions: '',
	linkActionPreview: false,
	refreshKey: 0,
	fade: '500',
	fadeFn: 'ease-in-out',
	slow: false,
	random: false,
	delay: 0,
}

// settings panel component -----------------------------------------------------------------------]

export function DemoPortfolioSettings() {
	const [update] = useUpdateSettings<PortfolioDemoState>()
	const reset = useReset<PortfolioDemoState>(defaultState)
	const {
		disabled,
		onlyImages,
		allowSelection,
		selectedActions,
		linkActionPreview,
		refreshKey,
		fade,
		fadeFn,
		slow,
		random,
		delay,
	} = useSettings<PortfolioDemoState>()

	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(() => reset(), [])

	return (
		<DemoRoot>
			<SettingToggle id="onlyImages" label="Only images" checked={onlyImages} />
			<SettingToggle id="allowSelection" label="Allow selection" checked={allowSelection} />
			<SettingToggle
				id="linkActionPreview"
				label="Link Preview Action"
				checked={linkActionPreview}
			/>
			<SettingToggle id="disabled" label="Disabled" checked={disabled} />
			<Separator />
			<SettingSelect
				id="selectedActions"
				label="Selected actions"
				value={selectedActions}
				options={[
					{ label: 'Delete', value: 'delete' },
					{ label: 'Preview', value: 'preview' },
					{ label: 'Edit', value: 'edit' },
					{ label: 'Preview + Delete', value: 'preview+delete' },
					{ label: 'Delete + Edit', value: 'delete+edit' },
					{ label: 'Edit + Preview', value: 'edit+preview' },
					{ label: 'Delete + Preview + Edit', value: 'delete+preview+edit' },
				]}
			/>
			<SettingSelect
				id="fade"
				label="Fade duration"
				value={fade}
				options={['200', '300', '500', '800', '1000']}
			/>
			<SettingSelect
				id="fadeFn"
				label="Fade function"
				value={fadeFn}
				options={['ease-in-out', 'ease-in', 'ease-out', 'linear']}
			/>
			<Separator />
			<SettingToggle id="slow" label="Slow" checked={slow} />
			{slow && (
				<>
					<SettingToggle id="random" label="Random" checked={random} />
					<Stack gap={0} justify="space-between">
						<Label className="text-xs">Задержка</Label>
						<DemoLabel content={`${delay}ms`} size="xs" />
					</Stack>
					<Slider
						value={[delay]}
						onValueChange={([v]) => update({ delay: v })}
						min={600}
						max={2100}
						step={300}
						disabled={!!random}
					/>
				</>
			)}
			<Button
				size="lg"
				label="Refresh"
				leftIcon="history"
				iconOptions={{ color: 'contrast' }}
				onClick={() => update({ refreshKey: refreshKey + 1 })}
			/>
		</DemoRoot>
	)
}

export const mediaActionOptions: Record<string, MediaAction[]> = {
	delete: ['delete'],
	preview: ['preview'],
	edit: ['edit'],
	'preview+delete': ['preview', 'delete'],
	'delete+edit': ['delete', 'edit'],
	'edit+preview': ['edit', 'preview'],
	'delete+preview+edit': ['delete', 'preview', 'edit'],
}
