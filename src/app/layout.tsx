import './globals.css'
import '@/lib/logger/debug-load'
import { fontSans } from './fonts'
import type { ReactNode } from 'react'
import { AlertsPlugin } from '@/alerts'
import { DbHealthAlert } from '@/features/db-health-alert'
import { Footer } from '@/features/footer'
import { Header } from '@/features/header'
import { TooltipProvider } from '@/ui'

export { homeMetadata as metadata, viewport } from '@/config'

type RootLayoutProps = {
	children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
	return (
		<html lang="ru">
			<body className={`${fontSans.variable} flex flex-col min-h-screen`}>
				<TooltipProvider>
					<AlertsPlugin />
					<DbHealthAlert />
					<Header />
					<main className="flex-1">{children}</main>
					<Footer />
				</TooltipProvider>
			</body>
		</html>
	)
}
