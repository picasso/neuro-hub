'use client'

import { useEffect } from 'react'
import { DemoRoot, SettingSelect, SettingToggle } from './components-utils'
import { useReset, useSettings } from './settings-store'
import { Separator, type AlertProps } from '@/ui'

export type AlertDemoState = {
	variant: NonNullable<AlertProps['variant']>
	withIcon: boolean
	withDescription: boolean
}

const defaultState: AlertDemoState = {
	variant: 'standard',
	withIcon: false,
	withDescription: true,
}

export function DemoAlertSettings() {
	const reset = useReset<AlertDemoState>(defaultState)
	const { variant, withIcon, withDescription } = useSettings<AlertDemoState>()

	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(() => reset(), [])

	return (
		<DemoRoot>
			<SettingSelect
				id="variant"
				label="Variant"
				value={variant}
				options={['default', 'destructive']}
			/>
			<Separator />
			<SettingToggle id="withIcon" label="With icon" checked={withIcon} />
			<SettingToggle
				id="withDescription"
				label="With description"
				checked={withDescription}
			/>
		</DemoRoot>
	)
}
