'use client'

import { useGate, useUnit } from 'effector-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState, type SyntheticEvent } from 'react'
import type { ModalComponentProps } from '@/modals'
import { defaultToasterOptions } from '@/alerts'
import {
	$credentials,
	LoginGate,
	signInFx,
	toggledRememberMe,
	updatedEmail,
	updatedPassword,
} from '@/stores/auth-login'
import { Button, Checkbox, Dialog, IconButton, Stack, TextField, TS } from '@/ui'

const loginCoverImages = [
	{ src: '/images/00003.jpg', alt: 'AI specialist workspace' },
	{ src: '/images/00053.jpg', alt: 'Creative technology team' },
	{ src: '/images/00092.jpg', alt: 'Futuristic digital interface' },
	{ src: '/images/beach-005.jpg', alt: 'Calm remote work atmosphere' },
] as const
let previousLoginCoverIndex = -1

function getNextLoginCover() {
	if (loginCoverImages.length <= 1) return loginCoverImages[0]

	let nextIndex = previousLoginCoverIndex
	while (nextIndex === previousLoginCoverIndex) {
		nextIndex = Math.floor(Math.random() * loginCoverImages.length)
	}
	previousLoginCoverIndex = nextIndex
	return loginCoverImages[nextIndex] ?? loginCoverImages[0]
}

export function LoginModal({ open, onClose }: ModalComponentProps) {
	const router = useRouter()

	useGate(LoginGate, { callbackURL: '/account/dashboard' })

	const [credentials, isLoading] = useUnit([$credentials, signInFx.pending])
	const [onUpdatedEmail, onUpdatedPassword, onToggleRemember, onSignIn] = useUnit([
		updatedEmail,
		updatedPassword,
		toggledRememberMe,
		signInFx,
	])
	const canSubmit = !!credentials.email && !!credentials.password && !isLoading
	const [coverImage, setCoverImage] = useState(() => getNextLoginCover())
	const [isCoverLoaded, setIsCoverLoaded] = useState(false)
	const [showPassword, setShowPassword] = useState(false)
	const formRef = useRef<HTMLFormElement>(null)

	useEffect(() => {
		if (!open) return
		setCoverImage(getNextLoginCover())
		setIsCoverLoaded(false)
	}, [open])

	const onRoute = (href: '/' | '/signup') => {
		onClose(null)
		router.push(href)
	}

	const onSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
		event.preventDefault()
		try {
			await onSignIn(credentials)
			// NOTE: no need to close modal here, it will be removed by Next router
			// it also gives a better user experience
		} catch {
			onClose(null)
			// handled by signInFx + alerts
		}
	}

	return (
		<Dialog
			open={open}
			onClose={onClose}
			noPadding
			disableEscClose
			closeOnDark
			withToaster
			toasterOptions={defaultToasterOptions}
			onOpenAutoFocus={(ev) => {
				ev.preventDefault()
				requestAnimationFrame(() => {
					setTimeout(() => {
						formRef.current?.focus()
					}, 150)
				})
			}}
			srTitle="Вход в аккаунт"
			className="w-[calc(100vw-2rem)] border-muted-foreground lg:max-w-250 xl:max-w-300"
		>
			<div className="grid min-h-155 bg-background lg:grid-cols-[440px_560px] xl:grid-cols-[500px_700px]">
				<Stack
					vertical
					gap={6}
					align="stretch"
					className="p-5 sm:p-6 md:p-8 lg:px-8 lg:py-7 xl:px-10 xl:py-8"
				>
					<Stack
						justify="space-between"
						gap={4}
						align="stretch"
						className="flex-col sm:flex-row sm:items-start lg:items-center"
					>
						<Stack gap={3} align="center" className="min-w-0 flex-1">
							<IconButton
								icon="brain-circuit"
								variant="default"
								size="md"
								forceSize={20}
								className="rounded-xl"
								onClick={() => onRoute('/')}
							/>
							<Stack vertical gap={0} align="stretch" className="min-w-0">
								<TS
									variant="subtitle"
									strong
									clean
									content="NeuroGig"
									className="text-foreground"
								/>
								<TS
									variant="caption"
									color="secondary"
									clean
									content="Freelance marketplace for AI specialists"
									className="max-w-56 leading-4 sm:max-w-64"
								/>
							</Stack>
						</Stack>
						<Button
							type="button"
							variant="ghost"
							onClick={() => onRoute('/signup')}
							label="Регистрация"
							rightIcon="log-in"
							className="w-full justify-center sm:w-auto sm:shrink-0"
						/>
					</Stack>

					<Stack className="flex-1" justify="center">
						<Stack
							vertical
							gap={6}
							align="stretch"
							className="w-full max-w-none sm:max-w-sm"
						>
							<Stack vertical align="stretch">
								<TS variant="h2" className="text-2xl" content="С возвращением" />
								<TS
									variant="subtitle"
									color="secondary"
									className="leading-6"
									content="Войдите, чтобы управлять профилем, откликами и портфолио в NeuroGig."
								/>
							</Stack>

							<form
								ref={formRef}
								tabIndex={-1}
								className="flex flex-col gap-5"
								onSubmit={onSubmit}
							>
								<TextField
									id="login-modal-email"
									label="Email"
									type="email"
									autoComplete="username"
									placeholder="name@example.com"
									value={credentials.email}
									onChange={(event) => onUpdatedEmail(event.target.value)}
								/>

								<TextField
									id="login-modal-password"
									label="Пароль"
									type={showPassword ? 'text' : 'password'}
									autoComplete="current-password"
									placeholder="Введите пароль"
									helper="Используйте пароль от аккаунта NeuroGig"
									value={credentials.password}
									onChange={(event) => onUpdatedPassword(event.target.value)}
									endIcon={showPassword ? 'eye-off' : 'eye'}
									onEndClick={() => setShowPassword((value) => !value)}
								/>

								<Checkbox
									checked={credentials.rememberMe}
									onCheckedChange={() => onToggleRemember()}
									label="Запомнить меня"
								/>

								<Stack vertical gap={3} align="stretch">
									<Button
										type="submit"
										fullWidth
										size="lg"
										disabled={!canSubmit || isLoading}
										label={isLoading ? 'Авторизация...' : 'Войти'}
									/>
									<Button
										type="button"
										variant="outline"
										fullWidth
										size="lg"
										onClick={() => onRoute('/signup')}
										label="Создать аккаунт"
									/>
								</Stack>
							</form>

							<TS
								variant="caption"
								color="secondary"
								className="text-center leading-5"
								content="Продолжая, вы подтверждаете вход в защищённую зону платформы."
							/>
						</Stack>
					</Stack>
				</Stack>

				<div className="relative hidden bg-muted lg:block">
					<Image
						src={coverImage.src}
						alt={coverImage.alt}
						fill
						priority
						sizes="(max-width: 1024px) 0vw, 700px"
						className={`object-cover transition-opacity duration-500 ${
							isCoverLoaded ? 'opacity-100' : 'opacity-0'
						}`}
						onLoad={() => setIsCoverLoaded(true)}
					/>
					<div className="absolute inset-x-0 bottom-0 h-64 bg-linear-to-t from-black/80 via-black/55 to-transparent" />
					<div className="absolute inset-x-0 bottom-0 p-8 text-white">
						<Stack vertical gap={3} align="stretch" className="max-w-sm">
							<TS
								variant="caption"
								clean
								content="NeuroGig access"
								className="font-medium uppercase tracking-[0.28em] text-white/60"
							/>
							<TS
								variant="h3"
								clean
								content="Войдите и продолжайте строить сильный AI-профиль."
								className="text-white tracking-wide"
							/>
							<TS
								variant="subtitle"
								clean
								content="Управляйте кейсами, демонстрациями и откликами из одного места."
								className="tracking-wide text-white/80"
							/>
						</Stack>
					</div>
				</div>
			</div>
		</Dialog>
	)
}
