'use client'

import { useEffect } from 'react'
import { DemoRoot, SettingToggle } from './components-utils'
import { useReset, useSettings, useUpdateSettings } from './settings-store'
import { Button, Separator } from '@/ui'

// settings state ---------------------------------------------------------------------------------]

export type PortfolioDemoState = {
	title: boolean
	disabled: boolean
	onlyImages: boolean
	refreshKey: number
}

const defaultState: PortfolioDemoState = {
	title: true,
	disabled: false,
	onlyImages: false,
	refreshKey: 0,
}

// settings panel component -----------------------------------------------------------------------]

export function DemoPortfolioSettings() {
	const [update] = useUpdateSettings<PortfolioDemoState>()
	const reset = useReset<PortfolioDemoState>(defaultState)
	const { title, disabled, onlyImages, refreshKey } = useSettings<PortfolioDemoState>()

	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(() => reset(), [])

	return (
		<DemoRoot>
			<SettingToggle id="title" label="Show title" checked={title} />
			<SettingToggle id="onlyImages" label="Only images" checked={onlyImages} />
			<SettingToggle id="disabled" label="Disabled" checked={disabled} />
			<Separator />
			<Button
				size="lg"
				label="Refresh"
				leftIcon="history"
				iconOptions={{ color: 'contrast' }}
				onClick={() => update({ refreshKey: refreshKey + 1 })}
			/>
		</DemoRoot>
	)
}
