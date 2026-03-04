'use client'

import { useEffect } from 'react'
import { DemoRoot, SettingSelect, SettingToggle } from './components-utils'
import { useReset, useSettings } from './settings-store'
import { Separator, TS, type ComboboxCustomProps } from '@/ui'

export type SelectDemoState = {
	error: boolean
	disabled: boolean
	required: boolean
	helperText: boolean
	markdown: boolean
	showClear: boolean
	autoHighlight: boolean
	customVariant: NonNullable<ComboboxCustomProps['variant']>
	customSize: NonNullable<ComboboxCustomProps['size']>
}

const defaultState: SelectDemoState = {
	error: false,
	disabled: false,
	required: false,
	helperText: false,
	markdown: true,
	showClear: false,
	autoHighlight: false,
	customVariant: 'default',
	customSize: 'sm',
}

export function DemoSelectsSettings() {
	const reset = useReset<SelectDemoState>(defaultState)
	const {
		error,
		disabled,
		required,
		helperText,
		markdown,
		showClear,
		autoHighlight,
		customVariant,
		customSize,
	} = useSettings<SelectDemoState>()

	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(() => reset(), [])

	return (
		<DemoRoot>
			<SettingToggle id="error" label="Error" checked={error} />
			<SettingToggle id="helperText" label="Helper text" checked={helperText} />
			<SettingToggle id="disabled" label="Disabled" checked={disabled} />
			<SettingToggle id="required" label="Required" checked={required} />
			<SettingToggle id="markdown" label="Markdown" checked={markdown} />
			<SettingToggle id="showClear" label="Show clear" checked={showClear} />
			<SettingToggle id="autoHighlight" label="Auto highlight" checked={autoHighlight} />
			<Separator />
			<TS
				variant="caption"
				color="secondary"
				content="Данные опции действуют только для `Combobox` с **custom** items"
			/>
			<SettingSelect
				id="customVariant"
				label="Item variant"
				value={customVariant}
				options={['default', 'outline', 'muted']}
			/>
			<SettingSelect
				id="customSize"
				label="Item size"
				value={customSize}
				options={['default', 'sm']}
			/>
		</DemoRoot>
	)
}
