'use client'

import AppBar from '@mui/material/AppBar'
import Container from '@mui/material/Container'
import Link from '@mui/material/Link'
import Stack from '@mui/material/Stack'
import Toolbar from '@mui/material/Toolbar'
import { useRouter } from 'next/navigation'
import { Button } from './button'
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
					<Link href="/" underline="none" color="inherit" sx={{ flexGrow: 1 }}>
						<TS
							variant="h6"
							content="NeuroGig"
							sx={{
								fontWeight: 700,
							}}
						/>
					</Link>

					<Stack direction="row" spacing={2} alignItems="center">
						<FontSwitcher />
						<Link
							href="/projects"
							underline="hover"
							color="inherit"
							sx={{ display: 'inline-flex', alignItems: 'center' }}
						>
							Проекты
						</Link>
						<Link
							href="/freelancers"
							underline="hover"
							color="inherit"
							sx={{ display: 'inline-flex', alignItems: 'center' }}
						>
							Фрилансеры
						</Link>
						<Link
							href="/api/docs"
							underline="hover"
							color="inherit"
							sx={{ display: 'inline-flex', alignItems: 'center' }}
						>
							API
						</Link>
						{process.env.NODE_ENV === 'development' && (
							<Link
								href="/playground"
								underline="hover"
								color="inherit"
								sx={{ display: 'inline-flex', alignItems: 'center' }}
							>
								Playground
							</Link>
						)}
						{!isPending && !isAuthed && (
							<>
								<Link
									href="/login"
									underline="hover"
									color="inherit"
									sx={{ display: 'inline-flex', alignItems: 'center' }}
								>
									Войти
								</Link>
								<Link
									href="/signup"
									underline="hover"
									color="inherit"
									sx={{ display: 'inline-flex', alignItems: 'center' }}
								>
									Регистрация
								</Link>
							</>
						)}

						{!isPending && isAuthed && (
							<>
								<Link
									href="/dashboard"
									underline="hover"
									color="inherit"
									sx={{ display: 'inline-flex', alignItems: 'center' }}
								>
									Профиль
								</Link>
								<Button
									variant="outlined"
									size="large"
									thin
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
									sx={{
										alignSelf: 'center',
										fontSize: 'inherit',
										lineHeight: 'inherit',
									}}
								/>
							</>
						)}
					</Stack>
				</Toolbar>
			</Container>
		</AppBar>
	)
}
