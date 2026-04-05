'use client'

import { useEffect } from 'react'
import { DemoRoot, SettingSelect, SettingToggle } from './components-utils'
import { useReset, useSettings } from './settings-store'
import { Separator } from '@/ui'

export type ChatDemoState = {
	composerDisabled: boolean
	composerSubmitting: boolean
	showComposerCounter: boolean
	stickyHeader: boolean
	stickyFooter: boolean
	padding: 'none' | 'sm' | 'md' | 'lg'
	background: 'default' | 'muted' | 'transparent'
	bordered: boolean
	limitWidth: 'md' | 'lg' | 'xl' | '2xl' | 'full'
	limitHeight: 'md' | 'lg' | 'xl' | '2xl' | 'none'
	messageTheme: 'green' | 'blue' | 'purple' | 'yellow' | 'cyan'
	withTail: boolean
}

const defaultState: ChatDemoState = {
	composerDisabled: false,
	composerSubmitting: false,
	showComposerCounter: false,
	stickyHeader: true,
	stickyFooter: true,
	padding: 'sm',
	background: 'default',
	bordered: true,
	limitWidth: 'md',
	limitHeight: 'md',
	messageTheme: 'green',
	withTail: true,
}

export function DemoChatSettings() {
	const reset = useReset<ChatDemoState>(defaultState)
	const {
		messageTheme,
		limitWidth,
		limitHeight,
		stickyHeader,
		stickyFooter,
		padding,
		background,
		bordered,
		withTail,
		composerDisabled,
		composerSubmitting,
		showComposerCounter,
	} = useSettings<ChatDemoState>()

	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(() => reset(), [])

	return (
		<DemoRoot>
			<SettingSelect
				id="messageTheme"
				label="Message theme"
				value={messageTheme}
				options={['green', 'blue', 'purple', 'yellow', 'cyan']}
			/>

			<SettingSelect
				id="limitWidth"
				label="Max width"
				value={limitWidth}
				options={['md', 'lg', 'xl', '2xl', 'full']}
			/>
			<SettingSelect
				id="limitHeight"
				label="Max height"
				value={limitHeight}
				options={['md', 'lg', 'xl', '2xl', 'none']}
			/>
			<SettingSelect
				id="padding"
				label="Padding"
				value={padding}
				options={['none', 'sm', 'md', 'lg']}
			/>
			<SettingSelect
				id="background"
				label="Background"
				value={background}
				options={['default', 'muted', 'transparent']}
			/>
			<SettingToggle id="bordered" label="Bordered" checked={bordered} />
			<SettingToggle id="withTail" label="With tail" checked={withTail} />
			<SettingToggle id="stickyHeader" label="Sticky header" checked={stickyHeader} />
			<SettingToggle id="stickyFooter" label="Sticky footer" checked={stickyFooter} />
			<Separator />
			<SettingToggle
				id="composerDisabled"
				label="Composer disabled"
				checked={composerDisabled}
			/>
			<SettingToggle
				id="composerSubmitting"
				label="Composer submitting"
				checked={composerSubmitting}
			/>
			<SettingToggle
				id="showComposerCounter"
				label="Composer character counter"
				checked={showComposerCounter}
			/>
		</DemoRoot>
	)
}
