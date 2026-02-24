'use client'

import { type IconButtonDemoState } from './demo-icon-buttons-settings'
import { useSettings } from './settings-store'
import { Separator } from '@/components/shadcn/separator'
import { IconButton, Stack } from '@/components/ui'
import { cn } from '@/lib/utils'

const icons = ['thumbs-up', 'search', 'trash', 'book-marked', 'eye', 'collections'] as const

export function DemoIconButtons() {
	const settings = useSettings<IconButtonDemoState>()
	const { showName, variant, size, rounded, disabled, spinning, forceSize } = settings

	const resolvedForceSize = forceSize === 'auto' ? undefined : forceSize

	return (
		<Stack vertical gap={6} align="stretch">
			<section>
				<h3 className="my-1 text-sm font-medium text-foreground">Interactive</h3>
				<p className="mb-4 text-xs text-muted-foreground">
					Обёртка `IconButton` на базе shadcn `Button` + `Icon`.
				</p>
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
								<span className="text-[10px] text-muted-foreground">{icon}</span>
							)}
						</Stack>
					))}
				</Stack>
			</section>

			<Separator />

			<section>
				<h3 className="my-1 text-sm font-medium text-foreground">Variants (+ rounded)</h3>
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
			</section>

			<section>
				<h3 className="my-1 text-sm font-medium text-foreground">Sizes</h3>
				<Stack gap={2} wrap align="stretch">
					<Stack vertical>
						<IconButton icon="search" size="icon" variant="outline" />
						{showName && (
							<span className="text-[10px] text-muted-foreground">icon</span>
						)}
					</Stack>
					<Stack vertical>
						<IconButton icon="search" size="sm" variant="outline" />
						{showName && <span className="text-[10px] text-muted-foreground">sm</span>}
					</Stack>
					<Stack vertical>
						<IconButton icon="search" size="md" variant="outline" />
						{showName && <span className="text-[10px] text-muted-foreground">md</span>}
					</Stack>
					<Stack vertical>
						<IconButton icon="search" size="lg" variant="outline" />
						{showName && <span className="text-[10px] text-muted-foreground">lg</span>}
					</Stack>
					<Stack vertical>
						<IconButton icon="search" size="xl" variant="outline" />
						{showName && <span className="text-[10px] text-muted-foreground">xl</span>}
					</Stack>
				</Stack>
			</section>
			<section>
				<h3 className="my-1 text-sm font-medium text-foreground">Sizes + forceSize</h3>
				<p className="mb-4 text-xs text-muted-foreground">
					`forceSize` prop влияет на размер иконки и а `size` prop определяет размер
					кнопки.
				</p>
				<Stack gap={2} wrap align="stretch">
					<Stack vertical>
						<IconButton
							icon="book-marked"
							size="icon"
							variant="outline"
							forceSize="xs"
						/>
						{showName && (
							<span className="text-[10px] text-muted-foreground">icon + xs</span>
						)}
					</Stack>
					<Stack vertical>
						<IconButton icon="book-marked" size="sm" variant="outline" forceSize="sm" />
						{showName && (
							<span className="text-[10px] text-muted-foreground">sm + sm</span>
						)}
					</Stack>
					<Stack vertical>
						<IconButton icon="book-marked" size="md" variant="outline" forceSize="md" />
						{showName && (
							<span className="text-[10px] text-muted-foreground">md + md</span>
						)}
					</Stack>
					<Stack vertical>
						<IconButton icon="book-marked" size="lg" variant="outline" forceSize="lg" />
						{showName && (
							<span className="text-[10px] text-muted-foreground">lg + lg</span>
						)}
					</Stack>
					<Stack vertical>
						<IconButton icon="book-marked" size="xl" variant="outline" forceSize="xl" />
						{showName && (
							<span className="text-[10px] text-muted-foreground">xl + xl</span>
						)}
					</Stack>

					<Stack vertical>
						<IconButton icon="book-marked" size="xl" variant="outline" forceSize="md" />
						{showName && (
							<span className="text-[10px] text-muted-foreground">xl + md</span>
						)}
					</Stack>
					<Stack vertical>
						<IconButton icon="book-marked" size="sm" variant="outline" forceSize="xl" />
						{showName && (
							<span className="text-[10px] text-muted-foreground">sm + xl</span>
						)}
					</Stack>
					<Stack vertical>
						<IconButton icon="book-marked" size="lg" variant="outline" forceSize="xs" />
						{showName && (
							<span className="text-[10px] text-muted-foreground">lg + xs</span>
						)}
					</Stack>
				</Stack>
			</section>
			<section>
				<h3 className="my-1 text-sm font-medium text-foreground">Hrefs + rounded</h3>
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
					<IconButton icon="eye" variant="default" rounded href="/" />
				</Stack>
			</section>
		</Stack>
	)
}
