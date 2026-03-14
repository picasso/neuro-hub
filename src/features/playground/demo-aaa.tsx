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
		headerClassName,
		footerClassName,
		contentClassName,
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
					badge={badge ? 'Featured' : undefined}
					button={button ? 'Action' : undefined}
					badgeProps={badgeProps ? { icon: 'star', color: 'dimmed' } : undefined}
					buttonProps={
						buttonProps
							? { variant: 'outline', leftIcon: 'brain-circuit', fullWidth: false }
							: undefined
					}
					footer={footer ? 'Это скорее про ширину контейнера в layout API' : undefined}
					headerClassName={headerClassName ? 'bg-primary text-white' : undefined}
					footerClassName={footerClassName ? 'bg-primary text-white' : undefined}
					contentClassName={contentClassName ? 'bg-primary text-white' : undefined}
				>
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos. The
					card component supports a size prop that can be set to "sm" for a more compact
					appearance.
				</Card>
			</DemoSection>
		</DemoRoot>
	)
}
