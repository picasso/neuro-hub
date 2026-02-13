'use client'

import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Link from '@mui/material/Link'
import Stack from '@mui/material/Stack'
import { useMemo, useState } from 'react'
import type { PublicFreelancerProfile } from '@/lib/db/queries/freelancers'
import { TS } from '@/components/ui/text-styled'

function levelLabel(level: string | null) {
	switch (level) {
		case 'beginner':
			return 'Beginner'
		case 'intermediate':
			return 'Intermediate'
		case 'advanced':
			return 'Advanced'
		case 'expert':
			return 'Expert'
		default:
			return '—'
	}
}

function isImage(mediaType: string | null, url: string) {
	if (mediaType?.startsWith('image/')) return true
	return /\.(png|jpe?g|gif|webp)$/i.test(url)
}

function isVideo(mediaType: string | null, url: string) {
	if (mediaType?.startsWith('video/')) return true
	return /\.(mp4|webm)$/i.test(url)
}

function isAudio(mediaType: string | null, url: string) {
	if (mediaType?.startsWith('audio/')) return true
	return /\.(mp3|wav|webm)$/i.test(url)
}

function isPdf(mediaType: string | null, url: string) {
	if (mediaType === 'application/pdf') return true
	return /\.pdf$/i.test(url)
}

export function PublicFreelancerProfileView({ profile }: { profile: PublicFreelancerProfile }) {
	const [openId, setOpenId] = useState<string | null>(null)

	const openItem = useMemo(
		() => (openId ? (profile.portfolio.find((p) => p.id === openId) ?? null) : null),
		[openId, profile.portfolio],
	)

	return (
		<Box>
			<Box sx={{ mb: 4 }}>
				<TS variant="h6" gutterBottom content="О себе" />
				<TS
					variant="body2"
					color="text.secondary"
					content={profile.userProfile?.bio || 'Пользователь пока не добавил описание.'}
				/>
			</Box>

			<Box sx={{ mb: 4 }}>
				<TS variant="h6" gutterBottom content="Навыки" />
				{profile.skills.length === 0 ? (
					<TS variant="body2" color="text.secondary" content="Навыки не указаны." />
				) : (
					<Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
						{profile.skills.map((s) => (
							<Chip
								key={s.skillId}
								label={`${s.skill.name} · ${levelLabel(s.proficiencyLevel)}`}
								variant="outlined"
							/>
						))}
					</Stack>
				)}
			</Box>

			<Box sx={{ mb: 4 }}>
				<TS variant="h6" gutterBottom content="Портфолио" />
				{profile.portfolio.length === 0 ? (
					<TS variant="body2" color="text.secondary" content="Портфолио пока пустое." />
				) : (
					<Box
						sx={{
							display: 'grid',
							gap: 2,
							gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
						}}
					>
						{profile.portfolio.map((p) => (
							<Box
								key={p.id}
								onClick={() => setOpenId(p.id)}
								role="button"
								tabIndex={0}
								sx={{
									p: 2,
									borderRadius: 2,
									border: '1px solid',
									borderColor: 'divider',
									cursor: 'pointer',
									'&:hover': { borderColor: 'text.primary' },
								}}
							>
								<TS variant="subtitle1" gutterBottom content={p.title} />
								<TS
									variant="body2"
									color="text.secondary"
									content={p.description || 'Без описания'}
									sx={{ mb: 1 }}
								/>
								{isImage(p.mediaType, p.mediaUrl) ? (
									<Box
										component="img"
										src={p.mediaUrl}
										alt={p.title}
										sx={{
											width: 1,
											height: 220,
											objectFit: 'cover',
											borderRadius: 1.5,
											bgcolor: 'action.hover',
										}}
									/>
								) : (
									<TS
										variant="caption"
										color="text.secondary"
										content={`Медиа: ${p.mediaType || 'unknown'}`}
									/>
								)}
							</Box>
						))}
					</Box>
				)}
			</Box>

			<Box sx={{ mb: 4 }}>
				<TS variant="h6" gutterBottom content="Отзывы" />
				<TS
					variant="body2"
					color="text.secondary"
					content="Раздел отзывов будет добавлен позже (этапы 4–5)."
				/>
			</Box>

			<Box sx={{ mb: 2 }}>
				<TS variant="h6" gutterBottom content="Статистика" />
				<TS
					variant="body2"
					color="text.secondary"
					content="Статистика будет рассчитана позже (нужны проекты/заказы)."
				/>
			</Box>

			<Dialog open={!!openItem} onClose={() => setOpenId(null)} maxWidth="md" fullWidth>
				{openItem ? (
					<>
						<DialogTitle>{openItem.title}</DialogTitle>
						<DialogContent>
							{openItem.description ? (
								<TS
									variant="body2"
									color="text.secondary"
									content={openItem.description}
									sx={{ mb: 2 }}
								/>
							) : null}

							{isImage(openItem.mediaType, openItem.mediaUrl) ? (
								<Box
									component="img"
									src={openItem.mediaUrl}
									alt={openItem.title}
									sx={{ width: 1, borderRadius: 2 }}
								/>
							) : isVideo(openItem.mediaType, openItem.mediaUrl) ? (
								<Box
									component="video"
									controls
									src={openItem.mediaUrl}
									sx={{ width: 1, borderRadius: 2 }}
								/>
							) : isAudio(openItem.mediaType, openItem.mediaUrl) ? (
								<Box
									component="audio"
									controls
									src={openItem.mediaUrl}
									sx={{ width: 1 }}
								/>
							) : isPdf(openItem.mediaType, openItem.mediaUrl) ? (
								<Link
									href={openItem.mediaUrl}
									target="_blank"
									rel="noreferrer"
									underline="hover"
								>
									Открыть PDF
								</Link>
							) : (
								<Link
									href={openItem.mediaUrl}
									target="_blank"
									rel="noreferrer"
									underline="hover"
								>
									Открыть медиа
								</Link>
							)}
						</DialogContent>
					</>
				) : null}
			</Dialog>
		</Box>
	)
}
