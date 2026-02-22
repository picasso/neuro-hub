'use client'

import { useState } from 'react'
import { Separator } from '@/components/shadcn/separator'
import { Icon, type IconName } from '@/components/ui/icon'

// all library icons (direct lucide names in kebab-case)
const libraryIcons: IconName[] = [
	'alert-triangle',
	'badge-check',
	'ban',
	'book-marked',
	'briefcase',
	'building',
	'check',
	'chevron-down',
	'circle-alert',
	'circle-check',
	'code',
	'credit-card',
	'eye',
	'eye-off',
	'file-text',
	'gavel',
	'github',
	'image',
	'layout-grid',
	'log-in',
	'mail',
	'percent',
	'quote',
	'search',
	'shield-check',
	'star',
	'thumbs-up',
	'trash',
	'user',
	'user-plus',
	'users',
	'video',
	'volume',
	'x',
]

const customIconNames: IconName[] = ['spinner', 'linked-in', 'telegram', 'x-twitter']

const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const
const colors = [
	'primary',
	'cta',
	'muted',
	'dimmed',
	'destructive',
	'success',
	'warning',
	'info',
] as const

export function DemoIcons() {
	const [hoveredIcon, setHoveredIcon] = useState<string | null>(null)

	return (
		<div className="flex flex-col gap-8">
			{/* all library icons */}
			<section>
				<h3 className="mb-1 text-sm font-medium text-foreground">
					Lucide Icons ({libraryIcons.length})
				</h3>
				<p className="mb-4 text-xs text-muted-foreground">
					Основная библиотека. Имена в kebab-case.
				</p>
				<div className="flex flex-wrap gap-2">
					{libraryIcons.map((name) => (
						<div
							key={name}
							className="group flex flex-col items-center gap-1.5 rounded-md border p-2.5 transition-colors hover:bg-accent"
							onMouseEnter={() => setHoveredIcon(name)}
							onMouseLeave={() => setHoveredIcon(null)}
						>
							<Icon name={name} size="lg" />
							<span className="max-w-[72px] truncate text-[10px] text-muted-foreground group-hover:text-foreground">
								{name}
							</span>
						</div>
					))}
				</div>
				{hoveredIcon && (
					<p className="mt-2 text-xs text-dimmed">
						{'<Icon name="'}
						<span className="text-foreground">{hoveredIcon}</span>
						{'" />'}
					</p>
				)}
			</section>
			<Separator />
			{/* custom SVG icons */}
			<section>
				<h3 className="mb-1 text-sm font-medium text-foreground">
					Custom SVG ({customIconNames.length})
				</h3>
				<p className="mb-4 text-xs text-muted-foreground">
					Брендовые и специальные иконки. Кастомные SVG-компоненты.
				</p>
				<div className="flex flex-wrap gap-2">
					{customIconNames.map((name) => (
						<div
							key={name}
							className="flex flex-col items-center gap-1.5 rounded-md border p-2.5 transition-colors hover:bg-accent"
						>
							<Icon name={name} size="lg" spinning={name === 'spinner'} />
							<span className="text-[10px] text-muted-foreground">{name}</span>
						</div>
					))}
				</div>
			</section>
			<Separator />
			{/* color presets */}
			<section>
				<h3 className="mb-1 text-sm font-medium text-foreground">Color Presets</h3>
				<p className="mb-4 text-xs text-muted-foreground">
					color prop → Tailwind text-* класс. className перебивает color.
				</p>
				<div className="flex items-center gap-4">
					{colors.map((c) => (
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
			{/* size presets */}
			<section>
				<h3 className="mb-1 text-sm font-medium text-foreground">Size Presets</h3>
				<p className="mb-4 text-xs text-muted-foreground">
					xs=14, sm=16, md=20 (default), lg=24, xl=32. Также принимает число (px).
				</p>
				<div className="flex items-end gap-6">
					{sizes.map((s) => (
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
			{/* spinning */}
			<section>
				<h3 className="mb-1 text-sm font-medium text-foreground">Spinning</h3>
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
