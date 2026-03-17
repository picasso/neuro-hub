'use client'

import { useEffect } from 'react'
import { DemoRoot, SettingSelect, SettingToggle } from './components-utils'
import { useReset, useSettings } from './settings-store'
import { type CardProps, Separator, type MaxW } from '@/ui'

export type AnyDemoState = {
	size: NonNullable<CardProps['size']>
	maxW: MaxW
	fullWidth: boolean
	title: boolean
	description: boolean
	flush: boolean
	button: boolean
	badge: boolean
	badgeProps: boolean
	buttonProps: boolean
	footer: boolean
	headerClassName: boolean
	footerClassName: boolean
	contentClassName: boolean
}

const defaultState: AnyDemoState = {
	size: 'sm',
	maxW: 'lg',
	fullWidth: false,
	title: false,
	description: false,
	flush: false,
	button: false,
	badge: false,
	badgeProps: false,
	buttonProps: false,
	footer: false,
	headerClassName: false,
	footerClassName: false,
	contentClassName: false,
}

export function DemoAnySettings() {
	const reset = useReset<AnyDemoState>(defaultState)
	const {
		size,
		maxW,
		fullWidth,
		title,
		description,
		flush,
		footer,
		button,
		badge,
		badgeProps,
		buttonProps,
		headerClassName,
		footerClassName,
		contentClassName,
	} = useSettings<AnyDemoState>()

	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(() => reset(), [])

	return (
		<DemoRoot>
			{/* <SettingSelect
				id="variant"
				label="Variant"
				value={variant}
				options={['primary', 'secondary', 'destructive', 'outline', 'ghost', 'link']}
			/> */}
			<SettingSelect id="size" label="Size" value={size} options={['default', 'sm']} />
			<SettingSelect
				id="maxW"
				label="Max width"
				value={maxW}
				options={[
					'none',
					'xs',
					'sm',
					'md',
					'lg',
					'xl',
					'2xl',
					'3xl',
					'4xl',
					'5xl',
					'6xl',
					'7xl',
					'8xl',
					'9xl',
					'10xl',
				]}
			/>
			{/* <SettingSelect
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
			/> */}
			<Separator />
			<SettingToggle id="fullWidth" label="Full width" checked={fullWidth} />
			<SettingToggle id="title" label="Title" checked={title} />
			<SettingToggle id="description" label="Description" checked={description} />
			<SettingToggle id="flush" label="Flush" checked={flush} />
			<SettingToggle id="footer" label="Footer" checked={footer} />
			<SettingToggle id="badge" label="Badge" checked={badge} />
			<SettingToggle id="badgeProps" label="Badge props" checked={badgeProps} />
			<SettingToggle id="button" label="Button" checked={button} />
			<SettingToggle id="buttonProps" label="Button props" checked={buttonProps} />
			<SettingToggle
				id="headerClassName"
				label="Header class name"
				checked={headerClassName}
			/>
			<SettingToggle
				id="footerClassName"
				label="Footer class name"
				checked={footerClassName}
			/>
			<SettingToggle
				id="contentClassName"
				label="Content class name"
				checked={contentClassName}
			/>
		</DemoRoot>
	)
}
