import './globals.css'
import { fontSans } from './fonts'
import type { ReactNode } from 'react'
import { AlertsPlugin } from '@/alerts'
import { DbHealthAlert } from '@/features/db-health-alert'
import { Footer } from '@/features/footer'
import { Header } from '@/features/header'
import { ThemeRegistry, TooltipProvider } from '@/ui'

export { homeMetadata as metadata, viewport } from '@/config'

type RootLayoutProps = {
	children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
	return (
		<html lang="ru">
			<body
				className={fontSans.variable}
				style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
			>
				<ThemeRegistry>
					<TooltipProvider>
						<AlertsPlugin />
						<DbHealthAlert />
						<Header />
						<main style={{ flex: 1 }}>{children}</main>
						<Footer />
					</TooltipProvider>
				</ThemeRegistry>
			</body>
		</html>
	)
}
