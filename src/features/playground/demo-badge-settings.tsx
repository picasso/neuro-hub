'use client'

import { useEffect } from 'react'
import { DemoRoot, SettingSelect, SettingToggle } from './components-utils'
import { useReset, useSettings } from './settings-store'
import { Separator, type BadgeProps } from '@/ui'

export type BadgeDemoState = {
	variant: NonNullable<BadgeProps['variant']>
	size: NonNullable<BadgeProps['size']>
	color: NonNullable<BadgeProps['color']> | 'null'
	withIcon: boolean
	closable: boolean
	capitalize: boolean
	lowercased: boolean
	moreContrast: boolean
}

const defaultState: BadgeDemoState = {
	variant: 'primary',
	size: 'md',
	color: 'null',
	withIcon: false,
	closable: false,
	capitalize: false,
	lowercased: false,
	moreContrast: false,
}

export function DemoBadgeSettings() {
	const reset = useReset<BadgeDemoState>(defaultState)
	const { variant, size, color, withIcon, closable, capitalize, lowercased, moreContrast } =
		useSettings<BadgeDemoState>()

	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(() => reset(), [])

	return (
		<DemoRoot>
			<SettingSelect
				id="variant"
				label="Variant"
				value={variant}
				options={['primary', 'secondary', 'destructive', 'outline', 'ghost', 'link']}
			/>
			<SettingSelect id="size" label="Size" value={size} options={['xs', 'sm', 'md']} />
			<SettingSelect
				id="color"
				label="Color"
				value={color}
				options={[
					{ label: '— (inherit)', value: 'null' },
					{ label: 'primary', value: 'primary' },
					{ label: 'secondary', value: 'secondary' },
					{ label: 'dimmed', value: 'dimmed' },
					{ label: 'contrast', value: 'contrast' },
					{ label: 'soft', value: 'soft' },
					{ label: 'destructive', value: 'destructive' },
					{ label: 'error', value: 'error' },
					{ label: 'success', value: 'success' },
					{ label: 'warning', value: 'warning' },
					{ label: 'info', value: 'info' },
					{ label: 'cta', value: 'cta' },
				]}
			/>
			<Separator />
			<SettingToggle id="withIcon" label="With icon" checked={withIcon} />
			<SettingToggle id="closable" label="Closable" checked={closable} />
			<SettingToggle id="capitalize" label="Capitalize text" checked={capitalize} />
			<SettingToggle id="lowercased" label="Lowercase compensation" checked={lowercased} />
			<SettingToggle id="moreContrast" label="More contrast" checked={moreContrast} />
		</DemoRoot>
	)
}
