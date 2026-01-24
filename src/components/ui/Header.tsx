'use client'

import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Link from '@mui/material/Link'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'

export function Header() {
	return (
		<AppBar position="static" color="default" elevation={1}>
			<Container maxWidth="lg">
				<Toolbar disableGutters>
					<Link href="/" underline="none" color="inherit" sx={{ flexGrow: 1 }}>
						<Typography
							variant="h6"
							sx={{
								fontWeight: 700,
							}}
						>
							NeuroHub
						</Typography>
					</Link>

					<Box sx={{ display: 'flex', gap: 2 }}>
						<Link href="/projects" underline="hover" color="inherit">
							Проекты
						</Link>
						<Link href="/freelancers" underline="hover" color="inherit">
							Фрилансеры
						</Link>
						<Link href="/api/docs" underline="hover" color="inherit">
							API
						</Link>
						<Link href="/login" underline="hover" color="inherit">
							Войти
						</Link>
						<Link href="/signup" underline="hover" color="inherit">
							Регистрация
						</Link>
					</Box>
				</Toolbar>
			</Container>
		</AppBar>
	)
}
