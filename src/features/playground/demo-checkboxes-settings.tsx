'use client'

import { useEffect } from 'react'
import { DemoRoot, SettingToggle } from './components-utils'
import { useReset, useSettings } from './settings-store'

export type CheckboxDemoState = {
	error: boolean
	helperText: boolean
	disabled: boolean
	required: boolean
	markdown: boolean
}

const defaultState: CheckboxDemoState = {
	error: false,
	helperText: false,
	disabled: false,
	required: false,
	markdown: true,
}

export function DemoCheckboxesSettings() {
	const reset = useReset<CheckboxDemoState>(defaultState)
	const { error, helperText, disabled, required, markdown } = useSettings<CheckboxDemoState>()

	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(() => reset(), [])

	return (
		<DemoRoot>
			<SettingToggle id="error" label="Error" checked={error} />
			<SettingToggle id="helperText" label="Helper text" checked={helperText} />
			<SettingToggle id="disabled" label="Disabled" checked={disabled} />
			<SettingToggle id="required" label="Required" checked={required} />
			<SettingToggle id="markdown" label="Markdown" checked={markdown} />
		</DemoRoot>
	)
}
