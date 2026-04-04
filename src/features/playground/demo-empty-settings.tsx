'use client'

import { useEffect } from 'react'
import { DemoRoot, SettingSelect, SettingToggle } from './components-utils'
import { useReset, useSettings } from './settings-store'
import { Separator } from '@/ui'

export type EmptyDemoState = {
	align: 'center' | 'start'
	mediaIcon: 'none' | 'default' | 'center' | 'start'
	icon: boolean
	outline: boolean
	error: boolean
	dark: boolean
	light: boolean
	disabled: boolean
	fullWidth: boolean
	compact: boolean
	title: boolean
	desc: boolean
	helper: boolean
	actions: boolean
}

const defaultState: EmptyDemoState = {
	align: 'center',
	mediaIcon: 'none',
	icon: true,
	outline: false,
	error: false,
	dark: false,
	light: false,
	disabled: false,
	fullWidth: false,
	compact: false,
	title: true,
	desc: true,
	helper: false,
	actions: false,
}

export function DemoEmptySettings() {
	const reset = useReset<EmptyDemoState>(defaultState)
	const {
		align,
		mediaIcon,
		icon,
		title,
		desc,
		outline,
		error,
		dark,
		light,
		disabled,
		fullWidth,
		compact,
		helper,
		actions,
	} = useSettings<EmptyDemoState>()

	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(() => reset(), [])

	return (
		<DemoRoot>
			<SettingSelect id="align" label="Align" value={align} options={['center', 'start']} />
			<SettingSelect
				id="mediaIcon"
				label="Media Icon"
				value={mediaIcon}
				options={['none', 'default', 'center', 'start']}
			/>
			<Separator />
			<SettingToggle id="icon" label="Icon" checked={icon} />
			<SettingToggle id="title" label="Title" checked={title} />
			<SettingToggle id="desc" label="Description" checked={desc} />
			<SettingToggle id="helper" label="Helper line" checked={helper} />
			<SettingToggle id="actions" label="Children (any content)" checked={actions} />
			<Separator />
			<SettingToggle id="outline" label="Outline" checked={outline} />
			<SettingToggle id="error" label="Error" checked={error} />
			<SettingToggle id="dark" label="Dark surface" checked={dark} />
			<SettingToggle id="light" label="Light surface" checked={light} />
			<SettingToggle id="disabled" label="Disabled" checked={disabled} />
			<SettingToggle id="fullWidth" label="Full width" checked={fullWidth} />
			<SettingToggle id="compact" label="Compact" checked={compact} />
		</DemoRoot>
	)
}
