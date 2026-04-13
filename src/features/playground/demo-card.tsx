'use client'

import { map } from 'lodash'
import { DemoRoot, DemoSection } from './components-utils'
import { type CardDemoState } from './demo-card-settings'
import { imageUrls, text } from './mock'
import { useSettings } from './settings-store'
import { Card, type CardProps, Stack } from '@/ui'

export function DemoCard() {
	const settings = useSettings<CardDemoState>()
	const {
		size,
		maxW,
		stub: imageStub,
		footer,
		flush,
		hoverable,
		fullWidth,
		compact,
		content,
		title,
		description,
		button,
		badge,
		badgeProps,
		buttonProps,
		image,
		customClassName,
		titleOver,
		descOver,
	} = settings

	const isStub = imageStub !== 'null'
	return (
		<DemoRoot>
			<DemoSection
				title="Interactive"
				desc="Обёртка `?Card` на базе **shadcn** —> варианты, размеры, badge, action"
			>
				<Card
					size={size}
					maxW={maxW}
					flush={flush}
					fullWidth={fullWidth}
					compact={compact}
					hoverable={hoverable}
					title={
						title
							? isStub
								? 'Миграция inference-пайплайна на GPU-кластер с SLA'
								: text.title.auth
							: undefined
					}
					description={description ? text.desc.auth : undefined}
					badge={badge ? (badgeProps ? 'Featured' : 'updated') : undefined}
					button={button ? 'Action' : undefined}
					badgeProps={badgeProps ? { icon: 'star', lowercased: false } : undefined}
					buttonProps={
						buttonProps
							? { variant: 'outline', leftIcon: 'brain-circuit', fullWidth: false }
							: undefined
					}
					image={imageStub === 'null' ? (image ? imageUrls.card : undefined) : imageStub}
					imageAspect={'3/2'}
					titleOver={titleOver}
					descriptionOver={descOver}
					footer={footer ? 'Это скорее про ширину контейнера в layout API' : undefined}
					headerClassName={customClassName ? 'bg-primary text-white' : undefined}
					footerClassName={customClassName ? 'bg-primary text-white' : undefined}
					contentClassName={customClassName ? 'bg-primary text-white' : undefined}
				>
					{content ? (
						<>
							{text.lorem.short}
							The card component supports a size prop that can be set to "sm" for a
							more compact appearance.
						</>
					) : undefined}
				</Card>
			</DemoSection>
			{map(sections, (section) => (
				<DemoSection key={section.title} title={section.title} asBadge="circle-check">
					<Stack gap={4} align="start" wrap>
						{map(section.demos, (demo, index) => (
							<Card
								size="sm"
								key={index}
								maxW="xs"
								title={demo.label}
								titleOver
								description={demo.desc}
								imageAspect={demo.imageAspect}
								image={demo.image}
								badge={demo.badge}
								badgeProps={demo.badgeProps}
								className="mx-0"
								hoverable={hoverable}
								compact={compact}
							/>
						))}
					</Stack>
				</DemoSection>
			))}
		</DemoRoot>
	)
}

const desc = text.lorem.short

type DemoConfig = {
	label: string
	buttonColor?: string
	maxW?: CardProps['maxW']
	desc?: string
	imageAspect?: CardProps['imageAspect']
	image?: CardProps['image']
	badge?: CardProps['badge']
	badgeProps?: CardProps['badgeProps']
}

type DemoSection = {
	title: string
	demos: DemoConfig[]
}

const sections: DemoSection[] = [
	{
		title: 'Image Aspect',
		demos: [
			{
				label: '3/2',
				image: imageUrls.card,
				imageAspect: '3/2',
				desc,
			},
			{
				label: '4/3',
				image: imageUrls.card,
				imageAspect: '4/3',
				desc,
			},
			{
				label: '5/4',
				image: imageUrls.card,
				imageAspect: '5/4',
				desc,
			},
			{
				label: 'Video',
				image: imageUrls.card,
				imageAspect: 'video',
				desc,
			},
			{
				label: 'Square',
				image: imageUrls.card,
				imageAspect: 'square',
				desc,
			},
			{
				label: '9/16',
				image: imageUrls.card,
				imageAspect: '9/16',
				desc,
			},
		],
	},
	{
		title: 'Placeholder',
		demos: [
			{
				label: 'Portfolio',
				image: 'portfolio',
				// imageAspect: 'video',
				desc,
			},
			{
				label: 'Person',
				image: 'person',
				imageAspect: '4/3',
				desc,
			},
			{
				label: 'Project',
				image: 'project',
				imageAspect: '5/4',
				desc,
			},
			{
				label: 'Request',
				image: 'request',
				// imageAspect: '2/1',
				desc,
			},
		],
	},
]
