import { map } from 'lodash'
import { type RefObject, useMemo } from 'react'
import { ColumnsPhotoAlbum } from 'react-photo-album'
import 'react-photo-album/columns.css'
import {
	type ExtendedPhoto,
	type MediaAction,
	type MediaActionFn,
	type MediaItem,
	type MediaKind,
	renderMediaItem,
} from './portfolio-item'
import { getMediaKind } from './portfolio-viewer'

export type PortfolioAlbumProps = {
	ref?: RefObject<HTMLDivElement | null>
	items: MediaItem[]
	spacing?: number
	disabled?: boolean
	selectedId?: string | null
	selectedActions?: MediaAction[]
	onOpen?: (index: number) => void
	onClick?: (item: MediaItem, index: number) => void
	onAction?: MediaActionFn
}

export function PortfolioAlbum({
	ref,
	items,
	spacing = 6,
	selectedId,
	selectedActions,
	onOpen,
	onClick,
	onAction,
	disabled,
}: PortfolioAlbumProps) {
	const photos = useMemo(
		() =>
			map(items, (item) => {
				const kind = getMediaKind(item.mediaType)
				const { width, height } = getDimensions(kind, item)

				return {
					key: item.id,
					src: item.mediaUrl,
					width,
					height,
					alt: item.title,
					title: item.title,
					label: `Open portfolio item: ${item.title}`,
					kind,
				} as ExtendedPhoto
			}),
		[items],
	)

	return (
		<ColumnsPhotoAlbum
			ref={ref}
			photos={photos}
			columns={(containerWidth) => {
				if (containerWidth < 420) return 2
				if (containerWidth < 720) return 3
				return 4
			}}
			spacing={spacing}
			padding={0}
			onClick={
				disabled
					? undefined
					: ({ index }) => {
							const item = items[index]
							if (!item) return
							onClick?.(item, index)
							onOpen?.(index)
						}
			}
			render={{
				image: (props, context) =>
					renderMediaItem(
						props,
						context,
						6,
						String(context.photo.key) === selectedId,
						onAction,
						selectedActions,
					),
			}}
		/>
	)
}

const defaultSizes = { width: 400, height: 400 }
function getDimensions(kind: MediaKind, item: MediaItem) {
	if (kind === 'image' && item.mediaWidth && item.mediaHeight) {
		return {
			width: item.mediaWidth,
			height: item.mediaHeight,
		}
	}
	if (kind === 'video') return { ...defaultSizes, height: (defaultSizes.height / 16) * 9 }
	if (kind === 'audio') return defaultSizes
	if (kind === 'pdf') return defaultSizes
	return defaultSizes
}
