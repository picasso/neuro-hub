import './globals.css'
import { fonts } from './fonts'
import type { ReactNode } from 'react'
import { AlertsPlugin } from '@/alerts'
import { DbHealthAlert } from '@/components/db-health-alert'
import { FontProvider, ThemeRegistry } from '@/components/providers'
import { Footer, Header } from '@/components/ui'
import { cn } from '@/lib/utils'

export { homeMetadata as metadata } from '@/config/metadata'
export { viewport } from '@/config/metadata/utils'

type RootLayoutProps = {
	children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
	return (
		<html lang="ru">
			<body
				className={cn(
					fonts.manrope.variable,
					fonts.inter.variable,
					fonts['open-sans'].variable,
				)}
				style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
			>
				<ThemeRegistry>
					<FontProvider>
						<AlertsPlugin />
						<DbHealthAlert />
						<Header />
						<main style={{ flex: 1 }}>{children}</main>
						<Footer />
					</FontProvider>
				</ThemeRegistry>
			</body>
		</html>
	)
}
