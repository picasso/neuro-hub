// rendered only by Client Components
// no 'use client' so this is not an entry (serializable props not required)
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import IconButton from '@mui/material/IconButton'
import Link from '@mui/material/Link'
import Stack from '@mui/material/Stack'
import Image from 'next/image'
import { useEffect, useMemo } from 'react'
import { type MediaKind, type MediaItem, MediaPlaceholder } from './portfolio-item'
import { Icon, type IconName } from '@/components/ui/icon'
import { TS } from '@/components/ui/text-styled'

export type PortfolioViewerProps = {
	items: MediaItem[]
	openIndex: number | null
	onChangeIndex: (index: number) => void
	onClose: () => void
	borderRadius?: number
}

export function PortfolioViewer({
	items,
	openIndex,
	onChangeIndex,
	onClose,
	borderRadius = 6,
}: PortfolioViewerProps) {
	const isOpen = openIndex !== null
	const index = openIndex ?? 0

	const hasItem = !!items[index]
	const { title, caption, mediaUrl, mediaType, mediaWidth, mediaHeight } = items[index] ?? {}
	const kind = useMemo(() => getMediaKind(mediaType), [mediaType])

	const canNavigate = items.length > 1 && isOpen
	const hasPrev = canNavigate
	const hasNext = canNavigate
	const width = mediaWidth ?? 1200
	const height = mediaHeight ?? 900
	const isPortrait = width < height

	useEffect(() => {
		if (!isOpen) return

		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				onClose()
				return
			}

			if (!canNavigate) return

			if (event.key === 'ArrowLeft') {
				onChangeIndex(getPrevIndex(items.length, index))
			}
			if (event.key === 'ArrowRight') {
				onChangeIndex(getNextIndex(items.length, index))
			}
		}

		window.addEventListener('keydown', onKeyDown)
		return () => {
			window.removeEventListener('keydown', onKeyDown)
		}
	}, [canNavigate, index, isOpen, items.length, onChangeIndex, onClose])

	return (
		<Dialog
			open={isOpen}
			onClose={onClose}
			fullWidth
			maxWidth="md"
			slotProps={{ paper: { sx: { border: 'none', borderRadius: 1 } } }}
		>
			<DialogContent sx={{ p: 0 }}>
				<Stack
					direction="row"
					alignItems="center"
					justifyContent="space-between"
					sx={{
						p: 2,
						borderBottom: '1px solid',
						borderColor: 'divider',
						gap: 2,
					}}
				>
					<Stack
						direction="row"
						alignItems="center"
						justifyContent="space-between"
						spacing={2}
					>
						<Icon name={`media-${kind}` as IconName} forceSize={40} color="secondary" />
						<TS
							variant="h3"
							content={title ?? ''}
							sx={{ mb: 0.25, textTransform: 'capitalize' }}
						/>
						{!!caption && (
							<TS variant="caption" color="text.secondary" content={caption} />
						)}
					</Stack>
					<Stack direction="row" alignItems="center" spacing={1}>
						<IconButton
							aria-label="Предыдущий"
							onClick={() => onChangeIndex(getPrevIndex(items.length, index))}
							disabled={!hasPrev}
						>
							<Icon name="expand-more" sx={{ transform: 'rotate(90deg)' }} />
						</IconButton>
						<IconButton
							aria-label="Следующий"
							onClick={() => onChangeIndex(getNextIndex(items.length, index))}
							disabled={!hasNext}
						>
							<Icon name="expand-more" sx={{ transform: 'rotate(-90deg)' }} />
						</IconButton>
						<IconButton aria-label="Закрыть" onClick={onClose}>
							<Icon name="close" />
						</IconButton>
					</Stack>
				</Stack>

				<MediaPlaceholder kind={kind} sx={{ p: 4, minHeight: 420, borderRadius: 0 }}>
					{!hasItem ? null : kind === 'image' ? (
						<Image
							src={mediaUrl}
							alt={title ?? caption ?? ''}
							width={width}
							height={height}
							// placeholder="blur"
							style={{
								maxWidth: '100%',
								width: isPortrait ? 'auto' : undefined,
								height: !isPortrait ? 'auto' : undefined,
								aspectRatio: `${width} / ${height}`,
								borderRadius,
								maxHeight: 'calc(100vh - 300px)',
							}}
						/>
					) : kind === 'video' ? (
						<video
							controls
							src={mediaUrl}
							style={{
								maxWidth: '100%',
								width: '100%',
								borderRadius,
								background: 'black',
							}}
						/>
					) : kind === 'audio' ? (
						<Stack spacing={6} alignItems="center" sx={{ py: 6, width: 1 }}>
							<Icon name="media-audio" forceSize={180} color="contrast" />
							<Box sx={{ width: 1, maxWidth: 720 }}>
								<audio controls src={mediaUrl} style={{ width: '100%' }} />
							</Box>
						</Stack>
					) : kind === 'pdf' ? (
						<Stack spacing={3} alignItems="center" sx={{ py: 6 }}>
							<Icon name="media-pdf" forceSize={180} color="contrast" />
							<TS
								variant="body2"
								color="contrast.dark"
								content="Предпросмотр PDF пока недоступен."
							/>
							<Link
								href={mediaUrl}
								target="_blank"
								rel="noreferrer"
								underline="hover"
								color="contrast"
							>
								Открыть PDF в новой вкладке
							</Link>
						</Stack>
					) : (
						<Stack spacing={3} alignItems="center" sx={{ py: 6 }}>
							<Icon name="do-not-disturb" forceSize={180} color="contrast" />
							<TS
								variant="body2"
								color="contrast.dark"
								content="Предпросмотр для этого типа файла пока недоступен."
							/>
							<Link
								href={mediaUrl}
								target="_blank"
								rel="noreferrer"
								underline="hover"
								color="contrast"
							>
								Открыть файл в новой вкладке
							</Link>
						</Stack>
					)}
				</MediaPlaceholder>
				{/*
				{!!description && (
					<Box sx={{ p: 2, pt: 0 }}>
						<TS variant="body2" color="text.secondary" content={description} />
					</Box>
				)} */}
			</DialogContent>
		</Dialog>
	)
}

export function getMediaKind(mediaType?: string | null): MediaKind {
	if (!mediaType) return 'unknown'
	if (mediaType.startsWith('image/')) return 'image'
	if (mediaType.startsWith('video/')) return 'video'
	if (mediaType.startsWith('audio/')) return 'audio'
	if (mediaType === 'application/pdf') return 'pdf'
	return 'unknown'
}

function getPrevIndex(length: number, index: number) {
	if (length <= 0) return 0
	return (index - 1 + length) % length
}

function getNextIndex(length: number, index: number) {
	if (length <= 0) return 0
	return (index + 1) % length
}
