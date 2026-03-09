'use client'

import { useState } from 'react'
import { PortfolioAlbum, type PortfolioAlbumProps } from './portfolio-album'
import { PortfolioViewer } from './portfolio-viewer'

export type PortfolioProps = {
	items: PortfolioAlbumProps['items']
	disabled?: boolean
}

export function Portfolio({ items, disabled }: PortfolioProps) {
	const [openIndex, setOpenIndex] = useState<number | null>(null)

	return (
		<>
			<PortfolioAlbum
				items={items}
				onOpen={(index) => setOpenIndex(index)}
				disabled={disabled}
			/>
			<PortfolioViewer
				items={items}
				openIndex={openIndex}
				onClose={() => setOpenIndex(null)}
			/>
		</>
	)
}
