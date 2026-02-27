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
}

const defaultState: BadgeDemoState = {
	variant: 'primary',
	size: 'md',
	color: 'null',
	withIcon: false,
	closable: false,
}

export function DemoBadgeSettings() {
	const reset = useReset<BadgeDemoState>(defaultState)
	const { variant, size, color, withIcon, closable } = useSettings<BadgeDemoState>()

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
			<SettingSelect id="size" label="Size" value={size} options={['xs', 'sm', 'md', 'lg']} />
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
				]}
			/>
			<Separator />
			<SettingToggle id="withIcon" label="With icon" checked={withIcon} />
			<SettingToggle id="closable" label="Closable" checked={closable} />
		</DemoRoot>
	)
}
