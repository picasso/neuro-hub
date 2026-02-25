'use client'

import { useEffect } from 'react'
import { useReset, useSettings, useUpdateSettings } from './settings-store'
import { Label } from '@/components/shadcn/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/shadcn/select'
import { Separator } from '@/components/shadcn/separator'
import { Switch } from '@/components/shadcn/switch'
import { Stack, type TextStyledProps } from '@/components/ui'

export type TextStyledVariant = NonNullable<TextStyledProps['variant']>
export type TextStyledColor = NonNullable<TextStyledProps['color']>

export type TypographyDemoState = {
	variant: TextStyledVariant
	color: TextStyledColor | ''
	strong: boolean
	thin: boolean
	gutterBottom: boolean
	md: boolean
	inline: boolean
}

const defaultState: TypographyDemoState = {
	variant: 'body',
	color: '',
	strong: false,
	thin: false,
	gutterBottom: false,
	md: true,
	inline: false,
}

export function DemoTypographySettings() {
	const [update, toggle] = useUpdateSettings<TypographyDemoState>()
	const reset = useReset<TypographyDemoState>(defaultState)
	const { variant, color, strong, thin, gutterBottom, md, inline } =
		useSettings<TypographyDemoState>()

	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(() => reset(), [])

	return (
		<Stack vertical gap={4} align="stretch">
			<Stack vertical gap={2} align="stretch">
				<Label className="text-xs">Variant</Label>
				<Select
					value={variant}
					onValueChange={(v: TypographyDemoState['variant']) => update({ variant: v })}
				>
					<SelectTrigger className="h-8 text-xs">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="h1">h1</SelectItem>
						<SelectItem value="h2">h2</SelectItem>
						<SelectItem value="h3">h3</SelectItem>
						<SelectItem value="h4">h4</SelectItem>
						<SelectItem value="h5">h5</SelectItem>
						<SelectItem value="subtitle">subtitle</SelectItem>
						<SelectItem value="body">body</SelectItem>
						<SelectItem value="caption">caption</SelectItem>
						<SelectItem value="quote">quote</SelectItem>
					</SelectContent>
				</Select>
			</Stack>

			<Stack vertical gap={2} align="stretch">
				<Label className="text-xs">Color</Label>
				<Select
					value={color || 'none'}
					onValueChange={(v) =>
						update({ color: v === 'none' ? '' : (v as TypographyDemoState['color']) })
					}
				>
					<SelectTrigger className="h-8 text-xs">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="none">— (inherit)</SelectItem>
						<SelectItem value="primary">primary</SelectItem>
						<SelectItem value="secondary">secondary</SelectItem>
						<SelectItem value="dimmed">dimmed</SelectItem>
						<SelectItem value="contrast">contrast</SelectItem>
						<SelectItem value="soft">soft</SelectItem>
					</SelectContent>
				</Select>
			</Stack>

			<Separator />

			<Stack gap={0} justify="space-between">
				<Label htmlFor="strong" className="text-xs">
					Strong
				</Label>
				<Switch id="strong" checked={strong} onCheckedChange={() => toggle('strong')} />
			</Stack>
			<Stack gap={0} justify="space-between">
				<Label htmlFor="thin" className="text-xs">
					Thin
				</Label>
				<Switch id="thin" checked={thin} onCheckedChange={() => toggle('thin')} />
			</Stack>
			<Stack gap={0} justify="space-between">
				<Label htmlFor="gutterBottom" className="text-xs">
					Gutter bottom
				</Label>
				<Switch
					id="gutterBottom"
					checked={gutterBottom}
					onCheckedChange={() => toggle('gutterBottom')}
				/>
			</Stack>
			<Stack gap={0} justify="space-between">
				<Label htmlFor="md" className="text-xs">
					Markdown
				</Label>
				<Switch id="md" checked={md} onCheckedChange={() => toggle('md')} />
			</Stack>
			<Stack gap={0} justify="space-between">
				<Label htmlFor="inline" className="text-xs">
					Inline
				</Label>
				<Switch id="inline" checked={inline} onCheckedChange={() => toggle('inline')} />
			</Stack>
		</Stack>
	)
}
