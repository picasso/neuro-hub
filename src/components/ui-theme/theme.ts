import { createTheme } from '@mui/material/styles'
import { LinkBehaviour } from '@/components/ui'

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
	components: {
		MuiLink: {
			defaultProps: {
				component: LinkBehaviour,
			},
		},
		MuiButtonBase: {
			defaultProps: {
				LinkComponent: LinkBehaviour,
			},
		},
		MuiButton: {
			styleOverrides: {
				root: {
					textTransform: 'none',
					fontWeight: 600,
				},
			},
		},
	},
})
