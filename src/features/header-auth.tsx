'use client'

import { useRouter } from 'next/navigation'
import { useState, type ReactNode } from 'react'
import { createAlert } from '@/alerts'
import { signOut } from '@/lib/auth/client'
import { Avatar, Button, Stack } from '@/ui'

type HeaderAuthProps = {
	email: string
	name?: string | null
	variant?: 'marketing' | 'account'
	slot?: ReactNode
}

export function HeaderAuth({ email, name, slot }: HeaderAuthProps) {
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
			<Avatar name={displayName} size="lg" bordered />
		</Stack>
	)
}
