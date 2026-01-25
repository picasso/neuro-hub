import { BASE_URL, SITE_NAME, TITLE_SEPARATOR } from './constants'
import type { Metadata, Viewport } from 'next'

type MetadataParams = {
	title?: string
	description?: string
	path?: string
	image?: string
	noIndex?: boolean
}

export const createTitle = (pageTitle?: string): string => {
	if (!pageTitle) return SITE_NAME
	return `${pageTitle} ${TITLE_SEPARATOR} ${SITE_NAME}`
}

export const createMetadata = ({
	title,
	description,
	path = '',
	image,
	noIndex = false,
}: MetadataParams): Metadata => {
	const fullTitle = createTitle(title)
	const url = `${BASE_URL}${path}`

	return {
		title: fullTitle,
		description,
		...(noIndex && { robots: { index: false, follow: false } }),
		openGraph: {
			title: fullTitle,
			description,
			url,
			siteName: SITE_NAME,
			...(image && { images: [{ url: image }] }),
			locale: 'ru_RU',
			type: 'website',
		},
		twitter: {
			card: 'summary_large_image',
			title: fullTitle,
			description,
			...(image && { images: [image] }),
		},
	}
}

export const viewport: Viewport = {
	width: 'device-width',
	initialScale: 1,
	maximumScale: 5,
	userScalable: true,
	themeColor: '#1976d2',
}
