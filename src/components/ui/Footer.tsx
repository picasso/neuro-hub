'use client'

import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'

export function Footer() {
	return (
		<Box
			component="footer"
			sx={{
				py: 6,
				px: 2,
				mt: 'auto',
				backgroundColor: 'grey.100',
			}}
		>
			<Container maxWidth="lg">
				<Grid container spacing={4}>
					<Grid size={{ xs: 12, sm: 4 }}>
						<Typography variant="h6" gutterBottom>
							NeuroHub
						</Typography>
						<Typography variant="body2" color="text.secondary">
							Платформа для фриланса в сфере генеративного ИИ
						</Typography>
					</Grid>

					<Grid size={{ xs: 12, sm: 4 }}>
						<Typography variant="h6" gutterBottom>
							Для фрилансеров
						</Typography>
						<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
							<Link href="/projects" color="text.secondary" underline="hover">
								Найти проекты
							</Link>
							<Link href="/how-it-works" color="text.secondary" underline="hover">
								Как это работает
							</Link>
						</Box>
					</Grid>

					<Grid size={{ xs: 12, sm: 4 }}>
						<Typography variant="h6" gutterBottom>
							Для заказчиков
						</Typography>
						<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
							<Link href="/freelancers" color="text.secondary" underline="hover">
								Найти фрилансера
							</Link>
							<Link href="/post-project" color="text.secondary" underline="hover">
								Разместить проект
							</Link>
						</Box>
					</Grid>
				</Grid>

				<Box sx={{ mt: 4, pt: 3, borderTop: 1, borderColor: 'divider' }}>
					<Typography variant="body2" color="text.secondary" align="center">
						© {new Date().getFullYear()} NeuroHub. Все права защищены.
					</Typography>
				</Box>
			</Container>
		</Box>
	)
}
