import { findIndex } from 'lodash'
import { useCallback, useEffect, useRef, useState } from 'react'
import { PortfolioAlbum, type PortfolioAlbumProps } from './portfolio-album'
import { type MediaItem } from './portfolio-item'
import { PortfolioViewer, type PortfolioViewerProps } from './portfolio-viewer'
import { useClickOutside } from '@/ui/hooks/use-click-outside'

export type PortfolioSelection = {
	id: MediaId
	item: MediaItem
	index: number
}

export type PortfolioSelectionActionsArgs = PortfolioSelection & {
	disabled?: boolean
	clearSelection: () => void
	openPreview: () => void
}

type MediaId = MediaItem['id']

export type PortfolioProps = {
	items: PortfolioAlbumProps['items']
	disabled?: boolean
	allowSelection?: boolean
	selectedActions?: PortfolioAlbumProps['selectedActions']
	onAction?: PortfolioAlbumProps['onAction']
	selectedId?: PortfolioAlbumProps['selectedId']
	onSelect?: (selection: PortfolioSelection | null) => void
	linkActionPreview?: boolean
	fade?: PortfolioViewerProps['fade']
	fadeFn?: PortfolioViewerProps['fadeFn']
	debug?: PortfolioViewerProps['debug']
}

export function Portfolio({
	items,
	disabled,
	allowSelection,
	selectedActions = ['preview', 'delete'],
	selectedId,
	onSelect,
	onAction,
	linkActionPreview,
	fade,
	fadeFn,
	debug,
}: PortfolioProps) {
	const [openIndex, setOpenIndex] = useState<number | null>(null)
	const [proxySelectedId, setProxySelectedId] = useState<MediaId | null>(selectedId ?? null)

	useEffect(() => {
		if (selectedId !== undefined && selectedId !== proxySelectedId) {
			setProxySelectedId(selectedId)
		}
	}, [proxySelectedId, selectedId])

	const ref = useRef<HTMLDivElement>(null)
	useClickOutside(ref, () => {
		onSelect?.(null)
		setProxySelectedId(null)
	})

	const onClick = useCallback(
		(item: MediaItem, index: number) => {
			if (allowSelection) {
				if (proxySelectedId === item.id) {
					setProxySelectedId(null)
					onSelect?.(null)
				} else {
					setProxySelectedId(item.id)
					onSelect?.({ id: item.id, item, index })
				}
			} else {
				setOpenIndex(index)
				return
			}
		},
		[allowSelection, onSelect, proxySelectedId],
	)

	const onActionProxy = useCallback<NonNullable<PortfolioAlbumProps['onAction']>>(
		(id, action) => {
			onAction?.(id, action)
			if (linkActionPreview && action === 'preview') {
				const index = findIndex(items, { id })
				if (index !== -1) setOpenIndex(index)
			}
		},
		[items, linkActionPreview, onAction],
	)

	return (
		<>
			<PortfolioAlbum
				ref={ref}
				items={items}
				selectedActions={selectedActions}
				selectedId={proxySelectedId}
				onClick={onClick}
				onAction={onActionProxy}
				disabled={disabled}
			/>
			<PortfolioViewer
				items={items}
				openIndex={openIndex}
				onClose={() => setOpenIndex(null)}
				fade={fade}
				fadeFn={fadeFn}
				debug={debug}
			/>
		</>
	)
}
