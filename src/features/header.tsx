'use client'

import { useRouter } from 'next/navigation'
import { signOut, useSession } from '@/lib/auth/client'
import { Button, Link, Stack, TS } from '@/ui'

export function Header() {
	const router = useRouter()
	const { data: session, isPending } = useSession()

	const isAuthed = !!session?.user?.id

	return (
		<header className="border-b border-primary bg-background">
			<div className="container max-w-5xl mx-auto px-4">
				<div className="flex h-16 items-center">
					<Link href="/" className="grow">
						<TS variant="h5" strong content="NeuroGig" />
					</Link>

					<Stack gap={4} align="center">
						<Link href="/projects">Проекты</Link>
						<Link href="/freelancers">Фрилансеры</Link>
						<Link href="/api/docs">API</Link>
						{process.env.NODE_ENV === 'development' && (
							<Link href="/playground">Playground</Link>
						)}
						{!isPending && !isAuthed && (
							<>
								<Link href="/login">Войти</Link>
								<Link href="/signup">Регистрация</Link>
							</>
						)}

						{!isPending && isAuthed && (
							<>
								<Link href="/dashboard">Профиль</Link>
								<Button
									variant="outline"
									size="lg"
									bold
									onClick={async () => {
										await signOut({
											fetchOptions: {
												onSuccess: () => {
													router.push('/')
												},
											},
										})
									}}
									label="Выйти"
									// TODO: check after migration
									className="self-center text-inherit leading-[inherit]"
								/>
							</>
						)}
					</Stack>
				</div>
			</div>
		</header>
	)
}
