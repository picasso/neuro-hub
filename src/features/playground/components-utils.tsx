import { useUpdateSettings } from './settings-store'
import type { PropsWithChildren } from 'react'
import { Select, Separator, Switch, Stack, TS, Badge, type IconName } from '@/ui'
import { cn } from '@/utils'

// DemoSection ------------------------------------------------------------------------------------]

type DemoSectionProps = PropsWithChildren<{
	title: string
	desc?: string
	asBadge?: true | IconName
	separator?: boolean
	className?: string
}>

export function DemoSection({
	title,
	desc,
	asBadge,
	separator,
	className,
	children,
}: DemoSectionProps) {
	return (
		<>
			<section>
				{asBadge ? (
					<Badge
						variant="secondary"
						size="xs"
						color="secondary"
						label={title}
						icon={asBadge === true ? 'code' : asBadge}
						className="mb-2"
					/>
				) : (
					<TS
						variant="h3"
						content={title}
						className={cn('my-1 text-sm font-medium', !desc && 'mb-2')}
					/>
				)}
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
	nowrap?: boolean
}

export function DemoLabel({ content, size = 'sm', className, nowrap }: DemoLabelProps) {
	return (
		<TS
			variant="caption"
			color="secondary"
			content={content}
			inline
			nowrap={nowrap}
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
	helper?: string
}

export function SettingToggle({ id, label, checked, helper }: SettingToggleProps) {
	const [_, toggle] = useUpdateSettings<never>()
	return (
		<Switch
			id={id}
			label={label}
			checked={checked}
			onCheckedChange={() => toggle(id as never)}
			horizontalClassName="flex-row-reverse justify-between"
			labelClassName="text-xs"
			helperClassName="text-xs -mt-1!"
			helper={helper}
		/>
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
		<Select
			compact
			label={label}
			value={value}
			onValueChange={(v) => update({ [id]: v } as never)}
			items={options}
			alignWithTrigger
		/>
	)
}
