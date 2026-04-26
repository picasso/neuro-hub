'use client'

import { map } from 'lodash'
import { DemoRoot, DemoSection } from './components-utils'
import { type BadgeDemoState } from './demo-badge-settings'
import { useSettings } from './settings-store'
import { Badge, needsContrast, Stack } from '@/ui'
import { cn } from '@/utils'

const variants = ['primary', 'secondary', 'destructive', 'outline', 'ghost', 'link'] as const
const sizes = ['xs', 'sm', 'md'] as const
const colors = [
	'primary',
	'secondary',
	'dimmed',
	'contrast',
	'soft',
	'destructive',
	'error',
	'success',
	'warning',
	'info',
	'cta',
] as const

export function DemoBadge() {
	const settings = useSettings<BadgeDemoState>()
	const { variant, size, color, withIcon, closable, capitalize, lowercased, moreContrast } =
		settings

	const hasOverlay = color === 'cta' && variant === 'outline'
	return (
		<DemoRoot>
			<DemoSection
				title="Interactive"
				desc="Обёртка `Badge` на базе **shadcn**: variant, size, color, icon, onClose, capitalize"
				separator
			>
				<Stack
					gap={2}
					wrap
					align="center"
					className={cn(
						'p-4 rounded-md border',
						needsContrast(hasOverlay ? variant : null, color) &&
							'text-white bg-primary',
					)}
				>
					<Badge
						variant={variant}
						size={size}
						label={variant}
						color={color === 'null' ? undefined : color}
						icon={withIcon ? 'book-marked' : undefined}
						onClose={closable ? () => {} : undefined}
						capitalize={capitalize}
						lowercased={lowercased}
						moreContrast={moreContrast}
					/>
				</Stack>
			</DemoSection>
			<DemoSection title="Variants" asBadge="shield-check" separator>
				<Stack wrap className="mb-4">
					{map(variants, (variant) => (
						<Badge
							capitalize={capitalize}
							lowercased={lowercased}
							key={variant}
							variant={variant}
							size="md"
							label={variant}
						/>
					))}
				</Stack>
				<Stack wrap className="mb-4">
					{map(variants, (variant) => (
						<Badge
							capitalize={capitalize}
							lowercased={lowercased}
							key={variant}
							variant={variant}
							size="sm"
							icon="book-marked"
							label={variant}
						/>
					))}
				</Stack>
				<Stack wrap>
					{map(variants, (variant) => (
						<Badge
							capitalize={capitalize}
							lowercased={lowercased}
							key={variant}
							variant={variant}
							size="xs"
							label={variant}
							onClose={() => {}}
						/>
					))}
				</Stack>
			</DemoSection>
			<DemoSection title="Sizes" asBadge="shield-check" separator>
				<Stack className="mb-4">
					{map(sizes, (size) => (
						<Badge
							key={size}
							variant="primary"
							size={size}
							label={`size="${size}"`}
							capitalize={capitalize}
						/>
					))}
				</Stack>
				<Stack>
					{map(sizes, (size) => (
						<Badge
							key={size}
							variant="outline"
							size={size}
							label={`size="${size}"`}
							capitalize={capitalize}
						/>
					))}
				</Stack>
			</DemoSection>
			<DemoSection
				title="Colors"
				asBadge="shield-check"
				desc="Все доступные значения `color`, включая semantic и status colors"
				separator
			>
				<Stack gap={2} wrap align="center">
					{map(colors, (color) => (
						<Stack
							key={color}
							gap={2}
							align="center"
							className={cn(
								'rounded-md border p-2',
								needsContrast(null, color) && 'bg-primary text-white',
							)}
						>
							<Badge
								variant="primary"
								color={color}
								label={`${color} primary`}
								icon="cog"
								capitalize={capitalize}
								lowercased={lowercased}
							/>
							<Badge
								variant="secondary"
								color={color}
								label={`${color} secondary`}
								icon="cog"
								capitalize={capitalize}
								lowercased={lowercased}
							/>
							<Badge
								variant="outline"
								color={color}
								label={`${color} outline`}
								capitalize={capitalize}
								lowercased={lowercased}
							/>
						</Stack>
					))}
				</Stack>
			</DemoSection>
			<DemoSection title="With icon" asBadge="shield-check" separator>
				<Stack gap={2} wrap align="center">
					<Badge
						variant="primary"
						label="save"
						icon="book-marked"
						capitalize={capitalize}
					/>
					<Badge variant="outline" label="search" icon="search" capitalize={capitalize} />
					<Badge
						variant="destructive"
						label="delete"
						icon="trash"
						capitalize={capitalize}
					/>
					<Badge variant="secondary" label="email" icon="email" capitalize={capitalize} />
				</Stack>
			</DemoSection>
			<DemoSection title="Closable (onClose)" asBadge="shield-check">
				<Stack gap={2} wrap align="center">
					<Badge
						variant="primary"
						label="tag"
						onClose={() => {}}
						capitalize={capitalize}
					/>
					<Badge
						variant="outline"
						label="filter"
						icon="search"
						onClose={() => {}}
						capitalize={capitalize}
					/>
					<Badge
						variant="secondary"
						label="skill"
						onClose={() => {}}
						capitalize={capitalize}
					/>
				</Stack>
			</DemoSection>
		</DemoRoot>
	)
}
