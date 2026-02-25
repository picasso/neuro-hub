'use client'

import AppBar from '@mui/material/AppBar'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import Toolbar from '@mui/material/Toolbar'
import { useRouter } from 'next/navigation'
import { Button } from './button'
import { Link } from './link'
import { TS } from './text-styled'
import { FontSwitcher } from '@/components/providers'
import { signOut, useSession } from '@/lib/auth/client'

export function Header() {
	const router = useRouter()
	const { data: session, isPending } = useSession()

	const isAuthed = !!session?.user?.id

	return (
		<AppBar
			position="static"
			color="default"
			elevation={0}
			sx={{ borderBottom: `1px solid`, borderColor: 'primary.main' }}
		>
			<Container maxWidth="lg">
				<Toolbar disableGutters>
					<Link href="/" className="grow">
						<TS variant="h5" strong content="NeuroGig" />
					</Link>

					<Stack direction="row" spacing={2} alignItems="center">
						<FontSwitcher />
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
				</Toolbar>
			</Container>
		</AppBar>
	)
}
