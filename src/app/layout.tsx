import { fontSans } from './fonts'
import type { ReactNode } from 'react'
import { AlertsPlugin } from '@/alerts'
import { ThemeRegistry } from '@/components/providers'
import { Footer, Header } from '@/components/ui'

export { homeMetadata as metadata } from '@/config/metadata'
export { viewport } from '@/config/metadata/utils'

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
					<AlertsPlugin />
					<Header />
					<main style={{ flex: 1 }}>{children}</main>
					<Footer />
				</ThemeRegistry>
			</body>
		</html>
	)
}
