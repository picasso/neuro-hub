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
import { type TransitionEventHandler, useCallback, useEffect, useMemo, useState } from 'react'
import { type MediaKind, type MediaItem, MediaPlaceholder } from './portfolio-item'
import { Icon, type IconName } from '@/components/ui/icon'
import { TS } from '@/components/ui/text-styled'
import { viewerDomain as domain } from '@/lib/logger'

const isDevelopment = process.env.NODE_ENV === 'development'
const fadeTransition = `opacity ${500}ms ease-in-out`

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
	const [targetIndex, ready, fadeOpacity, loaders, preloading] = useUnit([
		$targetIndex,
		$ready,
		$fadeOpacity,
		$loaders,
		$preloading,
	])
	const [isOpen, setIsOpen] = useState(false)

	// set `isOpen` to true when `openIndex` is not null and
	// reset all stores when `openIndex` is provided
	useEffect(() => {
		if (!isOpen && openIndex !== null) setIsOpen(true)
		if (isOpen && openIndex === null) setIsOpen(false)
	}, [isOpen, openIndex])

	// sync `targetIndex` with `openIndex` when viewer is open
	useEffect(() => {
		if (isOpen) setTargetIndex(openIndex!)
	}, [isOpen, openIndex])

	// sync `targetIndex` with `openIndex` when state is ready and
	// `openIndex` is not equal to `targetIndex` (we are inside the transition)
	useEffect(() => {
		if (openIndex === null) return
		if (ready && targetIndex !== null && openIndex !== targetIndex) {
			onChangeIndex(targetIndex)
		}
	}, [ready, openIndex, targetIndex, onChangeIndex])

	// proxy `onClose` to reset all stores
	const onCloseProxy = useCallback(() => {
		onClose()
		resetAll()
	}, [onClose])

	const onNext = useCallback(() => {
		if (items.length <= 0 || targetIndex === null) return
		const index = (targetIndex + 1) % items.length
		setTargetIndex(index)
		startedLoader('right')
	}, [items.length, targetIndex])

	const onPrev = useCallback(() => {
		if (items.length <= 0 || targetIndex === null) return
		const index = (targetIndex - 1 + items.length) % items.length
		setTargetIndex(index)
		startedLoader('left')
	}, [items.length, targetIndex])

	const next = useMemo(() => {
		const nextItem = targetIndex === null ? null : items[targetIndex]
		return !nextItem
			? null
			: {
					url: getSlowUrl({ index: targetIndex!, mediaUrl: nextItem.mediaUrl }),
					width: nextItem.mediaWidth ?? 1200,
					height: nextItem.mediaHeight ?? 900,
					kind: getMediaKind(nextItem.mediaType),
				}
	}, [items, targetIndex])

	// reset `preloading` when next item is not an `image`
	useEffect(() => {
		if (next?.kind !== 'image') preloaded()
	}, [next?.kind])

	const { title, caption, mediaWidth, mediaHeight, mediaUrl, mediaType } = items[openIndex!] ?? {}
	const kind = useMemo(() => getMediaKind(mediaType), [mediaType])
	const nextKind = next?.kind ?? 'unknown'

	const width = mediaWidth ?? 1200
	const height = mediaHeight ?? 900
	const isPortrait = width < height

	const canNavigate = items.length > 1 && isOpen
	const isTransitioning = !!loaders.left || !!loaders.right
	const hasPrev = canNavigate && !isTransitioning
	const hasNext = canNavigate && !isTransitioning

	const onTransitionEnd: TransitionEventHandler = useCallback((event) => {
		if (event.propertyName !== 'opacity') return
		completedFade()
	}, [])

	return (
		<Dialog
			open={isOpen}
			onClose={onCloseProxy}
			fullWidth
			maxWidth="md"
			slotProps={{ paper: { sx: { border: 'none', borderRadius: 1 } } }}
		>
			<DialogContent sx={{ p: 0, opacity: openIndex === null ? 0 : 1 }}>
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
						<IconButton aria-label="Предыдущий" onClick={onPrev} disabled={!hasPrev}>
							<Icon
								name={loaders.left ? 'spinner' : 'expand-more'}
								color={loaders.left ? 'primary' : 'inherit'}
								animation={loaders.left ? 'rotate' : undefined}
								sx={{ transform: 'rotate(90deg)' }}
							/>
						</IconButton>
						<IconButton aria-label="Следующий" onClick={onNext} disabled={!hasNext}>
							<Icon
								name={loaders.right ? 'spinner' : 'expand-more'}
								color={loaders.right ? 'primary' : 'inherit'}
								animation={loaders.right ? 'rotate' : undefined}
								sx={{ transform: 'rotate(-90deg)' }}
							/>
						</IconButton>
						<IconButton aria-label="Закрыть" onClick={onCloseProxy}>
							<Icon name="close" />
						</IconButton>
					</Stack>
				</Stack>

				<MediaPlaceholder
					kind={kind}
					sx={{
						p: 4,
						minHeight: 420,
						borderRadius: 0,
						opacity: openIndex === null ? 0 : 1,
					}}
				>
					{preloading && next && nextKind === 'image' && (
						<Box
							sx={{
								position: 'absolute',
								width: 1,
								height: 1,
								overflow: 'hidden',
								opacity: 0,
								pointerEvents: 'none',
							}}
						>
							<Image
								src={next.url}
								width={next.width}
								height={next.height}
								priority
								alt=""
								loading="eager"
								onLoad={() => preloaded()}
								onError={() => resetOnError(openIndex!)}
							/>
						</Box>
					)}
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
							<Icon name="media-audio" forceSize={180} color="contrast" />
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
						<Stack
							spacing={3}
							alignItems="center"
							onTransitionEnd={onTransitionEnd}
							sx={{ py: 6, opacity: fadeOpacity, transition: fadeTransition }}
						>
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

// * * * stores -----------------------------------------------------------------------------------]

type Loaders = {
	left?: boolean
	right?: boolean
}

type Fade = {
	in?: boolean
	out?: boolean
}

const resetAll = domain.createEvent('resetAll')

// * * * $targetIndex -----------------------------------------------------------------------------]

const resetTargetIndex = domain.createEvent('resetTargetIndex')
const resetOnError = domain.createEvent<number>('resetOnError')
const setTargetIndex = domain.createEvent<number>('setTargetIndex')
const $targetIndex = domain.createStore<number | null>(null, { name: '$targetIndex' })

$targetIndex.reset(resetTargetIndex)
$targetIndex.on(setTargetIndex, (_, update) => update)

// * * * $loaders ---------------------------------------------------------------------------------]

const resetLoaders = domain.createEvent('resetLoaders')
const startedLoader = domain.createEvent<'left' | 'right'>('startedLoader')
const $loaders = domain.createStore<Loaders>({}, { name: '$loaders' })

$loaders.reset(resetLoaders)
$loaders.on(startedLoader, (_, update) => ({ [update]: true }))

// * * * $preloading ------------------------------------------------------------------------------]

const resetPreloading = domain.createEvent('resetPreloading')
const preloaded = domain.createEvent('preloaded')
const $preloading = domain.createStore<boolean>(false, { name: '$preloading' })
const $ready = domain.createStore<boolean>(true, { name: '$ready' })

$preloading.reset(resetPreloading)

// * * * $fade ------------------------------------------------------------------------------------]

const resetFade = domain.createEvent('resetFade')
const resetFadeOpacity = domain.createEvent('resetFadeOpacity')
const startedFadeIn = domain.createEvent('startedFadeIn')
const startedFadeOut = domain.createEvent('startedFadeOut')
const completedFade = domain.createEvent('completedFade')
const fadeInDelayed = domain.createEvent('fadeInDelayed')

const $fade = domain.createStore<Fade>({}, { name: '$fade' })
const $fadeOpacity = domain.createStore<number>(1, { name: '$fadeOpacity' })

$fade.reset(resetFade)
$fade.on(startedFadeIn, () => ({ in: true }))
$fade.on(startedFadeOut, () => ({ out: true }))
$fadeOpacity.reset(resetFadeOpacity)
$fadeOpacity.on(startedFadeOut, () => 0)
$fadeOpacity.on(startedFadeIn, () => 1)

// * * * connections and consequences -------------------------------------------------------------]

// reset all stores on `resetAll` event or `PortfolioViewerGate` is opened
sample({
	clock: [resetAll],
	target: [resetTargetIndex, resetLoaders, resetPreloading, resetFade, resetFadeOpacity],
})

// reset all stores on `error` - reset all except `targetIndex`
// use given index to restore `targetIndex`
sample({
	clock: resetOnError,
	target: [resetLoaders, resetPreloading, resetFade, resetFadeOpacity, setTargetIndex],
})

// start `$preloading` when `$loaders` is activated
sample({
	clock: $loaders,
	filter: ({ left, right }) => !!(left || right),
	fn: () => true,
	target: $preloading,
})

// set `$ready` to false when preloading is started
sample({
	clock: $preloading,
	filter: (preloading) => preloading,
	fn: () => false,
	target: $ready,
})

// reset `$preloading` when preloaded event is triggered
sample({
	clock: preloaded,
	fn: () => false,
	target: $preloading,
})

// start fade-out when preloading is complete
sample({
	clock: preloaded,
	source: $loaders,
	filter: ({ left, right }) => !!(left || right),
	target: startedFadeOut,
})

// set `$ready` to true when fade-out is complete and delay fade-in to avoid flickering
sample({
	clock: completedFade,
	source: $fade,
	filter: (fade) => !!fade.out,
	fn: () => true,
	target: [$ready, fadeInDelayed],
})

// delay fade-in to avoid flickering and reset `$loaders`
sample({
	clock: delay(fadeInDelayed, 300),
	target: [startedFadeIn, resetLoaders],
})

// reset `$fade` when fade-in is complete
sample({
	clock: completedFade,
	source: $fade,
	filter: (fade) => !!fade.in,
	target: resetFade,
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
	// demo helper: slow down only in viewer to reproduce resizing artifact
	if (!isDevelopment) return mediaUrl
	if (typeof window === 'undefined') return mediaUrl
	if (!mediaUrl.startsWith('/playground/pictures/')) return mediaUrl

	const url = new URL(mediaUrl, window.location.origin)
	const slowMs = random(500, 2000)
	url.searchParams.set('slowMs', String(slowMs))
	url.searchParams.set('v', `${index}-${uniqueId('preload-')}`)
	return url.pathname + url.search
}
