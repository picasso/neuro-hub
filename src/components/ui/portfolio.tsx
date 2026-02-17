'use client'

import { useState } from 'react'
import { PortfolioAlbum, type PortfolioAlbumProps } from './portfolio-album'
import { PortfolioViewer } from '@/components/ui/portfolio-viewer'

export type PortfolioProps = {
	items: PortfolioAlbumProps['items']
}

export function Portfolio({ items }: PortfolioProps) {
	const [openIndex, setOpenIndex] = useState<number | null>(null)

	return (
		<>
			<PortfolioAlbum items={items} onOpen={(index) => setOpenIndex(index)} />
			<PortfolioViewer
				items={items}
				openIndex={openIndex}
				onChangeIndex={(index) => setOpenIndex(index)}
				onClose={() => setOpenIndex(null)}
			/>
		</>
	)
}
