'use client'

import { map } from 'lodash'
import { useEffect, useState } from 'react'
import { DemoRoot, DemoSection } from './components-utils'
import { type AvatarDemoState } from './demo-avatar-settings'
import { imageUrls } from './mock'
import { useSettings } from './settings-store'
import { Avatar, Stack } from '@/ui'

const names = ['Alice Smith', 'Samantha', 'Марина Петрова', 'X']

export function DemoAvatar() {
	const settings = useSettings<AvatarDemoState>()
	const [key, forceKey] = useState(0)
	const { size, name, withImage, badge, color, bordered } = settings
	const resolvedBadge = badge === 'none' ? undefined : badge

	// NOTE: force re-render when `withImage` changes
	// I don't know why, but `Avatar` component doesn't re-render when `withImage` changes
	useEffect(() => {
		forceKey((key) => key + 1)
	}, [withImage])

	return (
		<DemoRoot>
			<DemoSection
				title="Interactive"
				desc="Обёртка `?Avatar` на базе **shadcn** —> initials, image, badge"
				separator
			>
				<Stack gap={2} wrap align="center">
					<Avatar
						key={`avatar-${key}`}
						name={name ?? 'Unknown'}
						size={size}
						color={color}
						src={withImage ? imageUrls.avatar : undefined}
						alt={withImage ? name : undefined}
						badge={resolvedBadge}
						bordered={bordered}
					/>
				</Stack>
			</DemoSection>
			<DemoSection title="Sizes" asBadge="user" separator>
				<Stack gap={2} wrap align="center">
					{map(['sm', 'md', 'lg'] as const, (size) => (
						<Avatar key={size} name={names[0]!} size={size} bordered={bordered} />
					))}
				</Stack>
			</DemoSection>
			<DemoSection title="Initials (different names)" asBadge="user" separator>
				<Stack gap={2} wrap align="center">
					{map(names, (name) => (
						<Avatar key={name} name={name} size="md" bordered={bordered} />
					))}
				</Stack>
			</DemoSection>
			<DemoSection title="With image" asBadge="user" separator>
				<Stack gap={2} wrap align="center">
					<Avatar
						name="GitHub"
						size="md"
						src={imageUrls.github}
						alt="GitHub"
						bordered={bordered}
					/>
					<Avatar
						name="Fallback"
						size="lg"
						src={imageUrls.avatar}
						alt="GitHub"
						bordered={bordered}
					/>
				</Stack>
			</DemoSection>
			<DemoSection title="Badges" asBadge="user" separator>
				<Stack gap={2} wrap align="center">
					{map(['error', 'success', 'warning', 'info'] as const, (badge) => (
						<Avatar key={badge} name="DR" size="md" badge={badge} />
					))}
				</Stack>
			</DemoSection>
			<DemoSection title="Custom color" asBadge="user">
				<Stack gap={2} wrap align="center">
					<Avatar name="DR" size="md" color="#5a4fcf" />
					<Avatar name="DR" size="md" color="#db2777" />
					<Avatar name="DR" size="md" color="auto" />
				</Stack>
			</DemoSection>
		</DemoRoot>
	)
}
