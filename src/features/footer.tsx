'use client'

import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'
import { config, contactContent } from '@/config'
import { Icon } from '@/ui/icon'
import { IconButton } from '@/ui/icon-button'
import { Link } from '@/ui/link'
import { TS } from '@/ui/text-styled'

export function Footer() {
	return (
		<Box
			component="footer"
			sx={{
				py: 6,
				px: 2,
				mt: 'auto',
				background: 'linear-gradient(to bottom, #169e5f, #1dbf73)',
				color: 'contrast.main',
			}}
		>
			<Container maxWidth="lg">
				<Grid container spacing={4}>
					<Grid size={{ xs: 12, sm: 4 }}>
						<Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
							<TS variant="h5">NeuroGig</TS>
							<Chip
								label={`${config.version}`}
								size="small"
								sx={{
									color: 'contrast.main',
									opacity: 0.9,
									borderColor: 'contrast.main',
								}}
							/>
						</Stack>
						<TS variant="subtitle" color="soft">
							Платформа для фриланса в сфере генеративного ИИ
						</TS>
					</Grid>

					<Grid size={{ xs: 12, sm: 4 }}>
						<TS variant="h5" gutterBottom>
							Для фрилансеров
						</TS>
						<Stack spacing={1}>
							<Link href="/projects" color="soft" hover="vivid">
								Найти проекты
							</Link>
							<Link href="/how-it-works" color="soft" hover="vivid">
								Как это работает
							</Link>
						</Stack>
					</Grid>

					<Grid size={{ xs: 12, sm: 4 }}>
						<TS variant="h5" gutterBottom>
							Для заказчиков
						</TS>
						<Stack spacing={1}>
							<Link href="/freelancers" color="soft" hover="vivid">
								Найти фрилансера
							</Link>
							<Link href="/post-project" color="soft" hover="vivid">
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
						borderColor: 'text.pale',
						display: 'flex',
						flexDirection: { xs: 'column', sm: 'row' },
						alignItems: 'center',
						justifyContent: 'space-between',
						gap: 2,
					}}
				>
					<Stack direction="row" alignItems="center" spacing={1}>
						<Icon name="email" size={20} className="text-white/80" />
						<Link
							href={`mailto:${contactContent.email}`}
							color="contrast"
							hover="underline"
							size="sm"
						>
							{contactContent.email}
						</Link>
					</Stack>

					<Stack direction="row" spacing={1}>
						<IconButton
							rounded
							variant="contrast"
							icon="git-hub"
							href={contactContent.social.github}
							target="_blank"
							rel="noopener noreferrer"
							size="icon"
							forceSize="md"
						/>
						<IconButton
							rounded
							variant="contrast"
							icon="x-twitter"
							href={contactContent.social.twitter}
							target="_blank"
							rel="noopener noreferrer"
							size="icon"
							forceSize="md"
						/>
						<IconButton
							rounded
							variant="contrast"
							icon="linked-in"
							href={contactContent.social.twitter}
							target="_blank"
							rel="noopener noreferrer"
							size="icon"
							forceSize="md"
						/>
						<IconButton
							rounded
							variant="contrast"
							icon="telegram"
							href={contactContent.social.telegram}
							target="_blank"
							rel="noopener noreferrer"
							size="icon"
							forceSize="md"
						/>
					</Stack>
				</Box>

				<Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'text.pale' }}>
					<TS variant="caption" color="contrast" className="text-center">
						© {new Date().getFullYear()} NeuroGig. Все права защищены.
					</TS>
				</Box>
			</Container>
		</Box>
	)
}
