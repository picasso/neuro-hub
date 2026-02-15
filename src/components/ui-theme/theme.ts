import { alpha, createTheme } from '@mui/material/styles'
import { animations } from './animations'
import { components } from './components'

export const theme = createTheme({
	cssVariables: true,
	palette: {
		mode: 'light',
		primary: {
			main: '#1dbf73',
			dark: '#169e5f',
			light: '#35d48d',
		},
		secondary: {
			// neutral “ink” accent (used sparingly)
			main: '#404145',
			dark: '#2e2f33',
			light: '#62646a',
		},
		background: {
			default: '#f7f7f7',
			paper: '#ffffff',
		},
		text: {
			primary: '#404145',
			secondary: '#62646a',
		},
		divider: '#e4e5e7',
		action: {
			hover: alpha('#404145', 0.04),
			selected: alpha('#404145', 0.06),
			disabled: alpha('#404145', 0.26),
			disabledBackground: alpha('#404145', 0.08),
			focus: alpha('#1dbf73', 0.2),
		},
		error: {
			main: '#e53935',
			dark: '#ab2d2d',
		},
		warning: {
			main: '#fb8c00',
		},
		info: {
			main: '#1e88e5',
		},
		success: {
			// warmer success (distinct from primary)
			main: '#2fb344',
			dark: '#239a39',
			light: '#63d26f',
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
			'var(--font-sans)',
			'-apple-system',
			'BlinkMacSystemFont',
			'"Segoe UI"',
			'Roboto',
			'"Helvetica Neue"',
			'Arial',
			'sans-serif',
		].join(', '),
		h1: { fontSize: '2rem', lineHeight: 1.2, fontWeight: 700, letterSpacing: '-0.02em' },
		h2: { fontSize: '1.75rem', lineHeight: 1.25, fontWeight: 700, letterSpacing: '-0.02em' },
		h3: { fontSize: '1.5rem', lineHeight: 1.3, fontWeight: 700, letterSpacing: '-0.01em' },
		h4: { fontSize: '1.25rem', lineHeight: 1.35, fontWeight: 700 },
		h5: { fontSize: '1.125rem', lineHeight: 1.4, fontWeight: 700 },
		h6: { fontSize: '1rem', lineHeight: 1.45, fontWeight: 700 },
		subtitle1: { fontSize: '1rem', lineHeight: 1.5, fontWeight: 600 },
		subtitle2: { fontSize: '0.875rem', lineHeight: 1.5, fontWeight: 600 },
		body1: { fontSize: '1rem', lineHeight: 1.6, fontWeight: 500 },
		body2: { fontSize: '0.875rem', lineHeight: 1.6, fontWeight: 500 },
		caption: { fontSize: '0.8125rem', lineHeight: 1.5, fontWeight: 500 },
		button: { fontSize: '0.875rem', lineHeight: 1.2, fontWeight: 600, textTransform: 'none' },
	},
	shape: {
		borderRadius: 8,
	},
	components,
	animations,
})
