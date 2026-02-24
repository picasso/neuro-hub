'use client'

import { demoData, type IconDemoState, resolveSize } from './demo-icons-settings'
import { useSettings } from './settings-store'
import { Separator } from '@/components/shadcn/separator'
import { Stack } from '@/components/ui'
import { Icon, type IconName } from '@/components/ui/icon'
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
				<span className="max-w-18 truncate text-[10px] text-muted-foreground group-hover:text-foreground">
					{name}
				</span>
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
				<h3 className="my-1 text-sm font-medium text-foreground">
					Lucide Icons ({libraryIcons.length})
				</h3>
				<p className="mb-4 text-xs text-muted-foreground">
					Основная библиотека. Имена в kebab-case.
				</p>
				<Stack wrap align="stretch">
					{libraryIcons.map((name) => (
						<IconCell key={name} name={name} state={settings} />
					))}
				</Stack>
			</section>
			<Separator />
			{/* custom SVG icons */}
			<section>
				<h3 className="my-1 text-sm font-medium text-foreground">
					Custom SVG ({customIconNames.length})
				</h3>
				<p className="mb-4 text-xs text-muted-foreground">
					Брендовые и специальные иконки. Кастомные SVG-компоненты.
				</p>
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
				<h3 className="my-1 text-sm font-medium text-foreground">Color Presets</h3>
				<p className="mb-4 text-xs text-muted-foreground">
					color prop → Tailwind text-* класс. className перебивает color.
				</p>
				<Stack gap={4}>
					{colorOptions.map((c) => (
						<Stack key={c} vertical>
							<Icon name="circle-check" size="xl" color={c} />
							<span className="text-[10px] text-muted-foreground">{c}</span>
						</Stack>
					))}
				</Stack>
				<Stack gap={3} className="mt-4 rounded-md border p-3">
					<Icon name="star" size="lg" color="primary" className="text-yellow-400" />
					<span className="text-xs text-muted-foreground">
						color=&quot;primary&quot; + className=&quot;text-yellow-400&quot; →
						className wins
					</span>
				</Stack>
			</section>
			<Separator />
			{/* size presets — always shows all sizes, ignores settings */}
			<section>
				<h3 className="my-1 text-sm font-medium text-foreground">Size Presets</h3>
				<p className="mb-4 text-xs text-muted-foreground">
					xs=14, sm=16, md=20 (default), lg=24, xl=32. Также принимает число (px).
				</p>
				<Stack gap={6} align="end">
					{sizePresets.map((s) => (
						<Stack key={s} vertical>
							<Icon name="star" size={s} />
							<span className="text-[10px] text-muted-foreground">{s}</span>
						</Stack>
					))}
					<Stack vertical>
						<Icon name="star" size={48} />
						<span className="text-[10px] text-muted-foreground">48px</span>
					</Stack>
					<Stack vertical>
						<Icon name="star" size={80} />
						<span className="text-[10px] text-muted-foreground">80px</span>
					</Stack>
				</Stack>
			</section>
			<Separator />
			{/* spinning — always shows, ignores settings */}
			<section>
				<h3 className="my-1 text-sm font-medium text-foreground">Spinning</h3>
				<p className="mb-4 text-xs text-muted-foreground">
					spinning prop добавляет animate-spin.
				</p>
				<Stack gap={6}>
					<Stack vertical>
						<Icon name="spinner" size="lg" spinning />
						{showName && (
							<span className="text-[10px] text-muted-foreground">spinner</span>
						)}
					</Stack>
					<Stack vertical>
						<Icon name="loader-circle" size="lg" spinning />
						{showName && (
							<span className="text-[10px] text-muted-foreground">loader-circle</span>
						)}
					</Stack>
					<Stack vertical>
						<Icon name="loader" size="lg" color="primary" spinning />
						{showName && (
							<span className="text-[10px] text-muted-foreground">
								loader + primary
							</span>
						)}
					</Stack>
					<Stack vertical>
						<Icon name="loader-pinwheel" size="xl" color="cta" spinning />
						{showName && (
							<span className="text-[10px] text-muted-foreground">
								loader-pinwheel + xl + cta
							</span>
						)}
					</Stack>
				</Stack>
			</section>
		</Stack>
	)
}
