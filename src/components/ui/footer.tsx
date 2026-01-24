'use client'

import EmailIcon from '@mui/icons-material/Email'
import GitHubIcon from '@mui/icons-material/GitHub'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import TelegramIcon from '@mui/icons-material/Telegram'
import XIcon from '@mui/icons-material/X'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import { contactContent } from '@/config/mocks'

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

				<Box
					sx={{
						mt: 4,
						pt: 3,
						borderTop: 1,
						borderColor: 'divider',
						display: 'flex',
						flexDirection: { xs: 'column', sm: 'row' },
						alignItems: 'center',
						justifyContent: 'space-between',
						gap: 2,
					}}
				>
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
						<EmailIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
						<Link
							href={`mailto:${contactContent.email}`}
							color="text.secondary"
							underline="hover"
							sx={{ typography: 'body2' }}
						>
							{contactContent.email}
						</Link>
					</Box>

					<Box sx={{ display: 'flex', gap: 1 }}>
						<IconButton
							component="a"
							href={contactContent.social.github}
							target="_blank"
							rel="noopener noreferrer"
							size="small"
							sx={{ color: 'text.secondary' }}
						>
							<GitHubIcon />
						</IconButton>
						<IconButton
							component="a"
							href={contactContent.social.twitter}
							target="_blank"
							rel="noopener noreferrer"
							size="small"
							sx={{ color: 'text.secondary' }}
						>
							<XIcon />
						</IconButton>
						<IconButton
							component="a"
							href={contactContent.social.linkedin}
							target="_blank"
							rel="noopener noreferrer"
							size="small"
							sx={{ color: 'text.secondary' }}
						>
							<LinkedInIcon />
						</IconButton>
						<IconButton
							component="a"
							href={contactContent.social.telegram}
							target="_blank"
							rel="noopener noreferrer"
							size="small"
							sx={{ color: 'text.secondary' }}
						>
							<TelegramIcon />
						</IconButton>
					</Box>
				</Box>

				<Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
					<Typography variant="body2" color="text.secondary" align="center">
						© {new Date().getFullYear()} NeuroHub. Все права защищены.
					</Typography>
				</Box>
			</Container>
		</Box>
	)
}
