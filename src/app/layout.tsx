import type { ReactNode } from 'react'
import { ThemeRegistry } from '@/components/providers'
import { Footer, Header } from '@/components/ui'

export { homeMetadata as metadata } from '@/config/metadata'

type RootLayoutProps = {
	children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
	return (
		<html lang="ru">
			<body style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
				<ThemeRegistry>
					<Header />
					<main style={{ flex: 1 }}>{children}</main>
					<Footer />
				</ThemeRegistry>
			</body>
		</html>
	)
}
