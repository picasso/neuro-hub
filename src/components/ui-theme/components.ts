import { type ThemeOptions } from '@mui/material/styles'
import { LinkBehaviour } from '@/components/ui'

export const components: ThemeOptions['components'] = {
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
}
