'use client'

import { useUnit } from 'effector-react'
import { useRouter } from 'next/navigation'
import { useState, type ReactNode } from 'react'
import type { AccountSnapshot, AccountViewer } from '@/lib/account'
import { createAlert } from '@/alerts'
import { signOut } from '@/lib/auth/client'
import { $authHeaderState, clearChatRealtimeFx } from '@/stores'
import { Avatar, CommandMenu, Stack, type CommandOptionGroup } from '@/ui'
import { cn } from '@/utils'

type HeaderAuthProps = {
	viewer: AccountViewer
	snapshot: AccountSnapshot
	variant?: 'marketing' | 'account'
	slot?: ReactNode
}

export function HeaderAuth({ viewer: extViewer, snapshot: extSnapshot, slot }: HeaderAuthProps) {
	const authHeaderState = useUnit($authHeaderState)
	const router = useRouter()
	const [isSigningOut, setIsSigningOut] = useState(false)

	const onSignOut = async () => {
		if (isSigningOut) return
		let signedOut = false
		setIsSigningOut(true)
		try {
			await signOut({
				fetchOptions: {
					onSuccess: () => {
						signedOut = true
						void clearChatRealtimeFx()
						router.replace('/')
						router.refresh()
					},
				},
			})
		} catch {
			createAlert({
				severity: 'error',
				title: 'Ошибка авторизации',
				message: 'Не удалось завершить выход из аккаунта. Попробуйте еще раз.',
			})
		} finally {
			if (!signedOut) {
				setIsSigningOut(false)
			}
		}
	}

	const { viewer, snapshot } = authHeaderState ?? { viewer: extViewer, snapshot: extSnapshot }
	const email = viewer.email
	const avatarUrl = viewer.avatarUrl
	const displayName = viewer.displayName?.trim() || email
	const unreadMessages = snapshot.messages ?? 0
	const isFreelancer = snapshot.role === 'freelancer'

	return (
		<Stack>
			{slot}
			<CommandMenu
				flush
				title={displayName}
				desc={email}
				rightIcon={isFreelancer ? 'brain-circuit' : 'briefcase-business'}
				iconOptions={{
					wrapper: true,
					color: 'current',
					tw: cn(
						'rounded-full p-2',
						isFreelancer && 'bg-blue-200/60 text-blue-700/50',
						!isFreelancer && 'bg-amber-200/70 text-amber-700/60',
					),
					size: 'md',
				}}
				align="end"
				groups={generateGroups(snapshot, onSignOut, isSigningOut)}
				popoverClassName="w-auto min-w-65"
			>
				<Avatar
					name={displayName}
					src={avatarUrl}
					badge={unreadMessages > 0 ? 'success' : undefined}
					color="auto"
					size="lg"
					bordered
				/>
			</CommandMenu>
		</Stack>
	)
}

function generateGroups(
	snapshot: AccountSnapshot,
	onSignOut: () => void,
	isSigningOut: boolean,
): CommandOptionGroup[] {
	const { role, projects, applications, works, messages } = snapshot
	const accountItems: CommandOptionGroup['items'] = [
		{
			value: 'dashboard',
			label: 'Мой аккаунт',
			icon: 'layout-dashboard',
			href: '/account/dashboard',
		},
		{
			value: 'messages',
			label: 'Сообщения',
			icon: 'messages-square',
			badge: messages,
			badgeProps: { variant: 'primary', color: 'success' },
			href: '/account/chat',
		},
	]

	if (role === 'client') {
		accountItems.push(
			{
				value: 'applications',
				label: 'Заявки',
				icon: 'briefcase-business',
				badge: applications,
				href: '/account/projects/applications',
			},
			{
				value: 'projects',
				label: 'Проекты',
				icon: 'folder-kanban',
				badge: projects,
				href: '/account/projects',
			},
		)
	} else {
		accountItems.push(
			{
				value: 'applications',
				label: 'Заявки',
				icon: 'briefcase-business',
				badge: applications,
				href: '/account/applications',
			},
			{
				value: 'works',
				label: 'Работы',
				icon: 'media-image',
				badge: works,
				href: '/account/portfolio',
			},
		)
	}

	return [
		{
			label: 'Профиль',
			separator: true,
			items: accountItems,
		},
		{
			label: '',
			items: [
				{
					value: 'logout',
					label: 'Выйти',
					icon: isSigningOut ? 'spinner' : 'log-out',
					iconOptions: { spinning: isSigningOut },
					disabled: isSigningOut,
					onSelect: onSignOut,
					closable: false,
				},
			],
		},
	]
}
