'use client'

import Stack from '@mui/material/Stack'
import { random, reduce, shuffle, uniqueId } from 'lodash'
import { useMemo, useState } from 'react'
import { pictures } from './pictures'
import { Button, Portfolio, type MediaItem } from '@/components/ui'

export function PortfolioDemo() {
	const [inputKey, setInputKey] = useState(0)
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const items = useMemo(() => getItems(), [inputKey])

	return (
		<Stack spacing={2} direction="column" flexShrink={1}>
			<Button
				size="lg"
				label="Refresh"
				leftIcon="collections"
				iconOptions={{ color: 'contrast' }}
				onClick={() => setInputKey((k) => k + 1)}
				// TODO: check after migration
				className="w-50 self-end"
			/>
			<Portfolio items={items} />
		</Stack>
	)
}

const getItems = () => {
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
