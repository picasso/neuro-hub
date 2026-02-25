'use client'

import { useEffect } from 'react'
import { DemoRoot, SettingSelect, SettingToggle } from './components-utils'
import { useReset, useSettings } from './settings-store'
import { Separator } from '@/components/shadcn/separator'
import { type IconButtonProps } from '@/components/ui'

export type IconButtonDemoState = {
	showName: boolean
	variant: NonNullable<IconButtonProps['variant']>
	size: NonNullable<IconButtonProps['size']>
	rounded: boolean
	disabled: boolean
	spinning: boolean
	forceSize: 'auto' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

const defaultState: IconButtonDemoState = {
	showName: false,
	variant: 'ghost',
	size: 'icon',
	rounded: false,
	disabled: false,
	spinning: false,
	forceSize: 'auto',
}

export function DemoIconButtonsSettings() {
	const reset = useReset<IconButtonDemoState>(defaultState)
	const { showName, variant, size, rounded, disabled, spinning, forceSize } =
		useSettings<IconButtonDemoState>()

	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(() => reset(), [])

	return (
		<DemoRoot>
			<SettingToggle id="showName" label="Показывать имя" checked={showName} />
			<Separator />
			<SettingSelect
				id="variant"
				label="Variant"
				value={variant}
				options={['default', 'outline', 'secondary', 'destructive', 'ghost', 'contrast']}
			/>
			<SettingSelect
				id="size"
				label="Size"
				value={size}
				options={['icon', 'sm', 'md', 'lg', 'xl']}
			/>
			<SettingSelect
				id="forceSize"
				label="Force icon size"
				value={forceSize}
				options={['auto', 'xs', 'sm', 'md', 'lg', 'xl']}
			/>
			<Separator />
			<SettingToggle id="rounded" label="Rounded" checked={rounded} />
			<SettingToggle id="disabled" label="Disabled" checked={disabled} />
			<SettingToggle id="spinning" label="Spinning" checked={spinning} />
		</DemoRoot>
	)
}
