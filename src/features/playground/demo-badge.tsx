'use client'

import { DemoRoot, DemoSection } from './components-utils'
import { type BadgeDemoState } from './demo-badge-settings'
import { useSettings } from './settings-store'
import { Badge, needsContrast, Stack } from '@/ui'
import { cn } from '@/utils'

const variants = ['primary', 'secondary', 'destructive', 'outline', 'ghost', 'link'] as const
const sizes = ['xs', 'sm', 'md', 'lg'] as const

export function DemoBadge() {
	const settings = useSettings<BadgeDemoState>()
	const { variant, size, color, withIcon, closable } = settings

	return (
		<DemoRoot>
			<DemoSection
				title="Interactive"
				desc="Обёртка `?Badge` на базе **shadcn** —> варианты, размеры, иконка, onClose"
				separator
			>
				<Stack
					gap={2}
					wrap
					align="center"
					className={cn(
						'p-4 rounded-md border',
						needsContrast(null, color) && 'text-white bg-primary',
					)}
				>
					<Badge
						variant={variant}
						size={size}
						label={variant}
						color={color === 'null' ? undefined : color}
						icon={withIcon ? 'book-marked' : undefined}
						onClose={closable ? () => {} : undefined}
					/>
				</Stack>
			</DemoSection>
			<DemoSection title="Variants" asBadge="shield-check" separator>
				<Stack wrap className="mb-4">
					{variants.map((variant) => (
						<Badge key={variant} variant={variant} size="md" label={variant} />
					))}
				</Stack>
				<Stack wrap className="mb-4">
					{variants.map((variant) => (
						<Badge
							key={variant}
							variant={variant}
							size="sm"
							icon="book-marked"
							label={variant}
						/>
					))}
				</Stack>
				<Stack wrap>
					{variants.map((variant) => (
						<Badge
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
					{sizes.map((size) => (
						<Badge key={size} variant="primary" size={size} label={`Size="${size}"`} />
					))}
				</Stack>
				<Stack>
					{sizes.map((size) => (
						<Badge key={size} variant="outline" size={size} label={`Size="${size}"`} />
					))}
				</Stack>
			</DemoSection>
			<DemoSection title="With icon" asBadge="shield-check" separator>
				<Stack gap={2} wrap align="center">
					<Badge variant="primary" label="Save" icon="book-marked" />
					<Badge variant="outline" label="Search" icon="search" />
					<Badge variant="destructive" label="Delete" icon="trash" />
					<Badge variant="secondary" label="Email" icon="email" />
				</Stack>
			</DemoSection>
			<DemoSection title="Closable (onClose)" asBadge="shield-check">
				<Stack gap={2} wrap align="center">
					<Badge variant="primary" label="Tag" onClose={() => {}} />
					<Badge variant="outline" label="Filter" icon="search" onClose={() => {}} />
					<Badge variant="secondary" label="Skill" onClose={() => {}} />
				</Stack>
			</DemoSection>
		</DemoRoot>
	)
}
