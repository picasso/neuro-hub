'use client'

import { useEffect } from 'react'
import { DemoRoot, SettingSelect, SettingToggle } from './components-utils'
import { useReset, useSettings } from './settings-store'
import { Separator, type DialogAnimation, type DialogProps } from '@/ui'

export type DialogDemoState = {
	size: NonNullable<DialogProps['size']>
	animation: DialogAnimation
	closeButton: boolean
	footerClose: boolean
	overlay: boolean
	modal: boolean
	icon: boolean
	title: boolean
	description: boolean
	content: boolean
}

const defaultState: DialogDemoState = {
	size: 'md',
	animation: 'zoom',
	closeButton: true,
	footerClose: false,
	overlay: true,
	modal: true,
	icon: true,
	title: true,
	description: true,
	content: true,
}

export function DemoDialogSettings() {
	const reset = useReset<DialogDemoState>(defaultState)
	const {
		size,
		animation,
		closeButton,
		footerClose,
		overlay,
		modal,
		icon,
		title,
		description,
		content,
	} = useSettings<DialogDemoState>()

	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(() => reset(), [])

	return (
		<DemoRoot>
			<SettingToggle id="title" label="Title" checked={title} />
			<SettingToggle id="icon" label="Icon" checked={icon} />
			<SettingToggle id="closeButton" label="Close (X)" checked={closeButton} />
			<SettingToggle id="description" label="Description" checked={description} />
			<SettingToggle id="content" label="Content" checked={content} />
			<SettingToggle id="footerClose" label="Footer close" checked={footerClose} />
			<SettingToggle id="overlay" label="Overlay" checked={overlay} />
			<SettingToggle id="modal" label="Modal (lock scroll)" checked={modal} />
			<Separator />
			<SettingSelect
				id="size"
				label="Size"
				value={size}
				options={['sm', 'md', 'lg', 'xl', 'full']}
			/>
			<SettingSelect
				id="animation"
				label="Animation"
				value={animation}
				options={['zoom', 'fade', 'slide-up', 'slide-down', 'none']}
			/>
		</DemoRoot>
	)
}
