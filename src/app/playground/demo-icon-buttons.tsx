'use client'

import { DemoLabel, DemoRoot, DemoSection } from './components-utils'
import { type IconButtonDemoState } from './demo-icon-buttons-settings'
import { useSettings } from './settings-store'
import { IconButton, Stack } from '@/components/ui'
import { cn } from '@/lib/utils'

const icons = ['thumbs-up', 'search', 'trash', 'book-marked', 'eye', 'collections'] as const

export function DemoIconButtons() {
	const settings = useSettings<IconButtonDemoState>()
	const { showName, variant, size, rounded, disabled, spinning, forceSize } = settings

	const resolvedForceSize = forceSize === 'auto' ? undefined : forceSize

	return (
		<DemoRoot>
			<DemoSection
				title="Interactive"
				desc="Обёртка `IconButton` на базе shadcn `Button` + `Icon`."
				separator
			>
				<Stack
					gap={2}
					wrap
					align="stretch"
					className={cn(
						'p-4 rounded-md',
						variant === 'contrast' && 'text-white bg-primary',
					)}
				>
					{icons.map((icon) => (
						<Stack vertical key={icon}>
							<IconButton
								key={icon}
								icon={icon}
								variant={variant}
								size={size}
								rounded={rounded}
								disabled={disabled}
								spinning={spinning}
								forceSize={resolvedForceSize}
							/>
							{showName && (
								<DemoLabel
									content={icon}
									size="xs"
									className={variant === 'contrast' ? 'text-white' : undefined}
								/>
							)}
						</Stack>
					))}
				</Stack>
			</DemoSection>

			<DemoSection title="Variants (+ rounded)" separator>
				<Stack gap={2} wrap align="stretch">
					<IconButton icon="thumbs-up" variant="ghost" />
					<IconButton icon="search" variant="outline" />
					<IconButton icon="book-marked" variant="secondary" />
					<IconButton icon="trash" variant="destructive" />
					<IconButton icon="eye" variant="default" className="mr-10" />
					<IconButton icon="thumbs-up" variant="ghost" rounded />
					<IconButton icon="search" variant="outline" rounded />
					<IconButton icon="book-marked" variant="secondary" rounded />
					<IconButton icon="trash" variant="destructive" rounded />
					<IconButton icon="eye" variant="default" rounded />
				</Stack>
			</DemoSection>

			<DemoSection title="Sizes" separator>
				<Stack gap={2} wrap align="stretch">
					<Stack vertical>
						<IconButton icon="search" size="icon" variant="outline" />
						{showName && <DemoLabel content="icon" size="xs" />}
					</Stack>
					<Stack vertical>
						<IconButton icon="search" size="sm" variant="outline" />
						{showName && <DemoLabel content="sm" size="xs" />}
					</Stack>
					<Stack vertical>
						<IconButton icon="search" size="md" variant="outline" />
						{showName && <DemoLabel content="md" size="xs" />}
					</Stack>
					<Stack vertical>
						<IconButton icon="search" size="lg" variant="outline" />
						{showName && <DemoLabel content="lg" size="xs" />}
					</Stack>
					<Stack vertical>
						<IconButton icon="search" size="xl" variant="outline" />
						{showName && <DemoLabel content="xl" size="xs" />}
					</Stack>
				</Stack>
			</DemoSection>
			<DemoSection
				title="Sizes + forceSize"
				desc="`forceSize` prop влияет на размер иконки и а `size` prop определяет размер кнопки."
				separator
			>
				<Stack gap={2} wrap align="stretch">
					<Stack vertical>
						<IconButton
							icon="book-marked"
							size="icon"
							variant="outline"
							forceSize="xs"
						/>
						{showName && <DemoLabel content="icon + xs" size="xs" />}
					</Stack>
					<Stack vertical>
						<IconButton icon="book-marked" size="sm" variant="outline" forceSize="sm" />
						{showName && <DemoLabel content="sm + sm" size="xs" />}
					</Stack>
					<Stack vertical>
						<IconButton icon="book-marked" size="md" variant="outline" forceSize="md" />
						{showName && <DemoLabel content="md + md" size="xs" />}
					</Stack>
					<Stack vertical>
						<IconButton icon="book-marked" size="lg" variant="outline" forceSize="lg" />
						{showName && <DemoLabel content="lg + lg" size="xs" />}
					</Stack>
					<Stack vertical>
						<IconButton icon="book-marked" size="xl" variant="outline" forceSize="xl" />
						{showName && <DemoLabel content="xl + xl" size="xs" />}
					</Stack>

					<Stack vertical>
						<IconButton icon="book-marked" size="xl" variant="outline" forceSize="md" />
						{showName && <DemoLabel content="xl + md" size="xs" />}
					</Stack>
					<Stack vertical>
						<IconButton icon="book-marked" size="sm" variant="outline" forceSize="xl" />
						{showName && <DemoLabel content="sm + xl" size="xs" />}
					</Stack>
					<Stack vertical>
						<IconButton icon="book-marked" size="lg" variant="outline" forceSize="xs" />
						{showName && <DemoLabel content="lg + xs" size="xs" />}
					</Stack>
				</Stack>
			</DemoSection>
			<DemoSection title="Hrefs + rounded">
				<Stack gap={2} wrap align="stretch">
					<IconButton icon="thumbs-up" variant="ghost" href="https://github.com/" />
					<IconButton icon="search" variant="outline" href="https://apple.com" />
					<IconButton icon="book-marked" variant="secondary" href="/projects" />
					<IconButton icon="trash" variant="destructive" href="/freelancers" />
					<IconButton icon="eye" variant="default" href="/" className="mr-10" />
					<IconButton
						icon="thumbs-up"
						variant="ghost"
						rounded
						href="https://github.com"
					/>
					<IconButton icon="search" variant="outline" rounded href="https://apple.com" />
					<IconButton icon="book-marked" variant="secondary" rounded href="/projects" />
					<IconButton icon="trash" variant="destructive" rounded href="/freelancers" />
					<IconButton icon="eye" variant="default" rounded href="/" className="mr-10" />

					<IconButton icon="search" variant="outline" disabled href="https://apple.com" />
					<IconButton
						icon="book-marked"
						variant="secondary"
						rounded
						disabled
						href="/projects"
					/>
				</Stack>
			</DemoSection>
		</DemoRoot>
	)
}
