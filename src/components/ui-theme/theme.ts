import { createTheme } from '@mui/material/styles'
import { animations } from './animations'
import { components } from './components'

export const theme = createTheme({
	cssVariables: true,
	palette: {
		mode: 'light',
		primary: {
			main: '#6366f1',
		},
		secondary: {
			main: '#ec4899',
		},
		contrast: {
			main: '#ffffff',
			light: '#f5f5f5',
			dark: '#e0e0e0',
			contrastText: '#000000',
		},
	},
	typography: {
		fontFamily: [
			'-apple-system',
			'BlinkMacSystemFont',
			'"Segoe UI"',
			'Roboto',
			'"Helvetica Neue"',
			'Arial',
			'sans-serif',
		].join(','),
	},
	components,
	animations,
})
