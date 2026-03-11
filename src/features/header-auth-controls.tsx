'use client'

import { useRouter } from 'next/navigation'
import type { ReactNode } from 'react'
import { signOut } from '@/lib/auth/client'
import { Avatar, Button, Stack } from '@/ui'

type HeaderAuthControlsProps = {
	email: string
	name?: string | null
	variant?: 'marketing' | 'account'
	slot?: ReactNode
}

export function HeaderAuthControls({ email, name, slot }: HeaderAuthControlsProps) {
	const router = useRouter()
	const displayName = name?.trim() || email

	const onSignOut = async () => {
		await signOut({
			fetchOptions: {
				onSuccess: () => {
					router.push('/')
				},
			},
		})
	}

	return (
		<Stack>
			<Avatar name={displayName} size="lg" bordered />
			{slot}
			<Button variant="outline" size="sm" label="Выйти" onClick={onSignOut} />
		</Stack>
	)
}
