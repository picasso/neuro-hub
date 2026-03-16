'use client'

import { useMemo, useState } from 'react'
import type { PublicFreelancerProfile } from '@/lib/db/queries/freelancers'
import { Badge, Dialog, type IconName, Link, Stack, TS } from '@/ui'

export function PublicFreelancerProfileView({ profile }: { profile: PublicFreelancerProfile }) {
	const [openId, setOpenId] = useState<string | null>(null)

	const openItem = useMemo(
		() => (openId ? (profile.portfolio.find((p) => p.id === openId) ?? null) : null),
		[openId, profile.portfolio],
	)

	return (
		<div>
			<div className="mb-8">
				<TS variant="h5" gutterBottom content="О себе" />
				<TS
					variant="body"
					color="secondary"
					className="text-sm"
					content={profile.userProfile?.bio || 'Пользователь пока не добавил описание.'}
				/>
			</div>

			<div className="mb-8">
				<TS variant="h5" gutterBottom content="Навыки" />
				{profile.skills.length === 0 ? (
					<TS
						variant="body"
						color="secondary"
						className="text-sm"
						content="Навыки не указаны."
					/>
				) : (
					<Stack gap={2} wrap>
						{profile.skills.map((s) => (
							<Badge
								key={s.skillId}
								variant="outline"
								size="xs"
								color="secondary"
								icon="badge-check"
							>
								<span className="font-semibold text-foreground-muted">
									{s.skill.name}
								</span>
								✶ {levelLabel(s.proficiencyLevel)}
							</Badge>
						))}
					</Stack>
				)}
			</div>

			<div className="mb-8">
				<TS variant="h5" gutterBottom content="Портфолио" />
				{profile.portfolio.length === 0 ? (
					<TS
						variant="body"
						color="secondary"
						className="text-sm"
						content="Портфолио пока пустое."
					/>
				) : (
					<div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
						{profile.portfolio.map((p) => (
							<div
								key={p.id}
								onClick={() => setOpenId(p.id)}
								role="button"
								tabIndex={0}
								className="p-4 rounded-lg border border-border cursor-pointer hover:border-foreground transition-colors"
							>
								<TS variant="subtitle" gutterBottom content={p.title} />
								<TS
									variant="body"
									color="secondary"
									className="text-sm mb-2"
									content={p.description || 'Без описания'}
								/>
								{isImage(p.mediaType, p.mediaUrl) ? (
									<img
										src={p.mediaUrl}
										alt={p.title}
										className="w-full h-55 object-cover rounded-xl bg-muted"
									/>
								) : (
									<TS
										variant="caption"
										color="secondary"
										content={`Медиа: ${p.mediaType || 'unknown'}`}
										inline
									/>
								)}
							</div>
						))}
					</div>
				)}
			</div>

			<div className="mb-8">
				<TS variant="h5" gutterBottom content="Отзывы" />
				<TS
					variant="body"
					color="secondary"
					className="text-sm"
					content="Раздел отзывов будет добавлен позже (этапы 4–5)."
				/>
			</div>

			<div className="mb-4">
				<TS variant="h5" gutterBottom content="Статистика" />
				<TS
					variant="body"
					color="secondary"
					className="text-sm"
					content="Статистика будет рассчитана позже (нужны проекты/заказы)."
				/>
			</div>

			<Dialog
				open={!!openItem}
				onClose={() => setOpenId(null)}
				showCloseButton={false}
				className="max-w-2xl"
				title={openItem?.title}
				description={openItem?.description}
				icon={openItem?.mediaType as IconName}
				iconOptions={{ color: 'primary' }}
			>
				{openItem ? (
					<>
						{isImage(openItem.mediaType, openItem.mediaUrl) ? (
							<img
								src={openItem.mediaUrl}
								alt={openItem.title}
								className="w-full rounded-lg"
							/>
						) : isVideo(openItem.mediaType, openItem.mediaUrl) ? (
							<video controls src={openItem.mediaUrl} className="w-full rounded-lg" />
						) : isAudio(openItem.mediaType, openItem.mediaUrl) ? (
							<audio controls src={openItem.mediaUrl} className="w-full" />
						) : isPdf(openItem.mediaType, openItem.mediaUrl) ? (
							<Link
								href={openItem.mediaUrl}
								target="_blank"
								rel="noreferrer"
								color="dimmed"
								hover="underline"
							>
								Открыть PDF
							</Link>
						) : (
							<Link
								href={openItem.mediaUrl}
								target="_blank"
								rel="noreferrer"
								color="dimmed"
								hover="underline"
							>
								Открыть медиа
							</Link>
						)}
					</>
				) : null}
			</Dialog>
		</div>
	)
}

// helpers ----------------------------------------------------------------------------------------]

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
