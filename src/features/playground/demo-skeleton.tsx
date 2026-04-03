'use client'

import { map } from 'lodash'
import { DemoLabel, DemoRoot, DemoSection } from './components-utils'
import { type SkeletonDemoState } from './demo-skeleton-settings'
import { useSettings } from './settings-store'
import { Skeleton, Stack, type SkeletonProps } from '@/ui'

type SkeletonShape = NonNullable<SkeletonProps['shape']>

export function DemoSkeleton() {
	const { shape, maxW, clean, filler, fillerCustom } = useSettings<SkeletonDemoState>()

	return (
		<DemoRoot>
			<DemoSection
				title="Interactive"
				desc="Обёртка `?Skeleton` на базе **shadcn** —> пресеты, ширина, отступы между блоками"
				separator
			>
				<Stack vertical gap={2} align="stretch" className="max-w-2xl">
					<Skeleton
						shape={shape}
						maxW={maxW}
						clean={clean}
						filler={
							fillerCustom
								? 'h-4 w-24 rounded-lg bg-destructive/50 animate-ping'
								: filler
									? 'h-8'
									: undefined
						}
					/>
				</Stack>
			</DemoSection>
			<DemoSection
				title="Shape gallery"
				desc="Все встроенные композиции кроме **none** (одиночный блок — ниже)."
				separator
			>
				<Stack gap={6} align="start" wrap>
					{map(shapes, (label, key) => (
						<Stack key={key} vertical align="start" className="w-full max-w-60">
							<DemoLabel content={label} nowrap />
							<Skeleton shape={key as SkeletonShape} clean={clean} />
						</Stack>
					))}
				</Stack>
			</DemoSection>
			<DemoSection
				title="Custom (shape none)"
				desc="Использование базового **Skeleton** без пресета."
			>
				<Stack vertical gap={3} align="start">
					<Skeleton className="h-4 w-full max-w-md" />
					<Stack>
						<Skeleton className="size-12 rounded-full" />
						<Skeleton className="h-10 w-48 rounded-md" />
					</Stack>
				</Stack>
			</DemoSection>
		</DemoRoot>
	)
}

const shapes: Record<Exclude<SkeletonShape, 'none'>, string> = {
	text: 'Text lines',
	card: 'Card block',
	avatar: 'Avatar row',
	table: 'Table rows',
	form: 'Form fields',
	chat: 'Chat message',
} as const
