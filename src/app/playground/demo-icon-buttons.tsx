'use client'

import { type IconButtonDemoState } from './demo-icon-buttons-settings'
import { useSettings } from './settings-store'
import { Separator } from '@/components/shadcn/separator'
import { IconButton, Stack, TS } from '@/components/ui'
import { cn } from '@/lib/utils'

const icons = ['thumbs-up', 'search', 'trash', 'book-marked', 'eye', 'collections'] as const

export function DemoIconButtons() {
	const settings = useSettings<IconButtonDemoState>()
	const { showName, variant, size, rounded, disabled, spinning, forceSize } = settings

	const resolvedForceSize = forceSize === 'auto' ? undefined : forceSize

	return (
		<Stack vertical gap={6} align="stretch">
			<section>
				<TS variant="h3" content="Interactive" className="my-1 text-sm font-medium" />
				<TS
					variant="caption"
					color="secondary"
					content="Обёртка `IconButton` на базе shadcn `Button` + `Icon`."
					gutterBottom
				/>
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
								<TS
									variant="caption"
									content={icon}
									inline
									className={cn(
										'text-[10px]',
										variant === 'contrast'
											? 'text-white'
											: 'text-muted-foreground',
									)}
								/>
							)}
						</Stack>
					))}
				</Stack>
			</section>

			<Separator />

			<section>
				<TS
					variant="h3"
					content="Variants (+ rounded)"
					className="my-1 text-sm font-medium"
				/>
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
				<TS variant="h3" content="Sizes" className="my-1 text-sm font-medium" />
				<Stack gap={2} wrap align="stretch">
					<Stack vertical>
						<IconButton icon="search" size="icon" variant="outline" />
						{showName && (
							<TS
								variant="caption"
								color="secondary"
								content="icon"
								inline
								className="text-[10px]"
							/>
						)}
					</Stack>
					<Stack vertical>
						<IconButton icon="search" size="sm" variant="outline" />
						{showName && (
							<TS
								variant="caption"
								color="secondary"
								content="sm"
								inline
								className="text-[10px]"
							/>
						)}
					</Stack>
					<Stack vertical>
						<IconButton icon="search" size="md" variant="outline" />
						{showName && (
							<TS
								variant="caption"
								color="secondary"
								content="md"
								inline
								className="text-[10px]"
							/>
						)}
					</Stack>
					<Stack vertical>
						<IconButton icon="search" size="lg" variant="outline" />
						{showName && (
							<TS
								variant="caption"
								color="secondary"
								content="lg"
								inline
								className="text-[10px]"
							/>
						)}
					</Stack>
					<Stack vertical>
						<IconButton icon="search" size="xl" variant="outline" />
						{showName && (
							<TS
								variant="caption"
								color="secondary"
								content="xl"
								inline
								className="text-[10px]"
							/>
						)}
					</Stack>
				</Stack>
			</section>
			<section>
				<TS variant="h3" content="Sizes + forceSize" className="my-1 text-sm font-medium" />
				<TS
					variant="caption"
					color="secondary"
					content="`forceSize` prop влияет на размер иконки и а `size` prop определяет размер кнопки."
					gutterBottom
				/>
				<Stack gap={2} wrap align="stretch">
					<Stack vertical>
						<IconButton
							icon="book-marked"
							size="icon"
							variant="outline"
							forceSize="xs"
						/>
						{showName && (
							<TS
								variant="caption"
								color="secondary"
								content="icon + xs"
								inline
								className="text-[10px]"
							/>
						)}
					</Stack>
					<Stack vertical>
						<IconButton icon="book-marked" size="sm" variant="outline" forceSize="sm" />
						{showName && (
							<TS
								variant="caption"
								color="secondary"
								content="sm + sm"
								inline
								className="text-[10px]"
							/>
						)}
					</Stack>
					<Stack vertical>
						<IconButton icon="book-marked" size="md" variant="outline" forceSize="md" />
						{showName && (
							<TS
								variant="caption"
								color="secondary"
								content="md + md"
								inline
								className="text-[10px]"
							/>
						)}
					</Stack>
					<Stack vertical>
						<IconButton icon="book-marked" size="lg" variant="outline" forceSize="lg" />
						{showName && (
							<TS
								variant="caption"
								color="secondary"
								content="lg + lg"
								inline
								className="text-[10px]"
							/>
						)}
					</Stack>
					<Stack vertical>
						<IconButton icon="book-marked" size="xl" variant="outline" forceSize="xl" />
						{showName && (
							<TS
								variant="caption"
								color="secondary"
								content="xl + xl"
								inline
								className="text-[10px]"
							/>
						)}
					</Stack>

					<Stack vertical>
						<IconButton icon="book-marked" size="xl" variant="outline" forceSize="md" />
						{showName && (
							<TS
								variant="caption"
								color="secondary"
								content="xl + md"
								inline
								className="text-[10px]"
							/>
						)}
					</Stack>
					<Stack vertical>
						<IconButton icon="book-marked" size="sm" variant="outline" forceSize="xl" />
						{showName && (
							<TS
								variant="caption"
								color="secondary"
								content="sm + xl"
								inline
								className="text-[10px]"
							/>
						)}
					</Stack>
					<Stack vertical>
						<IconButton icon="book-marked" size="lg" variant="outline" forceSize="xs" />
						{showName && (
							<TS
								variant="caption"
								color="secondary"
								content="lg + xs"
								inline
								className="text-[10px]"
							/>
						)}
					</Stack>
				</Stack>
			</section>
			<section>
				<TS variant="h3" content="Hrefs + rounded" className="my-1 text-sm font-medium" />
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
			</section>
		</Stack>
	)
}
