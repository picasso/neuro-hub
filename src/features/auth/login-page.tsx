'use client'
import { useEffect } from 'react'
import { LoginModal } from './login-modal'
import { createModal, registerModal } from '@/modals'
import { Button, PageSuspense } from '@/ui'

export function LoginPage() {
	return (
		<PageSuspense preset="form">
			<LoginForm />
		</PageSuspense>
	)
}

function LoginForm() {
	useEffect(() => {
		loginModal()
	}, [])
	return null
}

const loginModalId = 'login-modal'
registerModal(loginModalId, null, LoginModal)

export const loginModal = createModal(loginModalId, null, true)

export function LoginButton() {
	return (
		<Button variant="ghost" size="sm" label="Войти" onClick={async () => await loginModal()} />
	)
}
