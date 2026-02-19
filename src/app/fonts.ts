import { Manrope } from 'next/font/google'

export const fontSans = Manrope({
	subsets: ['latin', 'cyrillic'],
	weight: ['400', '500', '600', '700'],
	display: 'swap',
	variable: '--font-sans',
})
