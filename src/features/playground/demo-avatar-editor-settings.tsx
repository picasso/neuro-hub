'use client'

import { useEffect } from 'react'
import { DemoRoot, SettingSelect, SettingToggle } from './components-utils'
import { useReset, useSettings, useUpdateSettings } from './settings-store'
import { Button, Separator } from '@/ui'

export type AvatarEditorDemoState = {
	disabled: boolean
	loading: boolean
	asIcon: boolean
	variant: 'primary' | 'secondary' | 'ghost'
	outline: boolean
	outputMimeType: 'image/jpeg' | 'image/png' | 'image/webp'
	refreshKey: number
}

const defaultState: AvatarEditorDemoState = {
	disabled: false,
	loading: false,
	asIcon: false,
	variant: 'primary',
	outline: false,
	outputMimeType: 'image/jpeg',
	refreshKey: 0,
}

export function DemoAvatarEditorSettings() {
	const reset = useReset<AvatarEditorDemoState>(defaultState)
	const [update] = useUpdateSettings<AvatarEditorDemoState>()
	const { disabled, loading, asIcon, variant, outline, outputMimeType, refreshKey } =
		useSettings<AvatarEditorDemoState>()

	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(() => reset(), [])

	return (
		<DemoRoot>
			<SettingToggle id="disabled" label="Disabled" checked={disabled} />
			<SettingToggle id="loading" label="Loading" checked={loading} />
			<SettingToggle id="asIcon" label="As icon" checked={asIcon} />
			<SettingToggle id="outline" label="Outline" checked={outline} />
			<SettingSelect
				id="variant"
				label="Variant"
				value={variant}
				options={['primary', 'secondary', 'ghost']}
			/>
			<SettingSelect
				id="outputMimeType"
				label="Output mime type"
				value={outputMimeType}
				options={['image/jpeg', 'image/png', 'image/webp']}
			/>
			<Separator />
			<Button
				size="lg"
				label="Refresh"
				leftIcon="history"
				iconOptions={{ color: 'contrast' }}
				onClick={() => update({ refreshKey: refreshKey + 1 })}
			/>
		</DemoRoot>
	)
}
