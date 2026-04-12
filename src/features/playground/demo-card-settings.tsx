'use client'

import { useEffect } from 'react'
import { DemoRoot, SettingSelect, SettingToggle } from './components-utils'
import { useReset, useSettings } from './settings-store'
import { type CardProps, Separator, type MaxW } from '@/ui'

export type CardDemoState = {
	size: NonNullable<CardProps['size']>
	maxW: MaxW
	fullWidth: boolean
	compact: boolean
	title: boolean
	description: boolean
	titleOver: boolean
	descOver: boolean
	content: boolean
	flush: boolean
	button: boolean
	badge: boolean
	badgeProps: boolean
	image: boolean
	buttonProps: boolean
	footer: boolean
	hoverable: boolean
	customClassName: boolean
}

const defaultState: CardDemoState = {
	size: 'sm',
	maxW: 'lg',
	fullWidth: false,
	compact: false,
	title: false,
	description: false,
	titleOver: false,
	descOver: false,
	content: true,
	flush: false,
	button: false,
	badge: false,
	badgeProps: false,
	image: false,
	buttonProps: false,
	footer: false,
	hoverable: false,
	customClassName: false,
}

export function DemoCardSettings() {
	const reset = useReset<CardDemoState>(defaultState)
	const {
		size,
		maxW,
		fullWidth,
		compact,
		content,
		title,
		description,
		titleOver,
		descOver,
		flush,
		hoverable,
		footer,
		button,
		badge,
		badgeProps,
		image,
		buttonProps,
		customClassName,
	} = useSettings<CardDemoState>()

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
			<Separator />
			<SettingToggle id="fullWidth" label="Full width" checked={fullWidth} />
			<SettingToggle id="compact" label="Compact" checked={compact} />
			<SettingToggle id="content" label="Content" checked={content} />
			<SettingToggle id="title" label="Title" checked={title} />
			<SettingToggle id="description" label="Description" checked={description} />
			<SettingToggle id="flush" label="Flush" checked={flush} />
			<SettingToggle id="hoverable" label="Hoverable" checked={hoverable} />
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
