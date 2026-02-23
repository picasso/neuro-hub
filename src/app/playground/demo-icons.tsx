'use client'

import { demoData, type IconDemoState, resolveSize } from './demo-icons-settings'
import { useSettings } from './settings-store'
import { Separator } from '@/components/shadcn/separator'
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
		<div
			className={cn(
				'group flex flex-col items-center gap-1.5 transition-colors rounded-md hover:bg-primary/15',
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
		</div>
	)
}

// main demo component ----------------------------------------------------------------------------]

export function DemoIcons() {
	const settings = useSettings<IconDemoState>()

	return (
		<div className="flex flex-col gap-4">
			{/* lucide icons grid */}
			<section>
				<h3 className="my-1 text-sm font-medium text-foreground">
					Lucide Icons ({libraryIcons.length})
				</h3>
				<p className="mb-4 text-xs text-muted-foreground">
					Основная библиотека. Имена в kebab-case.
				</p>
				<div className="flex flex-wrap gap-2">
					{libraryIcons.map((name) => (
						<IconCell key={name} name={name} state={settings} />
					))}
				</div>
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
				<div className="flex flex-wrap gap-2">
					{customIconNames.map((name) => (
						<IconCell
							key={name}
							name={name}
							state={settings}
							spinning={name === 'spinner'}
						/>
					))}
				</div>
			</section>
			<Separator />
			{/* color presets — always shows all colors, ignores settings */}
			<section>
				<h3 className="my-1 text-sm font-medium text-foreground">Color Presets</h3>
				<p className="mb-4 text-xs text-muted-foreground">
					color prop → Tailwind text-* класс. className перебивает color.
				</p>
				<div className="flex items-center gap-4">
					{colorOptions.map((c) => (
						<div key={c} className="flex flex-col items-center gap-2">
							<Icon name="circle-check" size="xl" color={c} />
							<span className="text-[10px] text-muted-foreground">{c}</span>
						</div>
					))}
				</div>
				<div className="mt-4 flex items-center gap-3 rounded-md border p-3">
					<Icon name="star" size="lg" color="primary" className="text-yellow-400" />
					<span className="text-xs text-muted-foreground">
						color=&quot;primary&quot; + className=&quot;text-yellow-400&quot; →
						className wins
					</span>
				</div>
			</section>
			<Separator />
			{/* size presets — always shows all sizes, ignores settings */}
			<section>
				<h3 className="my-1 text-sm font-medium text-foreground">Size Presets</h3>
				<p className="mb-4 text-xs text-muted-foreground">
					xs=14, sm=16, md=20 (default), lg=24, xl=32. Также принимает число (px).
				</p>
				<div className="flex items-end gap-6">
					{sizePresets.map((s) => (
						<div key={s} className="flex flex-col items-center gap-2">
							<Icon name="star" size={s} />
							<span className="text-[10px] text-muted-foreground">{s}</span>
						</div>
					))}
					<div className="flex flex-col items-center gap-2">
						<Icon name="star" size={48} />
						<span className="text-[10px] text-muted-foreground">48px</span>
					</div>
					<div className="flex flex-col items-center gap-2">
						<Icon name="star" size={80} />
						<span className="text-[10px] text-muted-foreground">80px</span>
					</div>
				</div>
			</section>
			<Separator />
			{/* spinning — always shows, ignores settings */}
			<section>
				<h3 className="my-1 text-sm font-medium text-foreground">Spinning</h3>
				<p className="mb-4 text-xs text-muted-foreground">
					spinning prop добавляет animate-spin.
				</p>
				<div className="flex items-center gap-6">
					<div className="flex flex-col items-center gap-2">
						<Icon name="spinner" size="lg" spinning />
						<span className="text-[10px] text-muted-foreground">spinner</span>
					</div>
					<div className="flex flex-col items-center gap-2">
						<Icon name="spinner" size="lg" color="primary" spinning />
						<span className="text-[10px] text-muted-foreground">+ primary</span>
					</div>
					<div className="flex flex-col items-center gap-2">
						<Icon name="spinner" size="xl" color="cta" spinning />
						<span className="text-[10px] text-muted-foreground">xl + cta</span>
					</div>
				</div>
			</section>
		</div>
	)
}
