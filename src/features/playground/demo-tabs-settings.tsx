'use client'

import { useEffect } from 'react'
import { DemoRoot, SettingSelect, SettingToggle } from './components-utils'
import { useReset, useSettings } from './settings-store'
import { Separator } from '@/ui'

export type TabsDemoState = {
	variant: 'default' | 'line'
	size: 'default' | 'sm' | 'xs'
	bordered: boolean
	fullWidth: boolean
	fillContainer: boolean
	useIcons: boolean
	disabledTab: boolean
}

const defaultState: TabsDemoState = {
	variant: 'default',
	size: 'default',
	bordered: true,
	fullWidth: false,
	fillContainer: false,
	useIcons: false,
	disabledTab: false,
}

export function DemoTabsSettings() {
	const reset = useReset<TabsDemoState>(defaultState)
	const { variant, size, bordered, fullWidth, fillContainer, useIcons, disabledTab } =
		useSettings<TabsDemoState>()

	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(() => reset(), [])

	return (
		<DemoRoot>
			<SettingSelect
				id="variant"
				label="TabsList variant"
				value={variant}
				options={['default', 'line']}
			/>
			<SettingSelect id="size" label="Size" value={size} options={['default', 'sm', 'xs']} />
			<Separator />
			<SettingToggle id="bordered" label="Bordered box" checked={bordered} />
			<SettingToggle id="useIcons" label="Icons" checked={useIcons} />
			<SettingToggle id="disabledTab" label="Disable middle tab" checked={disabledTab} />
			<SettingToggle
				id="fullWidth"
				label="Full width"
				checked={fullWidth}
				disabled={fillContainer}
			/>
			<SettingToggle
				id="fillContainer"
				label="Fill container"
				checked={fillContainer}
				helper="`fillContainer` overrides `fullWidth`"
				helperClassName="mt-0.5!"
				disabled={fullWidth}
			/>
		</DemoRoot>
	)
}
