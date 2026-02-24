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
import { type IconButtonProps, Stack } from '@/components/ui'

export type IconButtonDemoState = {
	showName: boolean
	variant: NonNullable<IconButtonProps['variant']>
	size: NonNullable<IconButtonProps['size']>
	rounded: boolean
	disabled: boolean
	spinning: boolean
	forceSize: 'auto' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

const defaultState: IconButtonDemoState = {
	showName: false,
	variant: 'ghost',
	size: 'icon',
	rounded: false,
	disabled: false,
	spinning: false,
	forceSize: 'auto',
}

export function DemoIconButtonsSettings() {
	const [update, toggle] = useUpdateSettings<IconButtonDemoState>()
	const reset = useReset<IconButtonDemoState>(defaultState)
	const { showName, variant, size, rounded, disabled, spinning, forceSize } =
		useSettings<IconButtonDemoState>()

	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(() => reset(), [])

	return (
		<Stack vertical gap={4} align="stretch">
			<Stack vertical gap={2} align="stretch">
				<Stack gap={0} justify="space-between" className="mb-2">
					<Label htmlFor="show-name" className="text-xs">
						Показывать имя
					</Label>
					<Switch
						id="show-name"
						checked={showName}
						onCheckedChange={() => toggle('showName')}
					/>
				</Stack>
				<Separator />
				<Label className="text-xs">Variant</Label>
				<Select
					value={variant}
					onValueChange={(v: IconButtonDemoState['variant']) => update({ variant: v })}
				>
					<SelectTrigger className="h-8 text-xs">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="default">default</SelectItem>
						<SelectItem value="outline">outline</SelectItem>
						<SelectItem value="secondary">secondary</SelectItem>
						<SelectItem value="destructive">destructive</SelectItem>
						<SelectItem value="ghost">ghost</SelectItem>
						<SelectItem value="contrast">contrast</SelectItem>
					</SelectContent>
				</Select>
			</Stack>

			<Stack vertical gap={2} align="stretch">
				<Label className="text-xs">Size</Label>
				<Select
					value={size}
					onValueChange={(v: IconButtonDemoState['size']) => update({ size: v })}
				>
					<SelectTrigger className="h-8 text-xs">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="icon">icon</SelectItem>
						<SelectItem value="sm">sm</SelectItem>
						<SelectItem value="md">md</SelectItem>
						<SelectItem value="lg">lg</SelectItem>
						<SelectItem value="xl">xl</SelectItem>
					</SelectContent>
				</Select>
			</Stack>

			<Stack vertical gap={2} align="stretch">
				<Label className="text-xs">Force icon size</Label>
				<Select
					value={forceSize}
					onValueChange={(v: IconButtonDemoState['forceSize']) =>
						update({ forceSize: v })
					}
				>
					<SelectTrigger className="h-8 text-xs">
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="auto">auto</SelectItem>
						<SelectItem value="xs">xs</SelectItem>
						<SelectItem value="sm">sm</SelectItem>
						<SelectItem value="md">md</SelectItem>
						<SelectItem value="lg">lg</SelectItem>
						<SelectItem value="xl">xl</SelectItem>
					</SelectContent>
				</Select>
			</Stack>

			<Separator />

			<Stack gap={0} justify="space-between">
				<Label htmlFor="rounded" className="text-xs">
					Rounded
				</Label>
				<Switch id="rounded" checked={rounded} onCheckedChange={() => toggle('rounded')} />
			</Stack>
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
				<Label htmlFor="spinning" className="text-xs">
					Spinning
				</Label>
				<Switch
					id="spinning"
					checked={spinning}
					onCheckedChange={() => toggle('spinning')}
				/>
			</Stack>
		</Stack>
	)
}
