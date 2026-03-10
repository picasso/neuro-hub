import './globals.css'
import { fontSans } from './fonts'
import type { ReactNode } from 'react'
import { AlertsPlugin } from '@/alerts'
import { DbHealthAlert } from '@/features/db-health-alert'
import { Footer } from '@/features/footer'
import { Header } from '@/features/header'
import { DebugPlugin } from '@/lib/logger/debug-plugin'
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
					<DebugPlugin />
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
