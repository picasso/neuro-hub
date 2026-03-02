import { isPlainObject, map } from 'lodash'
import { useUpdateSettings } from './settings-store'
import type { PropsWithChildren } from 'react'
import { cn } from '@/lib/utils'
import {
	Label,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	Separator,
	Switch,
	Stack,
	TS,
} from '@/ui'

// DemoSection ------------------------------------------------------------------------------------]

type DemoSectionProps = PropsWithChildren<{
	title: string
	desc?: string
	separator?: boolean
	className?: string
}>

export function DemoSection({ title, desc, separator, className, children }: DemoSectionProps) {
	return (
		<>
			<section>
				<TS
					variant="h3"
					content={title}
					className={cn('my-1 text-sm font-medium', !desc && 'mb-2')}
				/>
				{desc != null && (
					<TS variant="caption" color="secondary" content={desc} gutterBottom />
				)}
				<div className={className}>{children}</div>
			</section>
			{separator && <Separator />}
		</>
	)
}

// DemoLabel --------------------------------------------------------------------------------------]

const widthClasses: Record<NonNullable<DemoLabelProps['size']>, string> = {
	xs: 'text-[10px] shrink-0',
	sm: 'w-16 shrink-0',
	md: 'w-24 shrink-0',
}

type DemoLabelProps = {
	content: string
	size?: 'xs' | 'sm' | 'md'
	className?: string
}

export function DemoLabel({ content, size = 'sm', className }: DemoLabelProps) {
	return (
		<TS
			variant="caption"
			color="secondary"
			content={content}
			inline
			className={cn(widthClasses[size], className)}
		/>
	)
}

// DemoRoot ---------------------------------------------------------------------------------------]

export function DemoRoot({ children }: PropsWithChildren) {
	return (
		<Stack vertical gap={6} align="stretch">
			{children}
		</Stack>
	)
}

// SettingToggle ----------------------------------------------------------------------------------]

type SettingToggleProps = {
	id: string
	label: string
	checked: boolean
}

export function SettingToggle({ id, label, checked }: SettingToggleProps) {
	const [_, toggle] = useUpdateSettings<never>()
	return (
		<Stack gap={0} justify="space-between">
			<Label htmlFor={id} className="text-xs">
				{label}
			</Label>
			<Switch id={id} checked={checked} onCheckedChange={() => toggle(id as never)} />
		</Stack>
	)
}

// SettingSelect ----------------------------------------------------------------------------------]

type SelectOption = { label: string; value: string }
type SettingSelectProps = {
	id: string
	label: string
	value: string
	options: string[] | SelectOption[]
}

export function SettingSelect({ id, label, value, options }: SettingSelectProps) {
	const [update] = useUpdateSettings<never>()

	return (
		<Stack vertical gap={2} align="stretch">
			<Label className="text-xs">{label}</Label>
			<Select
				value={value === null ? 'null' : value}
				onValueChange={(v) => update({ [id]: v === 'null' ? null : v } as never)}
			>
				<SelectTrigger className="h-8 text-xs">
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					{isPlainObject(options[0])
						? map(options as SelectOption[], ({ label, value }) => (
								<SelectItem key={value} value={value}>
									{label}
								</SelectItem>
							))
						: map(options as string[], (option) => (
								<SelectItem key={option} value={option}>
									{option}
								</SelectItem>
							))}
				</SelectContent>
			</Select>
		</Stack>
	)
}
