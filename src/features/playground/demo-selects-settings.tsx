'use client'

import { useEffect } from 'react'
import { DemoRoot, SettingToggle } from './components-utils'
import { useReset, useSettings } from './settings-store'

export type SelectDemoState = {
	error: boolean
	disabled: boolean
	required: boolean
	helperText: boolean
	freeSolo: boolean
	markdown: boolean
}

const defaultState: SelectDemoState = {
	error: false,
	disabled: false,
	required: false,
	helperText: false,
	freeSolo: false,
	markdown: true,
}

export function DemoSelectsSettings() {
	const reset = useReset<SelectDemoState>(defaultState)
	const { error, disabled, required, helperText, freeSolo, markdown } =
		useSettings<SelectDemoState>()

	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(() => reset(), [])

	return (
		<DemoRoot>
			<SettingToggle id="error" label="Error" checked={error} />
			<SettingToggle id="helperText" label="Helper text" checked={helperText} />
			<SettingToggle id="disabled" label="Disabled" checked={disabled} />
			<SettingToggle id="required" label="Required" checked={required} />
			<SettingToggle id="freeSolo" label="freeSolo (Combobox)" checked={freeSolo} />
			<SettingToggle id="markdown" label="Markdown" checked={markdown} />
		</DemoRoot>
	)
}
