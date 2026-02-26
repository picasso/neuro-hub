'use client'

import Box, { type BoxProps } from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import Image from 'next/image'
import { type Photo, type RenderImageContext, type RenderImageProps } from 'react-photo-album'
import 'react-photo-album/columns.css'
import { Icon, type IconName } from '@/ui/icon'

export type MediaKind = 'image' | 'video' | 'audio' | 'pdf' | 'unknown'

export interface ExtendedPhoto extends Photo {
	kind: MediaKind
}

export type MediaItem = {
	id: string
	title: string
	description?: string | null
	mediaUrl: string
	mediaType?: string | null
	mediaWidth?: number | null
	mediaHeight?: number | null
	caption?: string | null
}

// TODO: Оставлено для будущего использования
// const x: ExtendedPhoto = {
// 	key: '1',
// 	src: 'https://via.placeholder.com/150',
// 	width: 150,
// 	height: 150,
// 	alt: 'Placeholder',
// 	title: 'Placeholder',
// 	label: 'Placeholder',
// 	srcSet: [
// 		{
// 			src: 'https://via.placeholder.com/150',
// 			width: 150,
// 			height: 150,
// 		},
// 	],
// 	href: 'https://via.placeholder.com/150',
// 	kind: 'image',
// }

export function renderMediaItem(
	{ alt = '', title, sizes }: RenderImageProps,
	{ photo, width, height }: RenderImageContext<ExtendedPhoto>,
	borderRadius = 6,
) {
	return (
		<div
			style={{
				width: '100%',
				position: 'relative',
				aspectRatio: `${width} / ${height}`,
			}}
		>
			{photo.kind !== 'image' ? (
				<MediaPlaceholder
					kind={photo.kind}
					alt={alt}
					title={title}
					borderRadius={borderRadius}
				/>
			) : (
				<Image
					fill
					src={photo}
					alt={alt}
					title={title}
					sizes={sizes}
					placeholder={'blurDataURL' in photo ? 'blur' : undefined}
					style={{ borderRadius }}
				/>
			)}
		</div>
	)
}

type MediaPlaceholderProps = {
	kind: MediaKind
	title?: RenderImageProps['title']
	alt?: RenderImageProps['alt']
	children?: React.ReactNode
	sx?: BoxProps['sx']
	borderRadius?: number
}

export function MediaPlaceholder({
	kind,
	alt,
	title,
	children,
	sx,
	borderRadius,
}: MediaPlaceholderProps) {
	const { name, forceSize, color, color2 } = placeholderProps[kind] ?? placeholderProps.unknown
	return (
		<Box
			sx={{
				position: children ? 'relative' : 'absolute',
				inset: 0,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				background: color2 ? `linear-gradient(135deg, ${color} 0%, ${color2} 100%)` : color,
				borderRadius: borderRadius ? `${borderRadius}px` : undefined,
				...sx,
			}}
		>
			{children ?? (
				<Tooltip title={title ?? alt}>
					<Icon name={name} size={forceSize} color="contrast" />
				</Tooltip>
			)}
		</Box>
	)
}

type PlaceholderProps = {
	name: IconName
	forceSize: number
	color: string
	color2?: string
}

const placeholderProps: Record<MediaKind, PlaceholderProps> = {
	image: {
		name: 'image',
		forceSize: 80,
		color: '#3E4453',
		color2: '#363636',
	},
	video: {
		name: 'media-video',
		forceSize: 80,
		color: '#0ea5e9',
		color2: '#22c55e',
	},
	audio: {
		name: 'media-audio',
		forceSize: 80,
		color: '#a855f7',
		color2: '#f97316',
	},
	pdf: {
		name: 'media-pdf',
		forceSize: 80,
		color: '#64748b',
		color2: '#111827',
	},
	unknown: {
		name: 'do-not-disturb',
		forceSize: 80,
		color: '#ab2d2d',
	},
}

// TODO: Оставлено для будущего использования
// function renderPortfolioExtras(_props: unknown, { photo }: { photo: { kind?: MediaKind } }) {
// 	const kind = photo.kind
// 	if (!kind || kind === 'image') return null

// 	return (
// 		<Box
// 			sx={{
// 				position: 'absolute',
// 				inset: 0,
// 				display: 'flex',
// 				alignItems: 'center',
// 				justifyContent: 'center',
// 				pointerEvents: 'none',
// 			}}
// 		>
// 			<Icon
// 				name={getPlaceholderIcon(kind)}
// 				forceSize={40}
// 				sx={[
// 					{
// 						color: 'text.primary',
// 						opacity: 0.85,
// 						filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.12))',
// 					},
// 				]}
// 			/>
// 			<Box
// 				sx={{
// 					position: 'absolute',
// 					bottom: 8,
// 					left: 8,
// 					right: 8,
// 					display: 'flex',
// 					justifyContent: 'center',
// 					textAlign: 'center',
// 					opacity: 0.9,
// 				}}
// 			>
// 				<TS
// 					variant="caption"
// 					content={kind.toUpperCase()}
// 					sx={[
// 						{
// 							px: 1,
// 							py: 0.25,
// 							borderRadius: 999,
// 							backgroundColor: 'rgba(255,255,255,0.7)',
// 							backdropFilter: 'blur(6px)',
// 						},
// 					]}
// 				/>
// 			</Box>
// 		</Box>
// 	)
// }
