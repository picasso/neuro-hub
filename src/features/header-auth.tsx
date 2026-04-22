'use client'

import { useUnit } from 'effector-react'
import { useRouter } from 'next/navigation'
import { useState, type ReactNode } from 'react'
import { createAlert } from '@/alerts'
import { signOut } from '@/lib/auth/client'
import {
	$authHeaderUnreadMessages,
	$authHeaderViewer,
	clearAuthHeader,
	clearChatRealtimeFx,
} from '@/stores'
import { Avatar, Button, Stack } from '@/ui'

type HeaderAuthProps = {
	email: string
	name?: string | null
	avatarUrl?: string | null
	unreadMessages?: number | null
	variant?: 'marketing' | 'account'
	slot?: ReactNode
}

export function HeaderAuth({ slot, ...fallback }: HeaderAuthProps) {
	const [authHeaderViewer, authHeaderUnreadMessages] = useUnit([
		$authHeaderViewer,
		$authHeaderUnreadMessages,
	])
	const email = authHeaderViewer?.email ?? fallback.email
	const name = authHeaderViewer?.displayName ?? fallback.name
	const avatarUrl = authHeaderViewer?.avatarUrl ?? fallback.avatarUrl
	const unreadMessages = authHeaderViewer
		? authHeaderUnreadMessages
		: (fallback.unreadMessages ?? 0)

	const router = useRouter()
	const [isSigningOut, setIsSigningOut] = useState(false)
	const displayName = name?.trim() || email

	const onSignOut = async () => {
		if (isSigningOut) return
		let signedOut = false
		setIsSigningOut(true)
		try {
			await signOut({
				fetchOptions: {
					onSuccess: () => {
						signedOut = true
						clearAuthHeader()
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

	return (
		<Stack>
			{slot}
			<Button
				variant="outline"
				size="sm"
				disabled={isSigningOut}
				label="Выйти"
				rightIcon={isSigningOut ? 'spinner' : 'log-out'}
				iconOptions={{ spinning: isSigningOut }}
				onClick={onSignOut}
			/>
			<Avatar
				name={displayName}
				src={avatarUrl}
				badge={unreadMessages > 0 ? 'success' : undefined}
				color="auto"
				size="lg"
				bordered
			/>
		</Stack>
	)
}
