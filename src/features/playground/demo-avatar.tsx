'use client'

import { useEffect, useState } from 'react'
import { DemoRoot, DemoSection } from './components-utils'
import { type AvatarDemoState } from './demo-avatar-settings'
import { useSettings } from './settings-store'
import { Avatar, Stack } from '@/ui'

const sampleImage = 'https://github.com/github.png'
const userAvatar = 'https://avatars.githubusercontent.com/u/399395'
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
						src={withImage ? userAvatar : undefined}
						alt={withImage ? name : undefined}
						badge={resolvedBadge}
						bordered={bordered}
					/>
				</Stack>
			</DemoSection>
			<DemoSection title="Sizes" asBadge="user" separator>
				<Stack gap={2} wrap align="center">
					{(['sm', 'md', 'lg'] as const).map((size) => (
						<Avatar key={size} name={names[0]!} size={size} bordered={bordered} />
					))}
				</Stack>
			</DemoSection>
			<DemoSection title="Initials (different names)" asBadge="user" separator>
				<Stack gap={2} wrap align="center">
					{names.map((name) => (
						<Avatar key={name} name={name} size="md" bordered={bordered} />
					))}
				</Stack>
			</DemoSection>
			<DemoSection title="With image" asBadge="user" separator>
				<Stack gap={2} wrap align="center">
					<Avatar
						name="GitHub"
						size="md"
						src={sampleImage}
						alt="GitHub"
						bordered={bordered}
					/>
					<Avatar
						name="Fallback"
						size="lg"
						src={userAvatar}
						alt="GitHub"
						bordered={bordered}
					/>
				</Stack>
			</DemoSection>
			<DemoSection title="Badges" asBadge="user" separator>
				<Stack gap={2} wrap align="center">
					{(['error', 'success', 'warning', 'info'] as const).map((badge) => (
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
