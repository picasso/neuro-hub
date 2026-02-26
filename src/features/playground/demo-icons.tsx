'use client'

import { DemoLabel, DemoRoot, DemoSection } from './components-utils'
import { demoData, type IconDemoState, resolveSize } from './demo-icons-settings'
import { useSettings } from './settings-store'
import { cn } from '@/lib/utils'
import { Stack, type IconName, Icon } from '@/ui'

// data -------------------------------------------------------------------------------------------]

const { libraryIcons, customIconNames, sizePresets, colorOptions } = demoData

// icon cell --------------------------------------------------------------------------------------]

type IconCellProps = {
	name: IconName
	state: IconDemoState
	spinning?: boolean
}

function IconCell({
	name,
	state: { showName, showBorder, showBg, color, sizePreset, customSize },
	spinning,
}: IconCellProps) {
	return (
		<Stack
			vertical
			align="center"
			gap={1.5}
			className={cn(
				'group transition-colors rounded-md',
				showBorder && 'border p-2.5',
				showBg && 'bg-primary/30 rounded-full',
				showBg && showBorder && 'border-emerald-600',
				!showBorder && 'p-1.5',
				color === 'contrast' && 'hover:bg-white/20 border-white',
				color !== 'contrast' && 'hover:bg-primary/15',
			)}
		>
			<Icon
				name={name}
				size={resolveSize(sizePreset, customSize)}
				color={color ?? undefined}
				spinning={spinning}
			/>
			{showName && (
				<DemoLabel
					content={name}
					size="xs"
					className="max-w-18 truncate group-hover:text-inherit text-inherit"
				/>
			)}
		</Stack>
	)
}

// main demo component ----------------------------------------------------------------------------]

export function DemoIcons() {
	const settings = useSettings<IconDemoState>()
	const { showName, color } = settings

	return (
		<DemoRoot>
			<DemoSection
				title={`Lucide Icons (${libraryIcons.length})`}
				desc="Основная библиотека. Имена в `kebab-case`"
				separator
			>
				<Stack
					wrap
					align="stretch"
					className={cn(
						'p-4 rounded-md border',
						color === 'contrast' && 'text-white bg-primary',
					)}
				>
					{libraryIcons.map((name) => (
						<IconCell key={name} name={name} state={settings} />
					))}
				</Stack>
			</DemoSection>
			<DemoSection
				title={`Custom SVG (${customIconNames.length})`}
				desc="Брендовые и специальные иконки. Кастомные `SVG` компоненты"
				separator
			>
				<Stack
					wrap
					align="stretch"
					className={cn(
						'p-4 rounded-md border',
						color === 'contrast' && 'text-white bg-primary',
					)}
				>
					{customIconNames.map((name) => (
						<IconCell
							key={name}
							name={name}
							state={settings}
							spinning={name === 'spinner'}
						/>
					))}
				</Stack>
			</DemoSection>
			<DemoSection
				title="Color Presets"
				desc="`color` prop → Tailwind `text-*` класс. `+className` перебивает `!color`"
				separator
			>
				<Stack gap={4}>
					{colorOptions.map((c) => (
						<Stack key={c} vertical>
							<Icon name="circle-check" size="xl" color={c} />
							<DemoLabel content={c} size="xs" />
						</Stack>
					))}
				</Stack>
				<Stack gap={3} className="mt-4 rounded-md border p-3">
					<Icon name="star" size="lg" color="primary" className="text-yellow-400" />
					<DemoLabel
						content='color="**primary**" + className="**text-yellow-400**" → className wins'
						size="xs"
						className="text-xs"
					/>
				</Stack>
			</DemoSection>
			<DemoSection
				title="Size Presets"
				desc="`*xs=14`, `*sm=16`, `#md=20` **default**, `*lg=24`, `*xl=32`. Также принимает число `px`"
				separator
			>
				<Stack gap={6} align="end">
					{sizePresets.map((s) => (
						<Stack key={s} vertical>
							<Icon name="star" size={s} />
							<DemoLabel content={s} size="xs" />
						</Stack>
					))}
					<Stack vertical>
						<Icon name="star" size={48} />
						<DemoLabel content="48px" size="xs" />
					</Stack>
					<Stack vertical>
						<Icon name="star" size={80} />
						<DemoLabel content="80px" size="xs" />
					</Stack>
				</Stack>
			</DemoSection>
			<DemoSection title="Spinning" desc="`*spinning` prop добавляет `animate-spin`">
				<Stack gap={6}>
					<Stack vertical>
						<Icon name="spinner" size="lg" spinning />
						{showName && <DemoLabel content="spinner" size="xs" />}
					</Stack>
					<Stack vertical>
						<Icon name="loader-circle" size="lg" spinning />
						{showName && <DemoLabel content="loader-circle" size="xs" />}
					</Stack>
					<Stack vertical>
						<Icon name="loader" size="lg" color="primary" spinning />
						{showName && <DemoLabel content="loader + primary" size="xs" />}
					</Stack>
					<Stack vertical>
						<Icon name="loader-pinwheel" size="xl" color="cta" spinning />
						{showName && <DemoLabel content="loader-pinwheel + xl + cta" size="xs" />}
					</Stack>
				</Stack>
			</DemoSection>
		</DemoRoot>
	)
}
