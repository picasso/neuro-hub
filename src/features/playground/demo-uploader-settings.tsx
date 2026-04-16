'use client'

import { useEffect } from 'react'
import { DemoRoot, SettingSelect, SettingToggle } from './components-utils'
import { useReset, useSettings, useUpdateSettings } from './settings-store'
import { FieldWrapper, Separator, Slider, Stack, TS } from '@/ui'

// settings state ---------------------------------------------------------------------------------]

export type UploaderDemoState = {
	title: boolean
	icon: boolean
	placeholder: boolean
	helper: boolean
	outline: boolean
	fullWidth: boolean
	compact: boolean
	mediaIcon: boolean
	avatar: boolean
	avatarSrc: boolean
	completed: boolean
	loading: boolean
	align: 'start' | 'center'
	variant: 'primary' | 'secondary' | 'ghost'
	accept: 'image/*' | 'video/*' | 'audio/*' | 'application/pdf' | 'all media'
	maxSizeBytes: number
	dropOnly: boolean
	disabled: boolean
}

const defaultState: UploaderDemoState = {
	title: true,
	icon: true,
	placeholder: true,
	helper: true,
	outline: true,
	fullWidth: false,
	compact: false,
	mediaIcon: false,
	avatar: false,
	avatarSrc: false,
	completed: false,
	loading: false,
	align: 'start',
	variant: 'primary',
	accept: 'image/*',
	maxSizeBytes: 300,
	dropOnly: false,
	disabled: false,
}

// settings panel component -----------------------------------------------------------------------]

export function DemoUploaderSettings() {
	const [update] = useUpdateSettings<UploaderDemoState>()
	const reset = useReset<UploaderDemoState>(defaultState)
	const {
		title,
		icon,
		placeholder,
		helper,
		outline,
		avatar,
		avatarSrc,
		completed,
		loading,
		fullWidth,
		compact,
		align,
		variant,
		accept,
		maxSizeBytes,
		dropOnly,
		disabled,
		mediaIcon,
	} = useSettings<UploaderDemoState>()

	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(() => reset(), [])

	return (
		<DemoRoot>
			<SettingToggle id="title" label="Title" checked={title} />
			<SettingToggle id="icon" label="Icon" checked={icon} />
			<SettingToggle id="placeholder" label="Placeholder" checked={placeholder} />
			<SettingToggle id="helper" label="Helper text" checked={helper} />
			<SettingToggle id="avatar" label="Avatar" checked={avatar} />
			{avatar && (
				<>
					<SettingToggle id="avatarSrc" label="Avatar src" checked={avatarSrc} />
					<SettingToggle id="completed" label="Completed" checked={completed} />
					<SettingToggle id="loading" label="Loading" checked={loading} />
				</>
			)}
			<SettingToggle id="dropOnly" label="Drop only" checked={dropOnly} />
			<SettingToggle id="disabled" label="Disabled" checked={disabled} />

			<Separator />
			<SettingSelect
				id="variant"
				label="Variant"
				value={variant}
				options={['primary', 'secondary', 'ghost']}
			/>
			<SettingSelect id="align" label="Align" value={align} options={['start', 'center']} />
			<SettingToggle id="outline" label="Outline" checked={outline} />
			<SettingToggle id="mediaIcon" label="Media icon" checked={mediaIcon} />
			<SettingToggle id="fullWidth" label="Full width" checked={fullWidth} />
			<SettingToggle id="compact" label="Compact" checked={compact} />
			<Separator />
			<SettingSelect
				id="accept"
				label="Accept only"
				value={accept}
				options={['all media', 'image/*', 'video/*', 'audio/*', 'application/pdf']}
			/>
			<FieldWrapper
				label={
					<Stack justify="space-between" className="w-full">
						<TS variant="caption" content="Max size" />
						<TS thin variant="caption" content={`${maxSizeBytes} Kb`} />
					</Stack>
				}
				helper="Max size of the file in Kb"
			>
				<Slider
					value={[maxSizeBytes]}
					onValueChange={([v]) => update({ maxSizeBytes: v })}
					min={100}
					max={800}
					step={100}
				/>
			</FieldWrapper>
		</DemoRoot>
	)
}
