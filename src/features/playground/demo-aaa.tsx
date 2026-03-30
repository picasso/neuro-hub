'use client'

import { DemoRoot, DemoSection } from './components-utils'
import { type AnyDemoState } from './demo-aaa-settings'
import { useSettings } from './settings-store'
import { Card } from '@/ui'

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
		</DemoRoot>
	)
}

const imageUrl =
	'https://bycp5hmwsix5qx2u.public.blob.vercel-storage.com/portfolio/XD5LXKVkaPXvPFDNS0tfwYWPeirXGbT2/fantasy-01-QlbQcYix5SMh60NYLd8fg2BBF1E3Ei.jpg'
