'use client'

import { useEffect } from 'react'
import { DemoRoot, SettingSelect, SettingToggle } from './components-utils'
import { useReset, useSettings } from './settings-store'
import { Separator } from '@/ui'

export type InputDemoState = {
	error: boolean
	helperText: boolean
	disabled: boolean
	required: boolean
	multiline: boolean
	markdown: boolean
	startIcon: 'none' | 'search' | 'mail' | 'shield-check'
	endIcon: 'none' | 'eye' | 'x' | 'image' | 'trash'
	onEndClick: boolean
}

const defaultState: InputDemoState = {
	error: false,
	helperText: false,
	disabled: false,
	required: false,
	startIcon: 'none',
	endIcon: 'none',
	onEndClick: false,
	multiline: false,
	markdown: true,
}

export function DemoInputsSettings() {
	const reset = useReset<InputDemoState>(defaultState)
	const {
		error,
		helperText,
		disabled,
		required,
		startIcon,
		endIcon,
		onEndClick,
		multiline,
		markdown,
	} = useSettings<InputDemoState>()

	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(() => reset(), [])

	return (
		<DemoRoot>
			<SettingToggle id="error" label="Error" checked={error} />
			<SettingToggle id="helperText" label="Helper text" checked={helperText} />
			<SettingToggle id="disabled" label="Disabled" checked={disabled} />
			<SettingToggle id="required" label="Required" checked={required} />
			<SettingToggle id="multiline" label="Multiline" checked={multiline} />
			<SettingToggle id="markdown" label="Markdown" checked={markdown} />
			<Separator />
			<SettingSelect
				id="startIcon"
				label="Start icon"
				value={startIcon}
				options={['none', 'search', 'mail', 'shield-check']}
			/>
			<SettingSelect
				id="endIcon"
				label="End icon"
				value={endIcon}
				options={['none', 'eye', 'x', 'image', 'trash']}
			/>
			<SettingToggle id="onEndClick" label="onEndClick (clickable)" checked={onEndClick} />
		</DemoRoot>
	)
}
