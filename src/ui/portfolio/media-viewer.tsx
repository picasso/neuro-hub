// rendered only by Client Components
// no 'use client' so this is not an entry (serializable props not required)
import { sample } from 'effector'
import { useUnit } from 'effector-react'
import { random, uniqueId } from 'lodash'
import Image from 'next/image'
import { delay } from 'patronum'
import {
	type CSSProperties,
	type TransitionEventHandler,
	useCallback,
	useEffect,
	useState,
} from 'react'
import { Dialog } from '../dialog'
import { Icon, type IconName } from '../icon'
import { IconButton } from '../icon-button'
import { Link } from '../link'
import { Stack } from '../stack'
import { TS } from '../text-styled'
import { type MediaKind, type MediaItem, MediaPlaceholder } from './media-item'
import { viewerDomain as domain } from '@/lib/logger'

const isDevelopment = process.env.NODE_ENV === 'development'

type DebugOptions = {
	slow?: boolean
	random?: boolean
	delay?: number
}

type FadeDuration = '200' | '300' | '500' | '800' | '1000'
type FadeFunction = 'ease-in-out' | 'ease-in' | 'ease-out' | 'linear'

export type MediaViewerProps = {
	items: MediaItem[]
	openIndex: number | null
	onClose: () => void
	borderRadius?: number
	debug?: DebugOptions
	fade?: FadeDuration
	fadeFn?: FadeFunction
}

export function MediaViewer({
	items,
	openIndex,
	onClose,
	borderRadius = 6,
	fade = '500',
	fadeFn = 'ease-in',
	debug = {
		slow: false,
		random: false,
		delay: 0,
	},
}: MediaViewerProps) {
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

	const displayIndex = currentIndex ?? openIndex
	const item = displayIndex !== null ? (items[displayIndex] ?? null) : null
	const { title, caption, mediaWidth, mediaHeight, mediaUrl, mediaType } = item ?? {}
	const kind = getMediaKind(mediaType)

	const width = mediaWidth ?? 1200
	const height = mediaHeight ?? 900
	const viewerSize = getViewerSize({ kind, width, height })
	const mediaSrc = mediaUrl ?? null
	const [isMediaLoading, setIsMediaLoading] = useState(false)

	useEffect(() => {
		if (!isOpen || !mediaSrc) {
			setIsMediaLoading(false)
			return
		}

		setIsMediaLoading(true)
		if (kind === 'pdf' || kind === 'unknown') {
			const timer = window.setTimeout(() => setIsMediaLoading(false), 160)
			return () => window.clearTimeout(timer)
		}
	}, [kind, mediaSrc, isOpen])

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
			nextUrl: getSlowUrl({ index: nextIndex, mediaUrl: nextItem.mediaUrl, debug }),
			nextKind: getMediaKind(nextItem.mediaType),
		})
	}, [currentIndex, items, debug])

	const onPrev = useCallback(() => {
		if (currentIndex === null || items.length <= 1) return
		const nextIndex = (currentIndex - 1 + items.length) % items.length
		const nextItem = items[nextIndex]
		navigated({
			direction: 'left',
			nextIndex,
			nextUrl: getSlowUrl({ index: nextIndex, mediaUrl: nextItem.mediaUrl, debug }),
			nextKind: getMediaKind(nextItem.mediaType),
		})
	}, [currentIndex, items, debug])

	const onTransitionEnd: TransitionEventHandler = useCallback((event) => {
		if (event.propertyName !== 'opacity') return
		fadeCompleted()
	}, [])
	const onMediaReady = useCallback(() => {
		setIsMediaLoading(false)
	}, [])

	const isLoaderLeft = loaderDirection === 'left'
	const isLoaderRight = loaderDirection === 'right'
	const mediaFrameStyle = getViewerFrameStyle({
		width: viewerSize.width,
		height: viewerSize.height,
		borderRadius,
		fadeOpacity,
		fade,
		fadeFn,
	})

	const dialogStyle = getViewerDialogStyle(viewerSize)

	return (
		<Dialog
			noPadding
			srTitle="Preview"
			size="full"
			showCloseButton={false}
			animation="fade"
			open={isOpen}
			onClose={onCloseProxy}
			onAnimationEnd={(e) => {
				if (!isOpen && e.target === e.currentTarget) onDialogExited()
			}}
			className="w-fit border-accent-foreground"
			style={dialogStyle}
		>
			<Stack justify="space-between" gap={4} className="p-4 border-b border-border">
				<Stack gap={4}>
					<Icon name={`media-${kind}` as IconName} size={40} color="secondary" />
					<TS
						clean
						variant="h3"
						content={title ?? ''}
						className="mb-0.5 capitalize truncate max-w-sm"
					/>
					{!!caption && (
						<TS variant="caption" color="secondary" content={caption} inline />
					)}
				</Stack>
				<Stack>
					<IconButton
						rounded
						size="md"
						icon={isLoaderLeft ? 'spinner' : 'chevron-left'}
						color={isLoaderLeft ? 'primary' : !hasPrev ? 'dimmed' : undefined}
						spinning={isLoaderLeft}
						aria-label="Предыдущий"
						onClick={onPrev}
						disabled={!hasPrev}
					/>
					<IconButton
						rounded
						size="md"
						icon={isLoaderRight ? 'spinner' : 'chevron-right'}
						color={isLoaderRight ? 'primary' : !hasNext ? 'dimmed' : undefined}
						spinning={isLoaderRight}
						aria-label="Следующий"
						onClick={onNext}
						disabled={!hasNext}
					/>
					<IconButton
						rounded
						size="md"
						icon="close"
						aria-label="Закрыть"
						onClick={onCloseProxy}
					/>
				</Stack>
			</Stack>

			<MediaPlaceholder kind={kind} className="p-8 rounded-none" style={{ minHeight: 420 }}>
				{!mediaUrl ? null : (
					<div onTransitionEnd={onTransitionEnd} style={mediaFrameStyle}>
						{kind === 'image' ? (
							<Image
								src={mediaUrl}
								alt={title ?? caption ?? ''}
								width={width}
								height={height}
								onLoad={onMediaReady}
								onError={onMediaReady}
								style={{
									display: 'block',
									width: '100%',
									height: '100%',
									objectFit: 'contain',
								}}
							/>
						) : kind === 'video' ? (
							<video
								controls
								src={mediaUrl}
								onLoadedData={onMediaReady}
								onCanPlay={onMediaReady}
								onError={onMediaReady}
								style={{
									display: 'block',
									width: '100%',
									height: '100%',
									borderRadius,
									background: 'black',
								}}
							/>
						) : kind === 'audio' ? (
							<Stack
								vertical
								gap={12}
								align="center"
								justify="center"
								className="h-full w-full py-12"
							>
								<Icon name="media-audio" size={180} color="contrast" />
								<div className="w-full max-w-180">
									<audio
										controls
										src={mediaUrl}
										onLoadedData={onMediaReady}
										onCanPlay={onMediaReady}
										onError={onMediaReady}
										style={{ width: '100%' }}
									/>
								</div>
							</Stack>
						) : kind === 'pdf' ? (
							<div className="flex h-full w-full flex-col items-center justify-center gap-6 py-12">
								<Icon name="media-pdf" size={180} color="contrast" />
								<TS
									clean
									variant="body"
									color="contrast"
									className="text-sm"
									content="Предпросмотр PDF пока недоступен."
								/>
								<Link
									href={mediaUrl}
									target="_blank"
									rel="noreferrer"
									hover="vivid"
									color="soft"
								>
									Открыть PDF в новой вкладке
								</Link>
							</div>
						) : (
							<div className="flex h-full w-full flex-col items-center justify-center gap-6 py-12">
								<Icon name="do-not-disturb" size={180} color="contrast" />
								<TS
									clean
									variant="body"
									color="contrast"
									className="text-sm"
									content="Предпросмотр для этого типа файла пока недоступен."
								/>
								<Link
									href={mediaUrl}
									target="_blank"
									rel="noreferrer"
									hover="vivid"
									color="soft"
								>
									Открыть файл в новой вкладке
								</Link>
							</div>
						)}
						{isMediaLoading ? (
							<Stack
								align="center"
								justify="center"
								aria-hidden
								className="pointer-events-none absolute inset-0 bg-black/25 backdrop-blur-[1px]"
							>
								<Icon name="spinner" size={48} color="contrast" spinning />
							</Stack>
						) : null}
					</div>
				)}
			</MediaPlaceholder>
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

function getSlowUrl({
	index,
	mediaUrl,
	debug,
}: {
	index: number
	mediaUrl: string
	debug: DebugOptions
}) {
	if (!isDevelopment || !debug.slow) return mediaUrl
	if (typeof window === 'undefined') return mediaUrl
	if (!mediaUrl.startsWith('/playground/pictures/')) return mediaUrl

	const url = new URL(mediaUrl, window.location.origin)
	const slowMs = debug.random ? random(500, 2000) : debug.delay
	url.searchParams.set('slowMs', String(slowMs))
	url.searchParams.set('v', `${index}-${uniqueId('preload-')}`)
	return url.pathname + url.search
}

function fadeTransition(duration: FadeDuration, fn: FadeFunction) {
	return `opacity ${duration}ms ${fn}` //  `opacity ${500}ms ease-in-out`
}

function getViewerFrameStyle({
	width,
	height,
	borderRadius,
	fadeOpacity,
	fade,
	fadeFn,
}: {
	width: number
	height: number
	borderRadius: number
	fadeOpacity: number
	fade: FadeDuration
	fadeFn: FadeFunction
}): CSSProperties {
	return {
		position: 'relative',
		display: 'inline-block',
		maxWidth: '100%',
		width: getViewerDisplayWidth({ width, height }),
		aspectRatio: `${width} / ${height}`,
		borderRadius,
		overflow: 'hidden',
		opacity: fadeOpacity,
		transition: fadeTransition(fade, fadeFn),
	}
}

function getViewerDialogStyle({ width, height }: { width: number; height: number }): CSSProperties {
	return {
		width: `min(calc(${width}px + 4rem), calc(((100vh - 300px) * ${width} / ${height}) + 4rem), 95vw, calc(100vw - 2rem))`,
	}
}

function getViewerDisplayWidth({ width, height }: { width: number; height: number }) {
	return `min(${width}px, calc((100vh - 300px) * ${width} / ${height}), calc(95vw - 4rem), calc(100vw - 6rem))`
}

function getViewerSize({
	kind,
	width,
	height,
}: {
	kind: MediaKind
	width: number
	height: number
}) {
	switch (kind) {
		case 'image':
			return { width, height }
		case 'video':
			return { width: 1280, height: 720 }
		case 'audio':
			return { width: 720, height: 420 }
		case 'pdf':
			return { width: 760, height: 520 }
		case 'unknown':
		default:
			return { width: 760, height: 520 }
	}
}
