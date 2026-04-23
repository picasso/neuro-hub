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
	endIcon: 'none' | 'eye' | 'x' | 'image' | 'trash' | 'check'
	endIconInline: boolean
	endIconDisabled: boolean
	onEndClick: boolean
	showClear: boolean
	inline: boolean
	enableOnFocus: boolean
}

const defaultState: InputDemoState = {
	error: false,
	helperText: false,
	disabled: false,
	required: false,
	startIcon: 'none',
	endIcon: 'none',
	endIconInline: false,
	endIconDisabled: false,
	onEndClick: false,
	multiline: false,
	markdown: true,
	showClear: false,
	inline: false,
	enableOnFocus: false,
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
		endIconInline,
		endIconDisabled,
		onEndClick,
		multiline,
		markdown,
		showClear,
		inline,
		enableOnFocus,
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
			<SettingToggle id="showClear" label="Show clear" checked={showClear} />
			<SettingToggle id="inline" label="Inline" checked={inline} />
			{inline && (
				<SettingToggle id="enableOnFocus" label="Enable on focus" checked={enableOnFocus} />
			)}
			<Separator />
			<SettingSelect
				id="startIcon"
				label="Start icon"
				value={startIcon}
				options={['none', 'search', 'mail', 'shield-check']}
			/>
			{!inline && (
				<SettingSelect
					id="endIcon"
					label="End icon"
					value={endIcon}
					options={['none', 'eye', 'x', 'image', 'trash', 'check']}
				/>
			)}
			<SettingToggle id="endIconInline" label="End icon inline" checked={endIconInline} />
			{!inline && (
				<SettingToggle
					id="endIconDisabled"
					label="End icon disabled"
					checked={endIconDisabled}
				/>
			)}
			<SettingToggle id="onEndClick" label="onEndClick (fn)" checked={onEndClick} />
		</DemoRoot>
	)
}
