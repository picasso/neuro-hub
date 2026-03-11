import './globals.css'
import { fontSans } from './fonts'
import type { ReactNode } from 'react'
import { AlertsPlugin } from '@/alerts'
import { DbHealthAlert } from '@/features/db-health-alert'
import { DebugPlugin } from '@/lib/logger/debug-plugin'
import { ModalPlugin } from '@/modals'
import { TooltipProvider } from '@/ui'

export { homeMetadata as metadata, viewport } from '@/config'

type RootLayoutProps = {
	children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
	return (
		<html lang="ru">
			<body className={`${fontSans.variable} min-h-screen bg-background text-foreground`}>
				<TooltipProvider>
					<DebugPlugin />
					<AlertsPlugin />
					<ModalPlugin />
					<DbHealthAlert />
					{children}
				</TooltipProvider>
			</body>
		</html>
	)
}
