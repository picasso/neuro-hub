// rendered only by Client Components
// no 'use client' so this is not an entry (serializable props not required)
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import IconButton from '@mui/material/IconButton'
import Link from '@mui/material/Link'
import Stack from '@mui/material/Stack'
import { sample } from 'effector'
import { useUnit } from 'effector-react'
import { random, uniqueId } from 'lodash'
import Image from 'next/image'
import { delay } from 'patronum'
import { type TransitionEventHandler, useCallback, useEffect } from 'react'
import { type MediaKind, type MediaItem, MediaPlaceholder } from './portfolio-item'
import { Icon, type IconName } from '@/components/ui/icon'
import { TS } from '@/components/ui/text-styled'
import { viewerDomain as domain } from '@/lib/logger'

const isDevelopment = process.env.NODE_ENV === 'development'
const fadeTransition = `opacity ${500}ms ease-in-out`

export type PortfolioViewerProps = {
	items: MediaItem[]
	openIndex: number | null
	onClose: () => void
	borderRadius?: number
}

export function PortfolioViewer({
	items,
	openIndex,
	onClose,
	borderRadius = 6,
}: PortfolioViewerProps) {
	const [currentIndex, fadeOpacity, isTransitioning, loaderDirection] = useUnit([
		$currentIndex,
		$fadeOpacity,
		$isTransitioning,
		$loaderDirection,
	])

	useEffect(() => {
		if (openIndex !== null) opened(openIndex)
	}, [openIndex])

	// viewer Dialog `open/close` driven by parent prop;
	// stores keep last valid data during Dialog exit animation
	const isOpen = openIndex !== null
	const onDialogExited = useCallback(() => closed(), [])

	const item = currentIndex !== null ? items[currentIndex] : null
	const { title, caption, mediaWidth, mediaHeight, mediaUrl, mediaType } = item ?? {}
	const kind = getMediaKind(mediaType)

	const width = mediaWidth ?? 1200
	const height = mediaHeight ?? 900
	const isPortrait = width < height

	const canNavigate = items.length > 1 && isOpen
	const hasPrev = canNavigate && !isTransitioning
	const hasNext = canNavigate && !isTransitioning

	const onCloseProxy = useCallback(() => {
		onClose()
	}, [onClose])

	const onNext = useCallback(() => {
		if (currentIndex === null || items.length <= 1) return
		const nextIndex = (currentIndex + 1) % items.length
		const nextItem = items[nextIndex]
		navigated({
			direction: 'right',
			nextIndex,
			nextUrl: getSlowUrl({ index: nextIndex, mediaUrl: nextItem.mediaUrl }),
			nextKind: getMediaKind(nextItem.mediaType),
		})
	}, [currentIndex, items])

	const onPrev = useCallback(() => {
		if (currentIndex === null || items.length <= 1) return
		const nextIndex = (currentIndex - 1 + items.length) % items.length
		const nextItem = items[nextIndex]
		navigated({
			direction: 'left',
			nextIndex,
			nextUrl: getSlowUrl({ index: nextIndex, mediaUrl: nextItem.mediaUrl }),
			nextKind: getMediaKind(nextItem.mediaType),
		})
	}, [currentIndex, items])

	const onTransitionEnd: TransitionEventHandler = useCallback((event) => {
		if (event.propertyName !== 'opacity') return
		fadeCompleted()
	}, [])

	const isLoaderLeft = loaderDirection === 'left'
	const isLoaderRight = loaderDirection === 'right'

	return (
		<Dialog
			open={isOpen}
			onClose={onCloseProxy}
			fullWidth
			maxWidth="md"
			slotProps={{
				paper: { sx: { border: 'none', borderRadius: 1 } },
				transition: { onExited: onDialogExited },
			}}
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
						<Icon name={`media-${kind}` as IconName} size={40} color="muted" />
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
						<IconButton aria-label="Предыдущий" onClick={onPrev} disabled={!hasPrev}>
							<Icon
								name={isLoaderLeft ? 'spinner' : 'expand-more'}
								color={isLoaderLeft ? 'primary' : !hasPrev ? 'dimmed' : undefined}
								spinning={isLoaderLeft}
								className="rotate-90"
							/>
						</IconButton>
						<IconButton aria-label="Следующий" onClick={onNext} disabled={!hasNext}>
							<Icon
								name={isLoaderRight ? 'spinner' : 'expand-more'}
								color={isLoaderRight ? 'primary' : !hasNext ? 'dimmed' : undefined}
								spinning={isLoaderRight}
								className="-rotate-90"
							/>
						</IconButton>
						<IconButton aria-label="Закрыть" onClick={onCloseProxy}>
							<Icon name="close" />
						</IconButton>
					</Stack>
				</Stack>

				<MediaPlaceholder kind={kind} sx={{ p: 4, minHeight: 420, borderRadius: 0 }}>
					{!mediaUrl ? null : kind === 'image' ? (
						<Image
							src={mediaUrl}
							alt={title ?? caption ?? ''}
							width={width}
							height={height}
							onTransitionEnd={onTransitionEnd}
							style={{
								maxWidth: '100%',
								width: isPortrait ? 'auto' : undefined,
								height: !isPortrait ? 'auto' : undefined,
								aspectRatio: `${width} / ${height}`,
								borderRadius,
								maxHeight: 'calc(100vh - 300px)',
								opacity: fadeOpacity,
								transition: fadeTransition,
							}}
						/>
					) : kind === 'video' ? (
						<video
							controls
							src={mediaUrl}
							onTransitionEnd={onTransitionEnd}
							style={{
								maxWidth: '100%',
								width: '100%',
								borderRadius,
								background: 'black',
								opacity: fadeOpacity,
								transition: fadeTransition,
							}}
						/>
					) : kind === 'audio' ? (
						<Stack spacing={6} alignItems="center" sx={{ py: 6, width: 1 }}>
							<Icon name="media-audio" size={180} color="contrast" />
							<Box
								onTransitionEnd={onTransitionEnd}
								sx={{
									width: 1,
									maxWidth: 720,
									opacity: fadeOpacity,
									transition: fadeTransition,
								}}
							>
								<audio controls src={mediaUrl} style={{ width: '100%' }} />
							</Box>
						</Stack>
					) : kind === 'pdf' ? (
						<Stack
							spacing={3}
							alignItems="center"
							onTransitionEnd={onTransitionEnd}
							sx={{ py: 6, opacity: fadeOpacity, transition: fadeTransition }}
						>
							<Icon name="media-pdf" size={180} color="contrast" />
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
						<Stack
							spacing={3}
							alignItems="center"
							onTransitionEnd={onTransitionEnd}
							sx={{ py: 6, opacity: fadeOpacity, transition: fadeTransition }}
						>
							<Icon name="do-not-disturb" size={180} color="contrast" />
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
			</DialogContent>
		</Dialog>
	)
}

// * * * types ------------------------------------------------------------------------------------]

type Phase =
	| { _: 'idle' }
	| { _: 'preloading'; direction: 'left' | 'right' }
	| { _: 'fading-out'; direction: 'left' | 'right' }
	| { _: 'switching' }
	| { _: 'fading-in' }

type NavigatePayload = {
	direction: 'left' | 'right'
	nextIndex: number
	nextUrl: string
	nextKind: MediaKind
}

// * * * events -----------------------------------------------------------------------------------]

const opened = domain.createEvent<number>('opened')
const closed = domain.createEvent('closed')
const navigated = domain.createEvent<NavigatePayload>('navigated')
const fadeCompleted = domain.createEvent('fadeCompleted')
const fadeOutDone = domain.createEvent('fadeOutDone')
const fadeInDone = domain.createEvent('fadeInDone')

// * * * effects ----------------------------------------------------------------------------------]

const preloadImageFx = domain.createEffect<string, void>({
	handler: (url) =>
		new Promise<void>((resolve, reject) => {
			const img = new window.Image()
			img.onload = () => resolve()
			img.onerror = () => reject(new Error('preload failed'))
			img.src = url
		}),
	name: 'preloadImageFx',
})

// * * * $currentIndex ----------------------------------------------------------------------------]

const $currentIndex = domain.createStore<number | null>(null, { name: '$currentIndex' })

$currentIndex.on(opened, (_, index) => index)
$currentIndex.on(closed, () => null)

// * * * $targetIndex -----------------------------------------------------------------------------]

const $targetIndex = domain.createStore<number | null>(null, { name: '$targetIndex' })

$targetIndex.on(opened, (_, index) => index)
$targetIndex.on(closed, () => null)
$targetIndex.on(navigated, (_, { nextIndex }) => nextIndex)

// * * * $phase -----------------------------------------------------------------------------------]

const $phase = domain.createStore<Phase>({ _: 'idle' }, { name: '$phase' })

$phase.on(opened, (): Phase => ({ _: 'idle' }))
$phase.on(closed, (): Phase => ({ _: 'idle' }))
$phase.on(
	navigated,
	(_, { nextKind, direction }): Phase =>
		nextKind === 'image' ? { _: 'preloading', direction } : { _: 'fading-out', direction },
)
$phase.on(preloadImageFx.done, (phase): Phase => {
	if (phase._ !== 'preloading') return phase
	return { _: 'fading-out', direction: phase.direction }
})
$phase.on(preloadImageFx.fail, (): Phase => ({ _: 'idle' }))
$phase.on(fadeOutDone, (): Phase => ({ _: 'switching' }))
$phase.on(fadeInDone, (): Phase => ({ _: 'idle' }))

// * * * derived stores ---------------------------------------------------------------------------]

const $fadeOpacity = $phase.map((p) => (p._ === 'fading-out' || p._ === 'switching' ? 0 : 1))
const $isTransitioning = $phase.map((p) => p._ !== 'idle')
const $loaderDirection = $phase.map((p) => (p._ === 'preloading' ? p.direction : null))

// * * * connections and consequences -------------------------------------------------------------]

// navigated + image -> start preload
sample({
	clock: navigated,
	filter: ({ nextKind }) => nextKind === 'image',
	fn: ({ nextUrl }) => nextUrl,
	target: preloadImageFx,
})

// preload failed -> restore targetIndex to currentIndex
sample({
	clock: preloadImageFx.fail,
	source: $currentIndex,
	target: $targetIndex,
})

// fadeCompleted during fading-out -> trigger fadeOutDone
sample({
	clock: fadeCompleted,
	source: $phase,
	filter: (phase) => phase._ === 'fading-out',
	target: fadeOutDone,
})

// fadeCompleted during fading-in -> trigger fadeInDone
sample({
	clock: fadeCompleted,
	source: $phase,
	filter: (phase) => phase._ === 'fading-in',
	target: fadeInDone,
})

// fadeOutDone -> update $currentIndex from $targetIndex (dialog resizes while invisible)
sample({
	clock: fadeOutDone,
	source: $targetIndex,
	target: $currentIndex,
})

// delay after switch -> start fade-in (guarded: only if still in switching phase)
sample({
	clock: delay(fadeOutDone, 300),
	source: $phase,
	filter: (phase) => phase._ === 'switching',
	fn: (): Phase => ({ _: 'fading-in' }),
	target: $phase,
})

// * * * helpers ----------------------------------------------------------------------------------]

export function getMediaKind(mediaType?: string | null): MediaKind {
	if (!mediaType) return 'unknown'
	if (mediaType.startsWith('image/')) return 'image'
	if (mediaType.startsWith('video/')) return 'video'
	if (mediaType.startsWith('audio/')) return 'audio'
	if (mediaType === 'application/pdf') return 'pdf'
	return 'unknown'
}

function getSlowUrl({ index, mediaUrl }: { index: number; mediaUrl: string }) {
	if (!isDevelopment) return mediaUrl
	if (typeof window === 'undefined') return mediaUrl
	if (!mediaUrl.startsWith('/playground/pictures/')) return mediaUrl

	const url = new URL(mediaUrl, window.location.origin)
	const slowMs = random(500, 2000)
	url.searchParams.set('slowMs', String(slowMs))
	url.searchParams.set('v', `${index}-${uniqueId('preload-')}`)
	return url.pathname + url.search
}
