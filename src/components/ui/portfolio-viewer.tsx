// rendered only by Client Components
// no 'use client' so this is not an entry (serializable props not required)
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import IconButton from '@mui/material/IconButton'
import Link from '@mui/material/Link'
import Stack from '@mui/material/Stack'
import { random } from 'lodash'
import Image from 'next/image'
import {
	type TransitionEventHandler,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react'
import { type MediaKind, type MediaItem, MediaPlaceholder } from './portfolio-item'
import { Icon, type IconName } from '@/components/ui/icon'
import { TS } from '@/components/ui/text-styled'

// draft implementation of transition between 2 images
const isDevelopment = process.env.NODE_ENV === 'development'
const fadeTransition = `opacity ${800}ms ease`

export type PortfolioViewerProps = {
	items: MediaItem[]
	openIndex: number | null
	onChangeIndex: (index: number) => void
	onClose: () => void
	borderRadius?: number
}

type ImageTransitionStage = 'preloading' | 'fadingOut' | 'fadingIn'
type ImageTransition = {
	token: number
	toIndex: number
	toUrl: string
	toWidth: number
	toHeight: number
	stage: ImageTransitionStage
	isLoaded: boolean
}

export function PortfolioViewer({
	items,
	openIndex,
	onChangeIndex,
	onClose,
	borderRadius = 6,
}: PortfolioViewerProps) {
	const isOpen = openIndex !== null
	const targetIndex = openIndex ?? 0
	const transitionIdRef = useRef(0)
	const wasOpenRef = useRef(false)
	const renderIndexRef = useRef(0)
	const renderKindRef = useRef<MediaKind>('unknown')

	const [renderIndex, setRenderIndex] = useState(0)
	const [transition, setTransition] = useState<ImageTransition | null>(null)
	const [imageOpacity, setImageOpacity] = useState(1)
	const [activeImageUrl, setActiveImageUrl] = useState('')

	const renderItem = items[renderIndex]
	const renderKind = useMemo(() => getMediaKind(renderItem?.mediaType), [renderItem?.mediaType])
	const displayUrl = renderItem?.mediaUrl ?? ''
	const imageUrl = activeImageUrl || displayUrl

	const canNavigate = items.length > 1 && isOpen
	const isTransitioning = !!transition
	const hasPrev = canNavigate && !isTransitioning
	const hasNext = canNavigate && !isTransitioning

	const { title, caption, mediaWidth, mediaHeight } = renderItem ?? {}
	const width = mediaWidth ?? 1200
	const height = mediaHeight ?? 900
	const isPortrait = width < height

	useEffect(() => {
		renderIndexRef.current = renderIndex
	}, [renderIndex])

	useEffect(() => {
		renderKindRef.current = renderKind
	}, [renderKind])

	useEffect(() => {
		if (!isOpen) {
			wasOpenRef.current = false
			setTransition(null)
			setImageOpacity(1)
			setActiveImageUrl('')
			return
		}

		// initialize state only once when viewer opens
		if (wasOpenRef.current) return
		wasOpenRef.current = true

		if (!items[targetIndex]) return
		// keep refs in sync immediately to avoid starting a transition on first open
		renderIndexRef.current = targetIndex
		renderKindRef.current = getMediaKind(items[targetIndex]?.mediaType)
		setTransition(null)
		setImageOpacity(1)
		setRenderIndex(targetIndex)
		setActiveImageUrl(items[targetIndex]?.mediaUrl ?? '')
	}, [isOpen, items, targetIndex])

	useEffect(() => {
		if (!isOpen) return
		if (!items[targetIndex]) return
		if (targetIndex === renderIndexRef.current) return

		const targetItem = items[targetIndex]
		const targetKind = getMediaKind(targetItem.mediaType)
		const currentKind = renderKindRef.current

		// switch immediately for non-images (or when current is not image)
		if (targetKind !== 'image' || currentKind !== 'image') {
			setTransition(null)
			setImageOpacity(1)
			setRenderIndex(targetIndex)
			setActiveImageUrl(targetItem.mediaUrl)
			return
		}

		const token = (transitionIdRef.current += 1)
		const toUrl = getSlowUrl({
			index: targetIndex,
			mediaUrl: targetItem.mediaUrl,
			slowMs: random(500, 3000),
			cacheKey: token,
		})

		const toWidth = targetItem.mediaWidth ?? 1200
		const toHeight = targetItem.mediaHeight ?? 900

		setTransition({
			token,
			toIndex: targetIndex,
			toUrl,
			toWidth,
			toHeight,
			stage: 'preloading',
			isLoaded: false,
		})
	}, [isOpen, items, targetIndex])

	useEffect(() => {
		if (!transition) return
		if (!isOpen) return
		if (transition.stage !== 'preloading') return
		if (!transition.isLoaded) return
		if (transitionIdRef.current !== transition.token) return

		// start fade-out only after next image is preloaded (by Next/Image preloader)
		setTransition((prev) =>
			prev && prev.token === transition.token ? { ...prev, stage: 'fadingOut' } : prev,
		)
		setImageOpacity(0)
	}, [isOpen, transition])

	useEffect(() => {
		if (!isOpen) return

		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				onClose()
				return
			}

			if (!canNavigate || isTransitioning) return

			if (event.key === 'ArrowLeft') {
				onChangeIndex(getPrevIndex(items.length, targetIndex))
			}
			if (event.key === 'ArrowRight') {
				onChangeIndex(getNextIndex(items.length, targetIndex))
			}
		}

		window.addEventListener('keydown', onKeyDown)
		return () => {
			window.removeEventListener('keydown', onKeyDown)
		}
	}, [canNavigate, isOpen, isTransitioning, items.length, onChangeIndex, onClose, targetIndex])

	const onTransitionEnd: TransitionEventHandler<HTMLImageElement> = useCallback(
		(event) => {
			if (event.propertyName !== 'opacity') return
			if (!transition) return
			if (transitionIdRef.current !== transition.token) return

			if (transition.stage === 'fadingOut') {
				setRenderIndex(transition.toIndex)
				setActiveImageUrl(transition.toUrl)
				setTransition((prev) =>
					prev && prev.token === transition.token ? { ...prev, stage: 'fadingIn' } : prev,
				)
				window.requestAnimationFrame(() => {
					if (transitionIdRef.current !== transition.token) return
					setImageOpacity(1)
				})
			}

			if (transition.stage === 'fadingIn') {
				setTransition(null)
			}
		},
		[transition, transitionIdRef],
	)

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
						<Icon
							name={`media-${renderKind}` as IconName}
							forceSize={40}
							color="secondary"
						/>
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
							onClick={() => onChangeIndex(getPrevIndex(items.length, targetIndex))}
							disabled={!hasPrev}
						>
							<Icon name="expand-more" sx={{ transform: 'rotate(90deg)' }} />
						</IconButton>
						<IconButton
							aria-label="Следующий"
							onClick={() => onChangeIndex(getNextIndex(items.length, targetIndex))}
							disabled={!hasNext}
						>
							<Icon
								name={
									transition?.stage === 'preloading' ? 'spinner' : 'expand-more'
								}
								color={transition?.stage === 'preloading' ? 'primary' : 'inherit'}
								animation={
									transition?.stage === 'preloading' ? 'rotate' : undefined
								}
								sx={{ transform: 'rotate(-90deg)' }}
							/>
						</IconButton>
						<IconButton aria-label="Закрыть" onClick={onClose}>
							<Icon name="close" />
						</IconButton>
					</Stack>
				</Stack>

				<MediaPlaceholder kind={renderKind} sx={{ p: 4, minHeight: 420, borderRadius: 0 }}>
					{!renderItem ? null : renderKind === 'image' ? (
						<>
							{!!transition && transition.stage === 'preloading' && (
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
										src={transition.toUrl}
										alt=""
										width={transition.toWidth}
										height={transition.toHeight}
										priority
										loading="eager"
										onLoadingComplete={() => {
											setTransition((prev) =>
												prev && prev.token === transition.token
													? { ...prev, isLoaded: true }
													: prev,
											)
										}}
										onError={() => setTransition(null)}
									/>
								</Box>
							)}
							<Image
								src={imageUrl}
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
									opacity: imageOpacity,
									transition: fadeTransition,
								}}
							/>
						</>
					) : renderKind === 'video' ? (
						<video
							controls
							src={displayUrl}
							style={{
								maxWidth: '100%',
								width: '100%',
								borderRadius,
								background: 'black',
							}}
						/>
					) : renderKind === 'audio' ? (
						<Stack spacing={6} alignItems="center" sx={{ py: 6, width: 1 }}>
							<Icon name="media-audio" forceSize={180} color="contrast" />
							<Box sx={{ width: 1, maxWidth: 720 }}>
								<audio controls src={displayUrl} style={{ width: '100%' }} />
							</Box>
						</Stack>
					) : renderKind === 'pdf' ? (
						<Stack spacing={3} alignItems="center" sx={{ py: 6 }}>
							<Icon name="media-pdf" forceSize={180} color="contrast" />
							<TS
								variant="body2"
								color="contrast.dark"
								content="Предпросмотр PDF пока недоступен."
							/>
							<Link
								href={displayUrl}
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
								href={displayUrl}
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

function getSlowUrl({
	index,
	mediaUrl,
	slowMs,
	cacheKey,
}: {
	index: number
	mediaUrl: string
	slowMs: number
	cacheKey: number
}) {
	// demo helper: slow down only in viewer to reproduce resizing artifact
	if (!isDevelopment) return mediaUrl
	if (typeof window === 'undefined') return mediaUrl
	if (!mediaUrl.startsWith('/playground/pictures/')) return mediaUrl

	const url = new URL(mediaUrl, window.location.origin)
	url.searchParams.set('slowMs', String(slowMs))
	url.searchParams.set('v', `${index}-${cacheKey}`)
	return url.pathname + url.search
}

function getPrevIndex(length: number, index: number) {
	if (length <= 0) return 0
	return (index - 1 + length) % length
}

function getNextIndex(length: number, index: number) {
	if (length <= 0) return 0
	return (index + 1) % length
}
