import './globals.css'
import { fonts } from './fonts'
import type { ReactNode } from 'react'
import { AlertsPlugin } from '@/alerts'
import { DbHealthAlert } from '@/features/db-health-alert'
import { Footer } from '@/features/footer'
import { Header } from '@/features/header'
import { cn } from '@/lib/utils'
import { FontProvider, ThemeRegistry, TooltipProvider } from '@/ui'

export { homeMetadata as metadata, viewport } from '@/config'

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
					<TooltipProvider>
						<FontProvider>
							<AlertsPlugin />
							<DbHealthAlert />
							<Header />
							<main style={{ flex: 1 }}>{children}</main>
							<Footer />
						</FontProvider>
					</TooltipProvider>
				</ThemeRegistry>
			</body>
		</html>
	)
}
