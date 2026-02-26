'use client'

import { useEffect } from 'react'
import { DemoRoot, SettingSelect, SettingToggle } from './components-utils'
import { useReset, useSettings } from './settings-store'
import { Separator, type ButtonProps } from '@/ui'

export type ButtonDemoState = {
	variant: NonNullable<ButtonProps['variant']>
	size: NonNullable<ButtonProps['size']>
	disabled: boolean
	fullWidth: boolean
	bold: boolean
	noWrap: boolean
	leftIcon: boolean
	rightIcon: boolean
}

const defaultState: ButtonDemoState = {
	variant: 'default',
	size: 'md',
	disabled: false,
	fullWidth: false,
	bold: false,
	noWrap: false,
	leftIcon: true,
	rightIcon: false,
}

export function DemoButtonsSettings() {
	const reset = useReset<ButtonDemoState>(defaultState)
	const { variant, size, disabled, fullWidth, bold, noWrap, leftIcon, rightIcon } =
		useSettings<ButtonDemoState>()

	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(() => reset(), [])

	return (
		<DemoRoot>
			<SettingSelect
				id="variant"
				label="Variant"
				value={variant}
				options={['default', 'outline', 'secondary', 'destructive', 'ghost']}
			/>
			<SettingSelect
				id="size"
				label="Size"
				value={size}
				options={['xs', 'sm', 'md', 'lg', 'xl']}
			/>
			<Separator />
			<SettingToggle id="disabled" label="Disabled" checked={disabled} />
			<SettingToggle id="fullWidth" label="Full width" checked={fullWidth} />
			<SettingToggle id="bold" label="Bold" checked={bold} />
			<SettingToggle id="noWrap" label="No wrap" checked={noWrap} />
			<SettingToggle id="leftIcon" label="Left icon" checked={leftIcon} />
			<SettingToggle id="rightIcon" label="Right icon" checked={rightIcon} />
		</DemoRoot>
	)
}
