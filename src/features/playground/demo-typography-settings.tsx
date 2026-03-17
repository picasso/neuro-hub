'use client'

import { useEffect } from 'react'
import { DemoRoot, SettingSelect, SettingToggle } from './components-utils'
import { useReset, useSettings } from './settings-store'
import { Separator, type TextStyledProps } from '@/ui'

export type TextStyledVariant = NonNullable<TextStyledProps['variant']>
export type TextStyledColor = NonNullable<TextStyledProps['color']>

export type TypographyDemoState = {
	variant: TextStyledVariant
	color: TextStyledColor | 'null'
	strong: boolean
	thin: boolean
	gutterBottom: boolean
	md: boolean
	inline: boolean
	clean: boolean
}

const defaultState: TypographyDemoState = {
	variant: 'body',
	color: 'null',
	strong: false,
	thin: false,
	gutterBottom: false,
	md: true,
	inline: false,
	clean: false,
}

export function DemoTypographySettings() {
	const reset = useReset<TypographyDemoState>(defaultState)
	const { variant, color, strong, thin, gutterBottom, md, inline, clean } =
		useSettings<TypographyDemoState>()

	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(() => reset(), [])

	return (
		<DemoRoot>
			<SettingSelect
				id="variant"
				label="Variant"
				value={variant}
				options={[
					'h1',
					'h2',
					'h3',
					'h4',
					'h5',
					'subtitle',
					'body',
					'caption',
					'quote',
					'list',
					'lead',
				]}
			/>
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
			<SettingToggle id="clean" label="Clean" checked={clean} />
			<SettingToggle id="strong" label="Strong" checked={strong} />
			<SettingToggle id="thin" label="Thin" checked={thin} />
			<SettingToggle id="gutterBottom" label="Gutter bottom" checked={gutterBottom} />
			<SettingToggle id="md" label="Markdown" checked={md} />
			<SettingToggle id="inline" label="Inline" checked={inline} />
		</DemoRoot>
	)
}
