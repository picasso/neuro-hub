import { Inter } from 'next/font/google'

export const fontSans = Inter({
	subsets: ['latin', 'cyrillic'],
	weight: ['400', '500', '600', '700'],
	display: 'swap',
	variable: '--font-sans',
})
