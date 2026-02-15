'use client'

import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Link from '@mui/material/Link'
import Stack from '@mui/material/Stack'
import packageJson from '../../../package.json'
import { Icon } from './icon'
import { TS } from './text-styled'
import { contactContent } from '@/config/mocks'

export function Footer() {
	return (
		<Box
			component="footer"
			sx={{
				py: 6,
				px: 2,
				mt: 'auto',
				backgroundColor: 'primary.main',
				color: 'contrast.main',
			}}
		>
			<Container maxWidth="lg">
				<Grid container spacing={4}>
					<Grid size={{ xs: 12, sm: 4 }}>
						<Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
							<TS variant="h6">NeuroGig</TS>
							<Chip
								label={`${packageJson.version}`}
								size="small"
								// color="contrast"
								sx={{
									color: 'contrast.main',
									opacity: 0.9,
									borderColor: 'contrast.main',
								}}
							/>
						</Stack>
						<TS variant="body2" color="contrast.light">
							Платформа для фриланса в сфере генеративного ИИ
						</TS>
					</Grid>

					<Grid size={{ xs: 12, sm: 4 }}>
						<TS variant="h6" gutterBottom>
							Для фрилансеров
						</TS>
						<Stack spacing={1}>
							<Link href="/projects" color="contrast.light" underline="hover">
								Найти проекты
							</Link>
							<Link href="/how-it-works" color="contrast.light" underline="hover">
								Как это работает
							</Link>
						</Stack>
					</Grid>

					<Grid size={{ xs: 12, sm: 4 }}>
						<TS variant="h6" gutterBottom>
							Для заказчиков
						</TS>
						<Stack spacing={1}>
							<Link href="/freelancers" color="contrast.light" underline="hover">
								Найти фрилансера
							</Link>
							<Link href="/post-project" color="contrast.light" underline="hover">
								Разместить проект
							</Link>
						</Stack>
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
					<Stack direction="row" alignItems="center" spacing={1}>
						<Icon name="email" sx={{ fontSize: 20, color: 'contrast.light' }} />
						<Link
							href={`mailto:${contactContent.email}`}
							color="contrast.light"
							underline="hover"
							sx={{ typography: 'body2' }}
						>
							{contactContent.email}
						</Link>
					</Stack>

					<Stack direction="row" spacing={1}>
						<IconButton
							component="a"
							href={contactContent.social.github}
							target="_blank"
							rel="noopener noreferrer"
							size="small"
						>
							<Icon name="git-hub" sx={{ color: 'contrast.light' }} />
						</IconButton>
						<IconButton
							component="a"
							href={contactContent.social.twitter}
							target="_blank"
							rel="noopener noreferrer"
							size="small"
						>
							<Icon name="x" sx={{ color: 'contrast.light' }} />
						</IconButton>
						<IconButton
							component="a"
							href={contactContent.social.linkedin}
							target="_blank"
							rel="noopener noreferrer"
							size="small"
						>
							<Icon name="linked-in" sx={{ color: 'contrast.light' }} />
						</IconButton>
						<IconButton
							component="a"
							href={contactContent.social.telegram}
							target="_blank"
							rel="noopener noreferrer"
							size="small"
						>
							<Icon name="telegram" sx={{ color: 'contrast.light' }} />
						</IconButton>
					</Stack>
				</Box>

				<Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
					<TS variant="body2" color="contrast.light" align="center">
						© {new Date().getFullYear()} NeuroGig. Все права защищены.
					</TS>
				</Box>
			</Container>
		</Box>
	)
}
