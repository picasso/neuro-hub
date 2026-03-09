'use client'

import { useEffect } from 'react'
import { DemoRoot, SettingSelect, SettingToggle } from './components-utils'
import { useReset, useSettings } from './settings-store'
import { Separator, type AvatarProps } from '@/ui'

export type AvatarDemoState = {
	size: NonNullable<AvatarProps['size']>
	name: string
	withImage: boolean
	badge: 'none' | NonNullable<AvatarProps['badge']>
	color: 'auto' | 'string'
	bordered: boolean
}

const defaultState: AvatarDemoState = {
	size: 'md',
	name: 'Demo User',
	withImage: false,
	badge: 'none',
	color: 'auto',
	bordered: false,
}

const nameOps = ['Demo User', 'Alice Smith', 'Samantha', 'Марина Петрова', 'X']

export function DemoAvatarSettings() {
	const reset = useReset<AvatarDemoState>(defaultState)
	const { size, name, withImage, badge, color, bordered } = useSettings<AvatarDemoState>()

	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(() => reset(), [])

	return (
		<DemoRoot>
			<SettingSelect id="size" label="Size" value={size} options={['sm', 'md', 'lg']} />
			<SettingSelect id="name" label="Name" value={name} options={nameOps} />
			<SettingSelect
				id="color"
				label="Color"
				value={color}
				options={[
					{ label: 'Auto', value: 'auto' },
					{ label: 'Cyan', value: '#2a8597' },
					{ label: 'Pink', value: '#db2777' },
				]}
			/>
			<SettingSelect
				id="badge"
				label="Badge"
				value={badge}
				options={['none', 'error', 'success', 'warning', 'info']}
			/>
			<Separator />
			<SettingToggle id="withImage" label="With image" checked={withImage} />
			<SettingToggle id="bordered" label="Bordered" checked={bordered} />
		</DemoRoot>
	)
}
