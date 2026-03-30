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
	titleOver: boolean
	descOver: boolean
	flush: boolean
	button: boolean
	badge: boolean
	badgeProps: boolean
	image: boolean
	buttonProps: boolean
	footer: boolean
	customClassName: boolean
}

const defaultState: AnyDemoState = {
	size: 'sm',
	maxW: 'lg',
	fullWidth: false,
	title: false,
	description: false,
	titleOver: false,
	descOver: false,
	flush: false,
	button: false,
	badge: false,
	badgeProps: false,
	image: false,
	buttonProps: false,
	footer: false,
	customClassName: false,
}

export function DemoAnySettings() {
	const reset = useReset<AnyDemoState>(defaultState)
	const {
		size,
		maxW,
		fullWidth,
		title,
		description,
		titleOver,
		descOver,
		flush,
		footer,
		button,
		badge,
		badgeProps,
		image,
		buttonProps,
		customClassName,
	} = useSettings<AnyDemoState>()

	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(() => reset(), [])

	return (
		<DemoRoot>
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
			{badge && <SettingToggle id="badgeProps" label="Badge props" checked={badgeProps} />}
			<SettingToggle id="button" label="Button" checked={button} />
			{button && (
				<SettingToggle id="buttonProps" label="Button props" checked={buttonProps} />
			)}
			<SettingToggle id="image" label="Image" checked={image} />
			{image && (
				<>
					<SettingToggle id="titleOver" label="Title over" checked={titleOver} />
					<SettingToggle id="descOver" label="Description over" checked={descOver} />
				</>
			)}
			<SettingToggle
				id="customClassName"
				label="Custom class names"
				checked={customClassName}
			/>
		</DemoRoot>
	)
}
