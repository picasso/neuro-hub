'use client'

import { demoData, type IconDemoState, resolveSize } from './demo-icons-settings'
import { useSettings } from './settings-store'
import { Separator } from '@/components/shadcn/separator'
import { Stack, TS, type IconName, Icon } from '@/components/ui'
import { cn } from '@/lib/utils'

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
				'group transition-colors rounded-md hover:bg-primary/15',
				showBorder && 'border p-2.5',
				showBg && 'bg-primary rounded-full hover:bg-emerald-600',
				showBg && showBorder && 'border-emerald-600',
				!showBorder && 'p-1.5',
			)}
		>
			<Icon
				name={name}
				size={resolveSize(sizePreset, customSize)}
				color={color ?? undefined}
				spinning={spinning}
			/>
			{showName && (
				<TS
					variant="caption"
					color="secondary"
					content={name}
					inline
					className="max-w-18 truncate text-[10px] group-hover:text-foreground"
				/>
			)}
		</Stack>
	)
}

// main demo component ----------------------------------------------------------------------------]

export function DemoIcons() {
	const settings = useSettings<IconDemoState>()
	const { showName } = settings

	return (
		<Stack vertical gap={4} align="stretch">
			{/* lucide icons grid */}
			<section>
				<TS
					variant="h3"
					content={`Lucide Icons (${libraryIcons.length})`}
					className="my-1 text-sm font-medium"
				/>
				<TS
					variant="caption"
					color="secondary"
					content="Основная библиотека. Имена в kebab-case."
					gutterBottom
				/>
				<Stack wrap align="stretch">
					{libraryIcons.map((name) => (
						<IconCell key={name} name={name} state={settings} />
					))}
				</Stack>
			</section>
			<Separator />
			{/* custom SVG icons */}
			<section>
				<TS
					variant="h3"
					content={`Custom SVG (${customIconNames.length})`}
					className="my-1 text-sm font-medium"
				/>
				<TS
					variant="caption"
					color="secondary"
					content="Брендовые и специальные иконки. Кастомные SVG-компоненты."
					gutterBottom
				/>
				<Stack wrap align="stretch">
					{customIconNames.map((name) => (
						<IconCell
							key={name}
							name={name}
							state={settings}
							spinning={name === 'spinner'}
						/>
					))}
				</Stack>
			</section>
			<Separator />
			{/* color presets — always shows all colors, ignores settings */}
			<section>
				<TS variant="h3" content="Color Presets" className="my-1 text-sm font-medium" />
				<TS
					variant="caption"
					color="secondary"
					content="color prop → Tailwind text-* класс. className перебивает color."
					gutterBottom
				/>
				<Stack gap={4}>
					{colorOptions.map((c) => (
						<Stack key={c} vertical>
							<Icon name="circle-check" size="xl" color={c} />
							<TS
								variant="caption"
								color="secondary"
								content={c}
								inline
								className="text-[10px]"
							/>
						</Stack>
					))}
				</Stack>
				<Stack gap={3} className="mt-4 rounded-md border p-3">
					<Icon name="star" size="lg" color="primary" className="text-yellow-400" />
					<TS
						variant="caption"
						color="secondary"
						content='color="primary" + className="text-yellow-400" → className wins'
						inline
						className="text-xs"
					/>
				</Stack>
			</section>
			<Separator />
			{/* size presets — always shows all sizes, ignores settings */}
			<section>
				<TS variant="h3" content="Size Presets" className="my-1 text-sm font-medium" />
				<TS
					variant="caption"
					color="secondary"
					content="xs=14, sm=16, md=20 (default), lg=24, xl=32. Также принимает число (px)."
					gutterBottom
				/>
				<Stack gap={6} align="end">
					{sizePresets.map((s) => (
						<Stack key={s} vertical>
							<Icon name="star" size={s} />
							<TS
								variant="caption"
								color="secondary"
								content={s}
								inline
								className="text-[10px]"
							/>
						</Stack>
					))}
					<Stack vertical>
						<Icon name="star" size={48} />
						<TS
							variant="caption"
							color="secondary"
							content="48px"
							inline
							className="text-[10px]"
						/>
					</Stack>
					<Stack vertical>
						<Icon name="star" size={80} />
						<TS
							variant="caption"
							color="secondary"
							content="80px"
							inline
							className="text-[10px]"
						/>
					</Stack>
				</Stack>
			</section>
			<Separator />
			{/* spinning — always shows, ignores settings */}
			<section>
				<TS variant="h3" content="Spinning" className="my-1 text-sm font-medium" />
				<TS
					variant="caption"
					color="secondary"
					content="spinning prop добавляет animate-spin."
					gutterBottom
				/>
				<Stack gap={6}>
					<Stack vertical>
						<Icon name="spinner" size="lg" spinning />
						{showName && (
							<TS
								variant="caption"
								color="secondary"
								content="spinner"
								inline
								className="text-[10px]"
							/>
						)}
					</Stack>
					<Stack vertical>
						<Icon name="loader-circle" size="lg" spinning />
						{showName && (
							<TS
								variant="caption"
								color="secondary"
								content="loader-circle"
								inline
								className="text-[10px]"
							/>
						)}
					</Stack>
					<Stack vertical>
						<Icon name="loader" size="lg" color="primary" spinning />
						{showName && (
							<TS
								variant="caption"
								color="secondary"
								content="loader + primary"
								inline
								className="text-[10px]"
							/>
						)}
					</Stack>
					<Stack vertical>
						<Icon name="loader-pinwheel" size="xl" color="cta" spinning />
						{showName && (
							<TS
								variant="caption"
								color="secondary"
								content="loader-pinwheel + xl + cta"
								inline
								className="text-[10px]"
							/>
						)}
					</Stack>
				</Stack>
			</section>
		</Stack>
	)
}
