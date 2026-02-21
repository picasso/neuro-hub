import { Inter, Manrope, Open_Sans } from 'next/font/google'

const fontManrope = Manrope({
	subsets: ['latin', 'cyrillic'],
	weight: ['400', '500', '600', '700'],
	display: 'swap',
	variable: '--font-manrope',
})

const fontInter = Inter({
	subsets: ['latin', 'cyrillic'],
	weight: ['400', '500', '600', '700'],
	display: 'swap',
	variable: '--font-inter',
})

const fontOpenSans = Open_Sans({
	subsets: ['latin', 'cyrillic'],
	weight: ['400', '500', '600', '700'],
	display: 'swap',
	variable: '--font-open-sans',
})

const fontOptions = {
	manrope: fontManrope,
	inter: fontInter,
	'open-sans': fontOpenSans,
} as const

export type FontId = keyof typeof fontOptions

export const fontSans = fontOptions.manrope

export const fonts = fontOptions

export const fontLabels: Record<FontId, string> = {
	manrope: 'Manrope',
	inter: 'Inter',
	'open-sans': 'Open Sans',
}
