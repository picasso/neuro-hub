'use client'

import { map } from 'lodash'
import { DemoRoot, DemoSection } from './components-utils'
import { type AnyDemoState } from './demo-aaa-settings'
import { useSettings } from './settings-store'
import { Card, type CardProps, Stack } from '@/ui'

export function DemoAny() {
	const settings = useSettings<AnyDemoState>()
	const {
		size,
		maxW,
		footer,
		flush,
		fullWidth,
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
					title={title ? 'Login to your account' : undefined}
					description={
						description ? 'Enter your email below to login to your account' : undefined
					}
					badge={badge ? (badgeProps ? 'Featured' : 'updated') : undefined}
					button={button ? 'Action' : undefined}
					badgeProps={badgeProps ? { icon: 'star', lowercased: false } : undefined}
					buttonProps={
						buttonProps
							? { variant: 'outline', leftIcon: 'brain-circuit', fullWidth: false }
							: undefined
					}
					image={image ? imageUrl : undefined}
					imageAspect={'3/2'}
					titleOver={titleOver}
					descriptionOver={descOver}
					footer={footer ? 'Это скорее про ширину контейнера в layout API' : undefined}
					headerClassName={customClassName ? 'bg-primary text-white' : undefined}
					footerClassName={customClassName ? 'bg-primary text-white' : undefined}
					contentClassName={customClassName ? 'bg-primary text-white' : undefined}
				>
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. The
					card component supports a size prop that can be set to "sm" for a more compact
					appearance.
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
							/>
						))}
					</Stack>
				</DemoSection>
			))}
		</DemoRoot>
	)
}

const imageUrl =
	'https://bycp5hmwsix5qx2u.public.blob.vercel-storage.com/portfolio/XD5LXKVkaPXvPFDNS0tfwYWPeirXGbT2/fantasy-01-QlbQcYix5SMh60NYLd8fg2BBF1E3Ei.jpg'

const desc = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.'

type DemoConfig = {
	label: string
	buttonColor?: string
	maxW?: CardProps['maxW']
	desc?: string
	imageAspect?: CardProps['imageAspect']
	image?: CardProps['image']
	badge?: CardProps['badge']
	badgeProps?: CardProps['badgeProps']
	// button?: CardProps['button']
	// buttonProps?: CardProps['buttonProps']
	// footer?: CardProps['footer']
	// footerProps?: CardProps['footerProps']
	// contentClassName?: CardProps['contentClassName']
	// contentProps?: CardProps['contentProps']
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
				image: imageUrl,
				imageAspect: '3/2',
				desc,
			},
			{
				label: '4/3',
				image: imageUrl,
				imageAspect: '4/3',
				desc,
			},
			{
				label: '5/4',
				image: imageUrl,
				imageAspect: '5/4',
				desc,
			},
			{
				label: 'Video',
				image: imageUrl,
				imageAspect: 'video',
				desc,
			},
			{
				label: 'Square',
				image: imageUrl,
				imageAspect: 'square',
				desc,
			},
			{
				label: '9/16',
				image: imageUrl,
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
				imageAspect: 'video',
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
		],
	},
]
