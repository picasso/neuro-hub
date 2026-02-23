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
import { Stack } from '@/components/ui'

export type ButtonDemoState = {
	variant: 'default' | 'outline' | 'ghost'
	size: 'sm' | 'md' | 'lg' | 'xl'
	disabled: boolean
	fullWidth: boolean
	bold: boolean
	noWrap: boolean
	leftIcon: boolean
	rightIcon: boolean
}

const defaultState: ButtonDemoState = {
	variant: 'default',
	size: 'md',
	disabled: false,
	fullWidth: false,
	bold: false,
	noWrap: false,
	leftIcon: true,
	rightIcon: false,
}

export function DemoButtonsSettings() {
	const [update, toggle] = useUpdateSettings<ButtonDemoState>()
	const reset = useReset<ButtonDemoState>(defaultState)
	const { variant, size, disabled, fullWidth, bold, noWrap, leftIcon, rightIcon } =
		useSettings<ButtonDemoState>()

	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(() => reset(), [])

	return (
		<Stack vertical gap={4} align="stretch">
			<Stack vertical gap={2} align="stretch">
				<Label className="text-xs">Variant</Label>
				<Select
					value={variant}
					onValueChange={(v: ButtonDemoState['variant']) => update({ variant: v })}
				>
					<SelectTrigger className="h-8 text-xs">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="default">default</SelectItem>
						<SelectItem value="outline">outline</SelectItem>
						<SelectItem value="ghost">ghost</SelectItem>
					</SelectContent>
				</Select>
			</Stack>

			<Stack vertical gap={2} align="stretch">
				<Label className="text-xs">Size</Label>
				<Select
					value={size}
					onValueChange={(v: ButtonDemoState['size']) => update({ size: v })}
				>
					<SelectTrigger className="h-8 text-xs">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="sm">sm</SelectItem>
						<SelectItem value="md">md</SelectItem>
						<SelectItem value="lg">lg</SelectItem>
						<SelectItem value="xl">xl</SelectItem>
					</SelectContent>
				</Select>
			</Stack>

			<Separator />

			<Stack gap={0} justify="space-between">
				<Label htmlFor="disabled" className="text-xs">
					Disabled
				</Label>
				<Switch
					id="disabled"
					checked={disabled}
					onCheckedChange={() => toggle('disabled')}
				/>
			</Stack>
			<Stack gap={0} justify="space-between">
				<Label htmlFor="fullWidth" className="text-xs">
					Full width
				</Label>
				<Switch
					id="fullWidth"
					checked={fullWidth}
					onCheckedChange={() => toggle('fullWidth')}
				/>
			</Stack>
			<Stack gap={0} justify="space-between">
				<Label htmlFor="bold" className="text-xs">
					Bold
				</Label>
				<Switch id="bold" checked={bold} onCheckedChange={() => toggle('bold')} />
			</Stack>
			<Stack gap={0} justify="space-between">
				<Label htmlFor="noWrap" className="text-xs">
					No wrap
				</Label>
				<Switch id="noWrap" checked={noWrap} onCheckedChange={() => toggle('noWrap')} />
			</Stack>
			<Stack gap={0} justify="space-between">
				<Label htmlFor="leftIcon" className="text-xs">
					Left icon
				</Label>
				<Switch
					id="leftIcon"
					checked={leftIcon}
					onCheckedChange={() => toggle('leftIcon')}
				/>
			</Stack>
			<Stack gap={0} justify="space-between">
				<Label htmlFor="rightIcon" className="text-xs">
					Right icon
				</Label>
				<Switch
					id="rightIcon"
					checked={rightIcon}
					onCheckedChange={() => toggle('rightIcon')}
				/>
			</Stack>
		</Stack>
	)
}
