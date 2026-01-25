'use client'

import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter'
import type { ReactNode } from 'react'
import { theme } from '@/components/ui-theme'

type ThemeRegistryProps = {
	children: ReactNode
}

export function ThemeRegistry({ children }: ThemeRegistryProps) {
	return (
		<AppRouterCacheProvider>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				{children}
			</ThemeProvider>
		</AppRouterCacheProvider>
	)
}
