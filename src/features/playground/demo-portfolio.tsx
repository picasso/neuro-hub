'use client'

import { random, reduce, shuffle, uniqueId } from 'lodash'
import { useMemo } from 'react'
import { DemoRoot, DemoSection } from './components-utils'
import { type PortfolioDemoState } from './demo-portfolio-settings'
import { pictures } from './pictures'
import { useSettings } from './settings-store'
import { Portfolio, type MediaItem } from '@/features'

export function PortfolioDemo() {
	const settings = useSettings<PortfolioDemoState>()
	const { title: __, disabled, onlyImages, refreshKey } = settings

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const items = useMemo(() => getItems(onlyImages), [onlyImages, refreshKey])

	return (
		<DemoRoot>
			<DemoSection
				title="Portfolio"
				desc="Media `?Portfolio` —> **React Photo Album** and `Dialog` viewer"
				className="pt-6"
			>
				<Portfolio
					// title={title ? 'Портфолио' : undefined}
					disabled={disabled}
					items={items}
				/>
			</DemoSection>
		</DemoRoot>
	)
}

const getItems = (onlyImages: boolean) => {
	const itemCount = pictures.length
	const indexes: number[] = []
	while (true) {
		const index = random(0, itemCount - 1)
		if (indexes.includes(index)) continue
		indexes.push(index)
		if (indexes.length === 3) break
	}

	return reduce(
		shuffle(pictures),
		(acc, picture, index) => {
			if (!onlyImages) {
				if (index === indexes[0]) {
					acc.push({
						id: uniqueId('video-'),
						title: 'Video item',
						mediaUrl:
							'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
						mediaType: 'video/mp4',
					})
				}
				if (index === indexes[1]) {
					acc.push({
						id: uniqueId('audio-'),
						title: 'Audio item',
						mediaUrl:
							'https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3',
						mediaType: 'audio/mpeg',
					})
				}
				if (index === indexes[2]) {
					acc.push({
						id: uniqueId('pdf-'),
						title: 'PDF item',
						mediaUrl:
							'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
						mediaType: 'application/pdf',
					})
				}
			}
			acc.push({
				id: uniqueId('image-'),
				title: picture.file.replace('.jpg', '').replace(/-/g, ' '),
				mediaUrl: `/playground/pictures/${picture.file}`,
				mediaType: 'image/jpeg',
				mediaWidth: picture.width,
				mediaHeight: picture.height,
			})
			return acc
		},
		[] as MediaItem[],
	)
}
