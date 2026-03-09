'use client'

import { useEffect } from 'react'
import { DemoRoot, SettingSelect, SettingToggle } from './components-utils'
import { useReset, useSettings } from './settings-store'
import { updateAlertOptions, type AlertOptions } from '@/alerts'
import { Separator } from '@/ui'

const positionOptions = [
	'top-left',
	'top-center',
	'top-right',
	'bottom-left',
	'bottom-center',
	'bottom-right',
] as const

const durationOptions = [
	{ label: '1s', value: '1000' },
	{ label: '4s', value: '4000' },
	{ label: '10s', value: '10000' },
	{ label: 'Infinite', value: 'infinity' },
]

export type AlertOptionsDemoState = {
	position: (typeof positionOptions)[number]
	visibleToasts: string
	duration: string
	gap: string
	expand: boolean
	descAsMarkdown: boolean
}

const defaultState: AlertOptionsDemoState = {
	position: 'bottom-left',
	visibleToasts: '3',
	duration: '4000',
	gap: '10',
	expand: true,
	descAsMarkdown: false,
}

function toAlertOptions(state: AlertOptionsDemoState): Partial<AlertOptions> {
	return {
		position: state.position,
		visibleToasts: Number(state.visibleToasts),
		duration: state.duration === 'infinity' ? Infinity : Number(state.duration),
		gap: Number(state.gap),
		expand: state.expand,
	}
}

export function DemoAlertSettings() {
	const reset = useReset<AlertOptionsDemoState>(defaultState)
	const settings = useSettings<AlertOptionsDemoState>()

	useEffect(() => {
		reset()
		updateAlertOptions(toAlertOptions(defaultState))
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		updateAlertOptions(toAlertOptions(settings))
		// only sync when AlertOptions fields change, not descAsMarkdown
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [
		settings.position,
		settings.visibleToasts,
		settings.duration,
		settings.gap,
		settings.expand,
	])

	return (
		<DemoRoot>
			<SettingSelect
				id="position"
				label="Position"
				value={settings.position}
				options={[...positionOptions]}
			/>
			<SettingSelect
				id="visibleToasts"
				label="Visible toasts"
				value={settings.visibleToasts}
				options={['1', '2', '3', '4', '5']}
			/>
			<SettingSelect
				id="duration"
				label="Duration"
				value={settings.duration}
				options={durationOptions}
			/>
			<SettingSelect
				id="gap"
				label="Gap"
				value={settings.gap}
				options={['4', '8', '10', '12', '16']}
			/>
			<Separator />
			<SettingToggle id="expand" label="Expand" checked={settings.expand} />
			<SettingToggle
				id="descAsMarkdown"
				label="Description as Markdown"
				checked={settings.descAsMarkdown}
			/>
		</DemoRoot>
	)
}
