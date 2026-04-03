'use client'

import { useEffect } from 'react'
import { DemoRoot, SettingSelect, SettingToggle } from './components-utils'
import { useReset, useSettings } from './settings-store'
import { type SkeletonProps, type MaxW, Separator } from '@/ui'

type SkeletonShape = NonNullable<SkeletonProps['shape']>

export type SkeletonDemoState = {
	shape: SkeletonShape
	maxW: MaxW
	clean: boolean
	filler: boolean
	fillerCustom: boolean
}

const defaultState: SkeletonDemoState = {
	shape: 'text',
	maxW: 'lg',
	clean: true,
	filler: false,
	fillerCustom: false,
}

export function DemoSkeletonSettings() {
	const reset = useReset<SkeletonDemoState>(defaultState)
	const { shape, maxW, clean, filler, fillerCustom } = useSettings<SkeletonDemoState>()

	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(() => reset(), [])

	return (
		<DemoRoot>
			<SettingSelect
				id="shape"
				label="Shape"
				value={shape}
				options={['none', 'text', 'card', 'avatar', 'table', 'form']}
			/>
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
			<SettingToggle id="clean" label="Clean (no vertical margin)" checked={clean} />
			<SettingToggle
				id="filler"
				label="Filler"
				checked={filler}
				helper="Just spacing block under the preset"
			/>
			<SettingToggle
				id="fillerCustom"
				label="Custom Filler"
				checked={fillerCustom}
				helper="Custom class for specific effects"
			/>
		</DemoRoot>
	)
}
